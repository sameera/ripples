# ADR-001: DynamoDB Single-Table Database Design

| Field      | Value                    |
|------------|--------------------------|
| **Status** | Accepted                 |
| **Date**   | 2026-02-21               |
| **Author** | Architecture             |

---

## Context

Ripples needs a persistent data store for all product entities: Organizations, Teams, Streams, Sprints, Work Items, Ripples, and Users. The data model is relationship-rich (Work Items belong to multiple Streams; Ripples are anchored to Work Items, Days, and Users) and has a clear set of access patterns dominated by the daily Pulse view.

### Requirements

- **Read-heavy**: The Pulse canvas — the primary product surface — is rendered multiple times per day per user across all active Work Items in a Stream.
- **Predictable write volume**: One Ripple per User per Work Item per Day. Low, steady write rate.
- **Flexible querying**: The same data must be queried by Stream (Pulse view), by Work Item (detail view), by User (personal history), and by Team Leader (retroactive approval queue).
- **Stagnation detection**: Must efficiently determine the most recent approved Ripple date per Work Item without scanning full Ripple history on every request.
- **MVP scale**: Small-to-mid-size engineering organizations (10–200 users). No multi-region requirement.

### Evaluated Alternatives

| Option | Reasoning |
|--------|-----------|
| **PostgreSQL (RDS/Aurora)** | Strong relational fit. However, requires VPC, EC2/RDS instances, connection pooling, and schema migrations — operational overhead disproportionate to MVP scale. Chosen against to keep infrastructure minimal. |
| **PlanetScale / Neon (serverless Postgres)** | Reduces operational burden. Still requires SQL schema evolution. Not rejected outright — a valid future migration path if relational expressiveness is needed. |
| **DynamoDB** | Serverless, pay-per-use, zero operational overhead, scales from zero. Access patterns are well-defined and fit NoSQL table design. Chosen. |
| **MongoDB Atlas** | Document model doesn't add value over DynamoDB for this access pattern set. Adds a third-party dependency without clear benefit. |

---

## Decision

Use **AWS DynamoDB** with a **single-table design** as the primary data store.

**Rationale:**
- Serverless: no connection pools, no instance sizing, no idle costs at MVP scale.
- Single-table design eliminates cross-table joins; all access patterns are served by key-condition expressions against one table plus three GSIs.
- Transactional writes (TransactWrite) allow atomic updates across entity types (e.g., writing a Ripple and updating the Work Item's `lastApprovedRippleDate` in one operation).
- DynamoDB Local / LocalStack enables full local development without cloud dependency.

---

## Schema Design

### Conventions

- **PK** — Partition Key (String). Format: `<EntityType>#<id>` (e.g., `ITEM#01JNXXX`).
- **SK** — Sort Key (String). Encodes entity type and sub-ordering (e.g., `METADATA`, `RIPPLE#2026-02-21#<userId>`).
- **IDs** — ULID format for all entities except Users (lexicographically sortable by creation time). UUID v4 is acceptable but ULIDs are preferred. **User IDs are email addresses** — the stable unique identifier provided by AWS Cognito on authentication. Using email directly eliminates any mapping layer between the Cognito ID token `email` claim and DynamoDB keys. The Cognito sub UUID is stored as a secondary attribute (`cognitoSub`) for reverse lookup and admin operations.
- **Dates** — ISO 8601 (`YYYY-MM-DD`). Lexicographic sort equals chronological sort.
- **Sparse GSIs** — GSI key attributes left unset on records that should not appear in that index. DynamoDB excludes items with missing GSI keys from the index.
- **Null attributes** — Omit rather than set to null. DynamoDB charges by attribute size; absent attributes have no cost.

---

### Table: `ripples`

**Primary Key**: `PK` (String) + `SK` (String)

**GSIs**:

| GSI | Partition Key | Sort Key | Purpose |
|-----|--------------|----------|---------|
| `GSI1` | `GSI1PK` (String) | `GSI1SK` (String) | Hierarchical and reverse-lookup queries (org→team, team→stream, user→team, item→stream, etc.) |
| `GSI2` | `GSI2PK` (String) | `GSI2SK` (String) | User Ripple timeline (all Ripples authored by a User, sorted by day) |
| `GSI3` | `GSI3PK` (String) | `GSI3SK` (String) | Retroactive approval queue — **sparse index**, only populated on pending retroactive Ripples |

All GSIs use `ALL` projection for simplicity at MVP scale. Switch to `INCLUDE` projections once query patterns are stable and cost optimization is needed.

---

### Entity Records

#### ORGANIZATION

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `ORG#<orgId>` |
| `SK` | `METADATA` |
| `type` | `ORGANIZATION` |
| `orgId` | ULID |
| `name` | String |
| `slug` | String (unique, URL-safe) |
| `createdAt` | ISO 8601 timestamp |
| `planTier` | `free` \| `pro` (future) |

```json
{
    "PK": "ORG#01JNORG000",
    "SK": "METADATA",
    "type": "ORGANIZATION",
    "orgId": "01JNORG000",
    "name": "Acme Engineering",
    "slug": "acme",
    "createdAt": "2026-02-01T09:00:00Z"
}
```

---

#### USER

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `USER#<email>` |
| `SK` | `METADATA` |
| `type` | `USER` |
| `userId` | String — the user's email address (matches `PK` fragment; serves as the stable app-level identifier) |
| `cognitoSub` | String — Cognito sub UUID (stored for reverse lookup and admin operations; not used as a DynamoDB key) |
| `orgId` | ULID |
| `name` | String |
| `email` | String |
| `role` | `member` \| `team_leader` \| `admin` |
| `avatarUrl` | String (optional) |
| `createdAt` | ISO 8601 timestamp |
| `GSI1PK` | `ORG#<orgId>` |
| `GSI1SK` | `USER#<email>` |

**GSI1 enables**: "List all Users in an Organization"

```json
{
    "PK": "USER#alice@acme.com",
    "SK": "METADATA",
    "type": "USER",
    "userId": "alice@acme.com",
    "cognitoSub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "orgId": "01JNORG000",
    "name": "Alice Chen",
    "email": "alice@acme.com",
    "role": "team_leader",
    "createdAt": "2026-02-01T10:00:00Z",
    "GSI1PK": "ORG#01JNORG000",
    "GSI1SK": "USER#alice@acme.com"
}
```

---

#### COGNITO_USER

Reverse-lookup record created atomically with each USER record. Maps a Cognito sub UUID to the user's email address. Needed when only the Cognito sub is available — e.g., Cognito Lambda triggers, user pool management callbacks, or admin SDK operations that return sub but not email.

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `COGNITO#<cognitoSub>` |
| `SK` | `METADATA` |
| `type` | `COGNITO_USER` |
| `cognitoSub` | String — Cognito sub UUID |
| `email` | String — the user's email address |

Created atomically with the USER record via `TransactWriteItems`. No GSI keys — accessed only by `GetItem(PK=COGNITO#<sub>, SK=METADATA)`.

```json
{
    "PK": "COGNITO#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "SK": "METADATA",
    "type": "COGNITO_USER",
    "cognitoSub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "alice@acme.com"
}
```

---

#### TEAM

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `TEAM#<teamId>` |
| `SK` | `METADATA` |
| `type` | `TEAM` |
| `teamId` | ULID |
| `orgId` | ULID |
| `name` | String |
| `description` | String (optional) |
| `createdAt` | ISO 8601 timestamp |
| `GSI1PK` | `ORG#<orgId>` |
| `GSI1SK` | `TEAM#<teamId>` |

**GSI1 enables**: "List all Teams in an Organization"

---

#### TEAM_MEMBERSHIP

One record per (Team, User) pair. Encodes the User's role within that Team.

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `TEAM#<teamId>` |
| `SK` | `MEMBER#<email>` |
| `type` | `TEAM_MEMBERSHIP` |
| `teamId` | ULID |
| `userId` | String — the user's email address |
| `role` | `member` \| `team_leader` |
| `joinedAt` | ISO 8601 timestamp |
| `GSI1PK` | `USER#<email>` |
| `GSI1SK` | `TEAM#<teamId>` |

**Base table enables**: "List all members of a Team" — `Query(PK=TEAM#<teamId>, SK begins_with MEMBER#)`

**GSI1 enables**: "Get all Teams a User belongs to" — `GSI1.Query(GSI1PK=USER#<email>)`

---

#### STREAM

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `STREAM#<streamId>` |
| `SK` | `METADATA` |
| `type` | `STREAM` |
| `streamId` | ULID |
| `teamId` | ULID |
| `name` | String |
| `description` | String (optional) |
| `status` | `active` \| `archived` |
| `stagnationThresholdDays` | Number (default: `3`) |
| `createdAt` | ISO 8601 timestamp |
| `GSI1PK` | `TEAM#<teamId>` |
| `GSI1SK` | `STREAM#<streamId>` |

**GSI1 enables**: "List all Streams in a Team" — `GSI1.Query(GSI1PK=TEAM#<teamId>, GSI1SK begins_with STREAM#)`

---

#### SPRINT

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `SPRINT#<sprintId>` |
| `SK` | `METADATA` |
| `type` | `SPRINT` |
| `sprintId` | ULID |
| `streamId` | ULID |
| `teamId` | ULID |
| `name` | String (e.g., `Sprint 12`) |
| `goal` | String (optional) |
| `startDate` | ISO 8601 date (`YYYY-MM-DD`) |
| `endDate` | ISO 8601 date (`YYYY-MM-DD`) |
| `status` | `planned` \| `active` \| `completed` |
| `createdAt` | ISO 8601 timestamp |
| `GSI1PK` | `STREAM#<streamId>` |
| `GSI1SK` | `SPRINT#<sprintId>` |

**GSI1 enables**: "List all Sprints in a Stream" — `GSI1.Query(GSI1PK=STREAM#<streamId>, GSI1SK begins_with SPRINT#)`

---

#### WORK_ITEM

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `ITEM#<itemId>` |
| `SK` | `METADATA` |
| `type` | `WORK_ITEM` |
| `itemId` | ULID |
| `title` | String |
| `description` | String (optional) |
| `itemType` | `story` \| `task` \| `incident` \| `objective` \| `other` |
| `status` | String (open/in-progress/done — product-defined) |
| `ownerId` | String — the owner's email address (optional) |
| `externalRef` | String (optional — Jira key, Linear ID, etc.) |
| `createdAt` | ISO 8601 timestamp |
| `lastRippleDate` | ISO 8601 date (denormalized, updated on every Ripple write) |
| `lastApprovedRippleDate` | ISO 8601 date (denormalized — drives stagnation; updated on Ripple write if non-retroactive, or on retroactive approval) |

**Note**: WORK_ITEM is not directly queryable by Stream from the base table. Use STREAM_ITEM records (below) for stream-scoped Work Item queries. The base table record is fetched by ID using `GetItem`.

---

#### STREAM_ITEM

One record per (Stream, Work Item) membership. Denormalizes stagnation-critical dates to avoid scanning Ripple history.

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `STREAM#<streamId>` |
| `SK` | `ITEM#<itemId>` |
| `type` | `STREAM_ITEM` |
| `streamId` | ULID |
| `itemId` | ULID |
| `addedAt` | ISO 8601 timestamp |
| `lastRippleDate` | ISO 8601 date (denormalized) |
| `lastApprovedRippleDate` | ISO 8601 date (denormalized — drives stagnation computation) |
| `GSI1PK` | `ITEM#<itemId>` |
| `GSI1SK` | `STREAM#<streamId>` |

**Base table enables**: "List all Work Items in a Stream (with stagnation data)" — `Query(PK=STREAM#<streamId>, SK begins_with ITEM#)`

**GSI1 enables**: "Get all Streams a Work Item belongs to" — `GSI1.Query(GSI1PK=ITEM#<itemId>, GSI1SK begins_with STREAM#)`

---

#### SPRINT_ITEM

One record per (Sprint, Work Item) membership. Sprints reference Work Items; they do not own them.

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `SPRINT#<sprintId>` |
| `SK` | `ITEM#<itemId>` |
| `type` | `SPRINT_ITEM` |
| `sprintId` | ULID |
| `itemId` | ULID |
| `addedAt` | ISO 8601 timestamp |
| `GSI1PK` | `ITEM#<itemId>` |
| `GSI1SK` | `SPRINT#<sprintId>` |

**Base table enables**: "List all Work Items in a Sprint" — `Query(PK=SPRINT#<sprintId>, SK begins_with ITEM#)`

**GSI1 enables**: "Get all Sprints a Work Item belongs to" — `GSI1.Query(GSI1PK=ITEM#<itemId>, GSI1SK begins_with SPRINT#)`

---

#### RIPPLE

Primary Ripple record. One per (Work Item, Day, User) — the unique constraint is enforced by the SK structure.

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `ITEM#<itemId>` |
| `SK` | `RIPPLE#<day>#<email>` — e.g., `RIPPLE#2026-02-21#alice@acme.com` |
| `type` | `RIPPLE` |
| `rippleId` | ULID |
| `itemId` | ULID |
| `day` | ISO 8601 date (`YYYY-MM-DD`) |
| `authorId` | String — the author's email address |
| `teamId` | ULID (denormalized for GSI3 key construction) |
| `whatChanged` | String |
| `whatIntended` | String (optional) |
| `blocker` | String (optional) |
| `confidenceLevel` | `low` \| `medium` \| `high` |
| `isRetroactive` | Boolean |
| `approvalStatus` | `pending` \| `approved` \| `rejected` (only set when `isRetroactive=true`) |
| `approvedBy` | String — approving Team Leader's email address (only set when approved/rejected) |
| `approvedAt` | ISO 8601 timestamp (only set when approved/rejected) |
| `createdAt` | ISO 8601 timestamp |
| `GSI2PK` | `USER#<authorId>` — e.g., `USER#alice@acme.com` |
| `GSI2SK` | `<day>#ITEM#<itemId>` — e.g., `2026-02-21#ITEM#01JNITEM01` |
| `GSI3PK` | `PENDING#TEAM#<teamId>` — **only set** when `isRetroactive=true AND approvalStatus=pending` |
| `GSI3SK` | `<createdAt>` — **only set** when `GSI3PK` is set |

**Unique-per-day enforcement**: Because `SK = RIPPLE#<day>#<email>`, a `PutItem` with `ConditionExpression: attribute_not_exists(PK)` enforces the one-Ripple-per-user-per-item-per-day constraint.

**Base table enables**: "Get all Ripples for a Work Item (newest first)" — `Query(PK=ITEM#<itemId>, SK begins_with RIPPLE#, ScanIndexForward=false)`

**GSI2 enables**: "Get all Ripples authored by a User (newest first)" — `GSI2.Query(GSI2PK=USER#<userId>, ScanIndexForward=false)`

**GSI3 enables**: "Get all pending retroactive Ripples for a Team's approval queue" — `GSI3.Query(GSI3PK=PENDING#TEAM#<teamId>, ScanIndexForward=false)` (sparse — only pending retroactive Ripples appear)

```json
{
    "PK": "ITEM#01JNITEM01",
    "SK": "RIPPLE#2026-02-19#bob@acme.com",
    "type": "RIPPLE",
    "rippleId": "01JNRPL001",
    "itemId": "01JNITEM01",
    "day": "2026-02-19",
    "authorId": "bob@acme.com",
    "teamId": "01JNTEAM01",
    "whatChanged": "Finished the API endpoint for Pulse view, all unit tests passing.",
    "whatIntended": "Deploy to staging.",
    "confidenceLevel": "high",
    "isRetroactive": true,
    "approvalStatus": "pending",
    "createdAt": "2026-02-21T09:30:00Z",
    "GSI2PK": "USER#bob@acme.com",
    "GSI2SK": "2026-02-19#ITEM#01JNITEM01",
    "GSI3PK": "PENDING#TEAM#01JNTEAM01",
    "GSI3SK": "2026-02-21T09:30:00Z"
}
```

---

#### STREAM_RIPPLE

Denormalized copy of a Ripple record scoped to a Stream. One record per (Ripple × Stream the Work Item belongs to). Enables the Pulse view — the most frequent read path — to query a single partition key without needing to know which Work Items are in scope.

| Attribute | Value / Format |
|-----------|---------------|
| `PK` | `STREAM#<streamId>` |
| `SK` | `RIPPLE#<day>#<itemId>#<email>` — e.g., `RIPPLE#2026-02-21#01JNITEM01#alice@acme.com` |
| `type` | `STREAM_RIPPLE` |
| `streamId` | ULID |
| `day` | ISO 8601 date |
| `itemId` | ULID |
| `authorId` | String — the author's email address |
| `rippleId` | ULID (foreign key to the canonical RIPPLE record) |
| `whatChanged` | String (denormalized) |
| `whatIntended` | String (optional, denormalized) |
| `blocker` | String (optional, denormalized) |
| `confidenceLevel` | `low` \| `medium` \| `high` |
| `isRetroactive` | Boolean |
| `approvalStatus` | `pending` \| `approved` \| `rejected` \| not set |
| `createdAt` | ISO 8601 timestamp |
| `approvedAt` | ISO 8601 timestamp (optional) |

**Base table enables**: "Get all Ripples in a Stream for a date range (Pulse view)" — `Query(PK=STREAM#<streamId>, SK BETWEEN 'RIPPLE#<startDate>#' AND 'RIPPLE#<endDate>\xff', ScanIndexForward=false)`

SK sort order (`RIPPLE#<day>#<itemId>#<userId>`) groups Ripples by day (newest first with `ScanIndexForward=false`), then by item, then by author — natural for the Pulse canvas layout.

---

### GSI Summary

| GSI | Query by | Returns | Access Patterns Served |
|-----|----------|---------|------------------------|
| **GSI1** | Hierarchical parent → child | Entity metadata + membership records | List teams in org; List users in org; List streams in team; Get user's teams; List sprints in stream; Get streams for work item; Get sprints for work item |
| **GSI2** | `USER#<email>` | All RIPPLE records by that user, sorted by day desc | User's own Ripple history |
| **GSI3** | `PENDING#TEAM#<teamId>` | Pending retroactive RIPPLE records, sorted by createdAt | Team Leader approval queue (sparse — only pending retroactive Ripples) |

---

### Access Pattern → Query Mapping

| # | Access Pattern | Query |
|---|---------------|-------|
| 1 | **Pulse view** — Ripples in Stream X for date range | `Base.Query(PK=STREAM#<streamId>, SK BETWEEN 'RIPPLE#<start>#' AND 'RIPPLE#<end>\xff', ScanIndexForward=false)` → STREAM_RIPPLE records |
| 1b | **Team-scope Pulse** — Ripples across all Streams in Team | Step 1: `GSI1.Query(GSI1PK=TEAM#<teamId>, GSI1SK begins_with STREAM#)` → Stream IDs. Step 2: Parallel queries as per pattern 1. Merge in application. |
| 2 | **Work Item detail** — Full Ripple history for an item | `Base.Query(PK=ITEM#<itemId>, SK begins_with 'RIPPLE#', ScanIndexForward=false)` |
| 3 | **Retroactive approval queue** — Pending retroactive Ripples for a Team | `GSI3.Query(GSI3PK=PENDING#TEAM#<teamId>, ScanIndexForward=false)` |
| 4 | **Stagnation detection** — Last approved Ripple date per Work Item | `Base.Query(PK=STREAM#<streamId>, SK begins_with 'ITEM#')` → STREAM_ITEM records. Read `lastApprovedRippleDate`. Compare to today. No Ripple scan needed. |
| 5 | **Sprint scoping** — Work Items in Sprint, Ripples within Sprint dates | Step 1: `Base.GetItem(PK=SPRINT#<sprintId>, SK=METADATA)` → get startDate, endDate. Step 2: `Base.Query(PK=SPRINT#<sprintId>, SK begins_with ITEM#)` → itemIds. Step 3: Parallel `Base.Query(PK=STREAM#<streamId>, SK BETWEEN 'RIPPLE#<start>#<itemId>#' AND 'RIPPLE#<end>#<itemId>\xff')` per item — or query full date range and filter by itemId in application. |
| 6 | **User's own Ripples** — Authored Ripples, newest first | `GSI2.Query(GSI2PK=USER#<email>, ScanIndexForward=false)` |
| 7 | **Work Item list for Stream** — With stagnation data, paginated | `Base.Query(PK=STREAM#<streamId>, SK begins_with 'ITEM#')` → STREAM_ITEM records (contain lastRippleDate + lastApprovedRippleDate). `BatchGet` for WORK_ITEM METADATA if full item detail needed. |
| 8 | **Team membership & role lookup** — User's Teams and roles | `GSI1.Query(GSI1PK=USER#<email>)` → TEAM_MEMBERSHIP records |
| 9 | **Stream config** — Stagnation threshold and settings | `Base.GetItem(PK=STREAM#<streamId>, SK=METADATA)` |
| 10 | **Organization user list** — All Users in an Org | `GSI1.Query(GSI1PK=ORG#<orgId>, GSI1SK begins_with 'USER#')` |
| 11 | **Cognito sub reverse-lookup** — Resolve Cognito sub UUID to email (Cognito triggers, admin SDK callbacks) | `Base.GetItem(PK=COGNITO#<sub>, SK=METADATA)` → `email` attribute |

---

### Write Operations

#### Provisioning a New User

Triggered on first authenticated request (JWT verified, user record not yet in DynamoDB). Uses `TransactWriteItems` for atomicity:

1. `Put` USER record — `PK=USER#<email>`, `SK=METADATA`, includes `cognitoSub` attribute. `ConditionExpression: attribute_not_exists(PK)` guards against concurrent duplicate provisioning.
2. `Put` COGNITO_USER record — `PK=COGNITO#<sub>`, `SK=METADATA`. Enables reverse lookup by Cognito sub if ever needed.

**Token type**: Use the Cognito **ID token** (not the access token) because it carries both the `sub` and `email` claims. Verify `email_verified = true` before provisioning to prevent unverified address collisions.

**Race condition**: If two requests race to provision the same user, the `TransactWrite` that arrives second will fail its condition check and be discarded. The caller catches `TransactionCanceledException` and continues — the user record was created by the first request.

---

#### Writing a Ripple (non-retroactive)

Uses `TransactWriteItems` for atomicity:

1. `Put` RIPPLE record — with `ConditionExpression: attribute_not_exists(PK)` to enforce uniqueness.
2. `Put` one STREAM_RIPPLE record per Stream the Work Item belongs to.
3. `Update` each STREAM_ITEM: `SET lastRippleDate = :day, lastApprovedRippleDate = if_not_exists(lastApprovedRippleDate, :zero), lastApprovedRippleDate = :day IF :day > lastApprovedRippleDate`

    In practice this uses two update expressions or a conditional check-and-set:
    ```
    SET lastRippleDate = :day
    SET lastApprovedRippleDate = :day
    CONDITION: attribute_not_exists(lastApprovedRippleDate) OR lastApprovedRippleDate < :day
    ```
    (run with `ConditionExpression` or via application-level compare-and-set if the condition fails silently)

4. `Update` WORK_ITEM METADATA with same lastRippleDate / lastApprovedRippleDate logic.

**Transaction size**: For a Work Item in N Streams: `1 RIPPLE + N STREAM_RIPPLE + N STREAM_ITEM + 1 WORK_ITEM = 2N + 2` items. DynamoDB TransactWrite supports up to 100 items. This supports Work Items in up to 49 Streams — far beyond any realistic case.

#### Writing a Retroactive Ripple

Same as above but:
- RIPPLE record includes `isRetroactive=true`, `approvalStatus=pending`, `GSI3PK`, `GSI3SK`.
- STREAM_RIPPLE records include `isRetroactive=true`, `approvalStatus=pending`.
- **Does NOT update** `lastApprovedRippleDate` — pending Ripples do not resolve stagnation.
- **Does update** `lastRippleDate` (any Ripple, pending or approved, counts for last-touched date).

#### Approving a Retroactive Ripple

Uses `TransactWriteItems`:

1. `Update` RIPPLE: `SET approvalStatus=approved, approvedBy=:userId, approvedAt=:ts, REMOVE GSI3PK, REMOVE GSI3SK` (removing GSI3 keys drops the item from the approval queue index).
2. `Update` each STREAM_RIPPLE: `SET approvalStatus=approved, approvedAt=:ts`.
3. `Update` each STREAM_ITEM: `SET lastApprovedRippleDate=:day IF :day > lastApprovedRippleDate` (conditional max update).
4. `Update` WORK_ITEM METADATA: same conditional max update.

#### Rejecting a Retroactive Ripple

Uses `TransactWriteItems`:

1. `Update` RIPPLE: `SET approvalStatus=rejected, approvedBy=:userId, approvedAt=:ts, REMOVE GSI3PK, REMOVE GSI3SK`.
2. `Update` each STREAM_RIPPLE: `SET approvalStatus=rejected`.
3. No update to `lastApprovedRippleDate` (rejected Ripples have no effect on stagnation).

---

### Stagnation Computation

Stagnation is **not stored** — it is computed on read from `lastApprovedRippleDate` on STREAM_ITEM records.

```
stagnationDays = today - lastApprovedRippleDate (in calendar days)
isStagnant = stagnationDays > stream.stagnationThresholdDays
```

For Work Items that belong to multiple Streams with different thresholds, the most conservative (lowest) threshold applies — handled in application logic by reading all STREAM_ITEM records for the item.

This computation is O(1) per Work Item and requires no Ripple history scan.

---

## Consequences

### Benefits

- **Zero operational overhead at MVP scale**: No VPC, no instances, no connection pools, no patching. DynamoDB is fully managed.
- **Pay-per-use cost model**: Negligible cost at early-stage usage. On-demand capacity mode is recommended for MVP.
- **All critical access patterns served by key-condition queries**: No full-table scans in the hot path.
- **Stagnation detection is O(1)**: Denormalized `lastApprovedRippleDate` eliminates the need to scan Ripple history for every Work Item.
- **Atomic multi-record writes**: TransactWrite ensures Ripple + STREAM_RIPPLE + STREAM_ITEM updates are always consistent.

### Trade-offs and Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| **Write amplification for multi-stream Work Items** | Low | Medium | Typical Work Items belong to 1–3 Streams. Transaction size stays well under the 100-item limit. Monitor if this pattern grows. |
| **STREAM_RIPPLE data drift** (if a Work Item is removed from a Stream) | Medium | Low | On Stream membership removal, delete all STREAM_RIPPLE records for that item in that Stream. Implement as a cleanup task. At MVP scale, this is a low-frequency operation. |
| **Retroactive Ripple approval requires knowing all Streams** | Low | Low | On approval, the application reads STREAM_ITEM records (`GSI1.Query(GSI1PK=ITEM#<itemId>)`) to get all Streams, then updates STREAM_RIPPLE records in the same transaction. Two-phase read-then-write; acceptable. |
| **lastApprovedRippleDate drift** | Medium | Low | This attribute is the source of truth for stagnation. On retroactive approval, the conditional update (`SET x = :day IF :day > x`) is idempotent and correct. If a bug causes drift, a one-time repair scan can recompute from Ripple history. Add monitoring on stagnation accuracy. |
| **Hot partition on active Streams** | Low | Low (MVP) | A Stream with thousands of daily Ripples would concentrate writes on `STREAM#<streamId>`. At MVP scale (small teams, 10–50 Work Items per Stream), this is not a concern. Monitor partition throughput as usage grows. |
| **Schema evolution** | Medium | High (expected) | DynamoDB is schemaless — adding attributes to new items is free. New access patterns may require new GSIs (limit: 20 per table). Plan for 1-2 GSI additions as features mature. |
| **No SQL expressiveness for ad-hoc queries** | Medium | Medium (future) | Patterns view and analytics features may outgrow simple key-condition queries. Mitigation: export to S3 + Athena, or stream to a read-optimized store (OpenSearch, Redshift) when needed. DynamoDB Streams enable this without schema changes. |
| **Email as User identifier (PK)** | Medium | Low | Email address changes are rare but possible. A self-serve email change requires: (1) write new USER record at `USER#<newemail>`, (2) delete old USER record, (3) update COGNITO_USER to point to new email, (4) update all TEAM_MEMBERSHIP records (`GSI1PK`, `userId`, `SK`), and (5) rekey any RIPPLE / STREAM_RIPPLE records referencing the old email as `authorId`. This is a low-frequency, admin-supervised operation at MVP scale. Implement a gated email-change workflow before allowing users to self-serve email updates. |

### Local Development

Use **DynamoDB Local** (AWS-provided JAR) or **LocalStack** for local development and CI. A `docker-compose.yml` should provision a local DynamoDB instance. Table creation is scripted and idempotent (create-if-not-exists on startup).

### Capacity Mode

Use **on-demand** capacity for MVP. Switch to **provisioned** (with auto-scaling) when monthly cost exceeds ~$50 and usage patterns are stable enough to forecast.

### Point-in-Time Recovery (PITR)

Enable PITR on the production table. This provides 35-day continuous backup at low cost and is essential for the user-authored data (Ripples) that cannot be regenerated.

### Data Retention

Not defined at this stage. GDPR right-to-erasure compliance will require a User deletion workflow that removes or anonymizes all RIPPLE records authored by a User. Implement before handling EU user data.

---

## References

- [Information Architecture](../../product/information-architecture.md) — canonical entity definitions and terminology
- [Product Context](../../product/context.md) — product vision and personas
- [Technology Stack](../stack.md) — full stack overview
- AWS DynamoDB Developer Guide — Single Table Design
- AWS DynamoDB Developer Guide — Transactions
