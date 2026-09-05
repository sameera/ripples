---
title: "Which Microsoft Teams surfaces can a self-hosted Ripples deployment reach a team through, and what does each cost to build, host and operate?"
type: research
status: resolved
blocked_by: none
claimed_by: sameera
claimed_at: 2026-09-05T12:58:16Z
---

## Question

For a Ripples instance a team deploys into its own AWS account, which Microsoft Teams
surfaces are actually reachable, and what does each one cost? [asked: "which interactions are purely conversational over Microsoft Teams"]

Cover at least: a proactive message into a channel, a proactive message into a group chat,
an Adaptive Card and the round trip when someone presses a button on it, a Teams tab, and a
message extension. For each one, record three things — what the deployer has to set up in
their own Microsoft tenant, what we have to build and run, and what the surface can and
cannot display.

Microsoft Teams is the first conversational platform Ripples targets, not the only one this
product will ever run on. Price it as the first surface. What a second platform would cost,
and what the design may assume of any platform, is a separate ticket.

The stack document says AWS ships no managed Teams adapter. Because of this, we host the
messaging endpoint ourselves, and it calls the agent runtime. Establish what that endpoint
already gives us for free, and what each further surface adds on top of it.

## Why it blocks

The question "which user interfaces need building" has no answer until the alternatives are
priced. A Teams tab is a web page we write, host and secure; a channel post is a message the
endpoint we already run can send. Calling both "a UI" hides the difference that matters to
teams deploying this in an afternoon.

## Evidence

Produced by the `nxs-architect` agent on 2026-09-05, against the question verbatim. Evidence,
not a resolution — no decision is recorded here.

### Surface inventory

| Surface | What the deployer sets up in their Microsoft tenant | What we build and host | What it can display | What it cannot |
| --- | --- | --- | --- | --- |
| **Baseline: bot registration + messaging endpoint** (prerequisite for every row below except Workflows webhook) | Azure subscription; **Azure Bot** resource with Teams channel enabled; Entra app registration (App ID + client secret or cert); Teams app package (`manifest.json` + 192×192 colour and 32×32 outline icons, zipped) uploaded via *Upload a custom app* (sideload) or published to the org catalogue by a Teams admin; app installed into each scope declared in the manifest (`personal`, `team`, `groupChat`) | One public HTTPS endpoint that validates the inbound Bot Framework JWT, translates Activity ↔ agent turn, and calls `InvokeAgentRuntime`; outbound Connector client (Entra token, scope `https://api.botframework.com/.default`, posted to the activity's `serviceUrl`); a store for conversation references | Inbound: 1:1 messages, @mentions in channels and group chats, `conversationUpdate` (install/uninstall, members added), reactions, and **all** `invoke` activities. Outbound: text, mentions, typing indicator, Adaptive Cards, message update and delete | Cannot see channel messages the bot is not @mentioned in without RSC; cannot message a user/chat/team where the app is not installed; cannot render arbitrary HTML/CSS/JS |
| **Proactive message into a channel** | Nothing beyond baseline, provided the app manifest declares `team` scope and the app is installed into that team | Store the team/channel identity from the install `conversationUpdate`; either `createConversation` with `channelData.channel.id` + `isGroup: true` to start a new thread, or `continueConversation` from a stored `ConversationReference` to reply in an existing thread | New root post or threaded reply; text, @mentions of individuals and of the channel, Adaptive Cards | Cannot pick which channel without the deployer choosing/installing; cannot post into a private channel unless the app is installed there specifically; no reliable "post as if a person" |
| **Proactive message into a group chat** | Manifest declares `groupChat` scope; app installed into that specific chat by a member. Installing programmatically instead requires Graph `TeamsAppInstallation.ReadWriteSelfForChat` (or `.ForUser` for 1:1) with **tenant admin consent** | Same as above — capture and persist the `ConversationReference` at install time, `continueConversation` later | Same as channel: text, mentions, cards | Cannot create a new group chat with arbitrary members from the bot alone (Graph + admin consent territory); cannot reach a chat the app was never installed into |
| **Adaptive Card (render only)** | Nothing beyond baseline | Card JSON authoring; a renderer/templating step in the endpoint | Text, headings, facts, images (public HTTPS URLs), columns, containers, `Action.ShowCard`/`Action.ToggleVisibility` (client-side, free), `Action.OpenUrl` | No arbitrary HTML/CSS/JS; no live refresh without the bot pushing an update; no scrolling/virtualised lists; charts and newer elements are version-gated (see Uncertainties); no client-side data fetch |
| **Adaptive Card button round trip** | Nothing beyond baseline | Handle two distinct inbound shapes on the **same** endpoint: `Action.Submit` arrives as a normal `message` activity with a `value` payload and empty `text`; `Action.Execute` (Universal Actions) arrives as an `invoke` activity named `adaptiveCard/action` and must be answered **in the HTTP response** with an `adaptiveCard` invoke response. Plus card-update logic (`updateActivity`) to reflect state | Full request/response interaction: buttons, text inputs, choice sets, date/number inputs; per-user card views via the `refresh.userIds` mechanism; in-place card replacement | The invoke response is synchronous and time-boxed (see Uncertainties) — a Bedrock agent turn will not reliably fit, so the honest pattern is ack-immediately-then-`updateActivity`. Inputs cannot be validated server-side before submit |
| **Task module / dialog (Adaptive Card flavour)** | Nothing beyond baseline | Handle `task/fetch` and `task/submit` invokes; return an Adaptive Card as the dialog body | A modal with a richer card than fits in a message — forms, confirmations | Same card limits; still time-boxed; no multi-page flow without round trips |
| **Task module / dialog (URL flavour)** | `validDomains` in the manifest must list our domain | **A separately hosted web origin** | Anything a web page can render | Needs TLS, DNS, its own deploy and auth story |
| **Teams tab (personal, channel or config)** | `staticTabs` / `configurableTabs` and `validDomains` in the manifest. For SSO: a `webApplicationInfo` block, an Application ID URI of the form `api://<our-domain>/<app-id>`, an exposed `access_as_user` scope, and pre-authorisation of the Teams first-party client IDs; Graph scopes beyond the basics need admin consent | **A separately hosted web origin** serving an iframe-able page: TLS cert, DNS, CSP `frame-ancestors` permitting the Teams hosts, `@microsoft/teams-js` initialisation, a config page for a configurable tab, plus an on-behalf-of token exchange if SSO is used. This is a second deployable with its own build, release and patch cadence | Arbitrary UI — tables, filters, charts, drill-down, a real dashboard | Nothing renders until it is hosted, reachable and authenticated; a broken tab is a second on-call surface; the deployer's IT may block the domain |
| **Adaptive-Card-based tab** | Manifest `staticTabs` entry pointing at the **bot** rather than a content URL | Handle `tab/fetch` and `tab/submit` invokes and return Adaptive Cards — **no web origin at all** | A tab-shaped, card-rendered view of the same data a message could carry | All Adaptive Card limits apply; no charts/tables beyond card primitives; GA status needs verifying (see Uncertainties) |
| **Message extension (search / action commands)** | `composeExtensions` in the manifest; for link unfurling also `messageHandlers` with domains | Handle `composeExtension/query`, `composeExtension/fetchTask`, `composeExtension/submitAction`, `composeExtension/queryLink` invokes on the same endpoint. Adaptive-Card dialogs need no hosting; a URL-based config or dialog does | Search results as cards inserted into the compose box; "act on this message" commands; link unfurling | **User-initiated only** — contributes nothing to proactive team surfacing; tight response budget; no way to trigger it on a schedule |
| **Activity feed notification** (Graph, not Bot Framework) | Graph application permission `TeamsActivity.Send` with **tenant admin consent**; app installed in the target scope | A Graph client and token; `sendActivityNotification` calls | A banner in the Activity feed that deep-links into a tab or chat | Not a message — it has no body beyond a short templated string; needs somewhere to link *to* |
| **Workflows incoming webhook** (the no-bot fallback) | A team member creates a Power Automate *Workflows* flow with an incoming-webhook trigger in the target channel and hands us the URL. No Azure subscription, no app package, no admin | An HTTPS POST with an Adaptive Card body | A card posted into one channel | **One-way only** — no buttons that reach us, no threading control, no identity, no reading replies. Legacy O365 connectors are retired; this is the sanctioned replacement |

### Cost shape, relative to the baseline endpoint

| Surface | Build | Extra hosting | Ongoing operate |
| --- | --- | --- | --- |
| Baseline endpoint | Real work: JWT validation, Activity translation, Connector auth, conversation-reference persistence | Public HTTPS front door in AWS (API Gateway + Lambda, ALB + Fargate, or Lambda function URL) — **AgentCore Runtime is not itself publicly HTTP-addressable; it is reached by a signed `InvokeAgentRuntime` call**, so this front door is unavoidable | Client-secret expiry (Entra caps secret lifetime; the bot goes silent when it lapses), `serviceUrl` drift, Bot Framework SDK upgrades |
| Channel / group-chat proactive | Small, on top of baseline | None | Stale conversation references when a team is renamed, archived or the app uninstalled |
| Adaptive Card + button round trip | Moderate — two inbound shapes, ack-then-update pattern, card state | None | Card schema drift as Teams' supported version moves |
| Card-based dialogs / message extension | Moderate | None | Same |
| Teams tab (or URL dialog) | Largest — a whole frontend plus SSO token exchange | Yes: separate origin, TLS, DNS, CDN or compute, own pipeline | Highest — second deployable, second patch surface, frontend dependency churn, iframe/CSP breakage when Teams changes hosts |
| Activity feed notification | Small | None | Admin consent must be re-obtained if permissions change |
| Workflows webhook | Trivial | None | Flow is owned by whoever created it; breaks silently if they leave |

### What the bot registration and the single messaging endpoint already buy

Once the Azure Bot registration exists and one HTTPS endpoint is stood up, most of the surfaces
above need nothing further built or hosted. The Bot Framework Connector multiplexes every
interactive Teams surface through the same endpoint as differently-named `Activity` objects:

- Inbound `message` activities carry both typed text and `Action.Submit` card payloads (in
  `activity.value`, with `text` empty).
- Inbound `invoke` activities carry the whole rest of the interaction model: `adaptiveCard/action`
  (Universal Actions), `task/fetch` and `task/submit` (dialogs), `composeExtension/*` (message
  extensions), and `tab/fetch` / `tab/submit` (card-based tabs).
- Outbound, the same Connector credentials let us create a new channel thread, reply into an
  existing one, open a 1:1, and update or delete an already-posted card — which is what makes an
  ack-then-update pattern possible.
- Every inbound activity carries `from.aadObjectId` and `channelData.tenant.id`, which is a stable,
  tenant-scoped identity suitable for deriving the `runtimeSessionId` the runtime standard
  requires. (`from.id` is a per-bot opaque id, not stable across apps.)

Surfaces that need nothing beyond the baseline: channel proactive post, group-chat proactive post,
Adaptive Card render, Adaptive Card button round trip (both `Action.Submit` and `Action.Execute`),
card-based task modules, message extensions with card dialogs, and card-based tabs.

Two costs sit inside "the baseline" and are not free:

1. **Proactive messaging is stateful.** Every proactive message needs a `ConversationReference`
   (conversation id, `serviceUrl`, tenant, bot and recipient identities) captured from an earlier
   activity — normally the `conversationUpdate` fired at install. That store is durable application
   state, which lands on the still-open persistence decision in `docs/system/stack.md`. Without it,
   there is no daily loop and no team post.
2. **Installation is the gate, not permissions.** The bot can only reach a scope its app is
   installed into. A team-wide post presupposes a human installed Ripples into that team. Installing
   programmatically via Graph exists but pulls in tenant-admin consent, which is the friction the OSS
   motion is trying to avoid.

### Which surfaces require a separately hosted web origin

Only two things force a second deployable: a **Teams tab whose content is a URL**, and a
**URL-based task module / dialog**. Both are iframes of a page we serve. Everything else rides the
messaging endpoint.

- **Teams tab** — a genuinely separate system, not an extra route. It needs its own DNS name and TLS
  cert, must be listed in the manifest's `validDomains`, must set a CSP `frame-ancestors` allowing
  the Teams hosts rather than a blanket `X-Frame-Options: DENY`, must initialise `@microsoft/teams-js`
  to get context, and — to know who is looking at it — needs tab SSO: an Application ID URI shaped
  `api://<domain>/<app-id>`, an exposed `access_as_user` scope, pre-authorised Teams client IDs, and a
  server-side on-behalf-of exchange. That chain is the part deployers get wrong and the part we cannot
  debug from their tenant. Against `docs/product/context.md`'s "assume no onboarding support", the tab
  is the single largest time-to-first-value tax on the list.
- **Adaptive Card action round trip** — a card button press needs no web origin at all.
  `Action.Submit` arrives as a message activity and `Action.Execute` as an `adaptiveCard/action`
  invoke, both on the endpoint we already run; the reply is either a new message or an in-place
  `updateActivity`. The only qualification is timing — the invoke response is synchronous and
  short-fused, so any agent turn behind the button must be answered with an immediate acknowledgement
  card and a follow-up update, not held open.
- **Card-based tabs** are the middle case: a tab-shaped surface declared against the bot rather than a
  content URL, rendered from Adaptive Cards returned to `tab/fetch`. If a team-wide view fits in card
  primitives, it can be a tab with zero web hosting.

### Uncertainties, flagged rather than asserted

- **Adaptive Card schema ceiling in Teams.** Teams lags the Adaptive Cards spec, and the ceiling
  differs per host surface. Messages are believed to support roughly v1.5 with partial v1.6, not to be
  built against without checking the current Teams card-schema support page. Chart and
  data-visualisation elements in particular may not exist in Teams messages.
- **Invoke response timeout.** Microsoft documents a short synchronous budget; both ~5 s (message
  extensions, task modules) and ~15 s (general invoke) are cited and the agent could not distinguish
  them. The shape is certain — far shorter than a Bedrock agent turn — but the number needs verifying.
- **Adaptive Card payload size limit.** A documented cap exists, recalled as ~28 KB. Load-bearing if a
  team-wide view lists many work items. Verify.
- **Card-based tab (`tab/fetch`) GA status.** This was in preview at one point. If it is still preview
  or deprecated, the "tab without hosting" option disappears and the tab becomes strictly a
  hosted-origin cost. The highest-leverage fact to confirm for this ticket.
- **Bot registration without an Azure subscription.** The Teams Developer Portal can create and manage
  bot registrations. Whether that avoids needing an Azure subscription, and whether it is equivalent to
  an Azure Bot resource for Teams channel purposes, is unverified. It materially changes deployer setup
  cost.
- **Azure Bot Service pricing.** The F0 tier is believed to give unlimited messages on standard
  channels, with Teams counting as standard. Confirm rather than assume it is free.
- **Single-tenant vs multi-tenant vs managed-identity bot.** Single-tenant fits a self-hosted
  single-tenant deployment, but auth endpoints and channel support differ. User-assigned
  managed-identity bots appear to require the bot to run on Azure compute, which Ripples does not — it
  runs in the deployer's AWS account. If that holds, a client secret or certificate is the only option
  and secret expiry becomes a permanent operational chore.
- **Resource-specific consent (RSC).** Manifest-declared `authorization.permissions.resourceSpecific`
  lets a team owner grant scopes such as reading channel messages at install time, without tenant
  admin. Manifest-version requirements (v1.12+, from memory) and the current grantable scope list need
  checking.
- **O365 connectors / incoming webhooks.** Microsoft announced retirement of Office 365 connectors in
  Teams with the cutoff extended into 2025; Power Automate Workflows with an incoming-webhook trigger
  is the replacement. Direction is confident, exact dates are not. Treat a legacy connector webhook as
  unavailable.
- **`serviceUrl` stability.** The `serviceUrl` on an activity is regional and can change; guidance is
  to refresh it from the most recent activity rather than pinning a stored one. A stale `serviceUrl` is
  a classic silent proactive-messaging failure.
- **Custom app upload policy.** Many enterprise tenants disable sideloading, forcing publication
  through the Teams admin centre — an admin action the deploying team may not control. A plausible hard
  blocker on "deploy in an afternoon"; worth confirming as a real-world frequency.

### Verification pass — 2026-09-05

The architect flagged nine uncertainties. This session checked the load-bearing ones against
Microsoft's current documentation. Evidence, not a resolution.

| Uncertainty | Verdict | What the check found |
| --- | --- | --- |
| Adaptive-Card-based tab (`tab/fetch`) GA status | **Dead** | Adaptive Card tabs are not available in the new Teams client, and Microsoft tells anyone using one to rebuild it as a web-based tab. The current tabs overview documents only static and configurable tabs, both of which are iframes of a content URL. The "tab without a web origin" row of the inventory is gone. |
| Invoke response timeout | **Confirmed, and tighter than the lower figure cited** | Five seconds. Past it the Teams client retries twice and then shows "Unable to reach the app", and a late reply is discarded. The budget is not configurable. A Bedrock agent turn does not fit, so an acknowledgement card followed by `updateActivity` is the only workable pattern. |
| Adaptive Card payload size | **Confirmed, two separate caps** | The card itself is capped at 28 KB. The whole bot message is capped at 40 KB, measured as UTF-16 and excluding base64 images; over that the send fails with 413. A list long enough to matter has to be paged across messages. |
| Adaptive Card schema ceiling in Teams | **Better than assumed** | Teams supports schema v1.6 and below for bot-sent cards, on desktop and mobile. v1.6 is where `Table` lives, so a card can render a real table. v1.5 is the safer floor if Outlook or Viva ever render the same card. |
| Azure Bot pricing and the Teams channel | **Free in practice** | The F0 tier carries 10,000 messages a month, and messages over the Teams channel are not counted against that at all. Bot cost is not a reason to prefer one surface over another. |
| Bot registration without an Azure subscription | **Partly** | The Teams Developer Portal registers and updates the app and the bot, and the Azure portal is only needed for other Bot Framework channels such as Direct Line or Web Chat. Registering through the Azure portal still needs an Azure account, free but card-verified. Teams alone does not need the Azure portal. |
| Custom app upload policy | **Real, and not quantified** | Uploading a custom app is governed by a Teams app setup policy that an administrator controls, and organisations do disable it. No public figure says how often. The gate is confirmed; its frequency is not, and no document will settle it. |

## Resolution

- **Decided:** Ripples reaches a team through the Bot Framework messaging endpoint it already
  has to run, and through nothing else. That endpoint carries every team-facing surface worth
  having: a proactive post into a channel or a group chat, an Adaptive Card, and the round trip
  when someone presses a button on that card. Cards are authored against schema v1.5, with v1.6
  `Table` used where a view genuinely needs rows, and every card is held under 28 KB with the
  whole message under 40 KB. Any button that starts an agent turn is answered inside five
  seconds with an acknowledgement card and updated in place when the turn finishes. A separately
  hosted web origin — the only remaining form of a Teams tab — is priced as a second deployable
  with its own DNS, TLS, single-sign-on exchange and release cadence, and no goal in this
  discovery may assume one exists until a later ticket decides to pay for it. Two costs sit
  inside the endpoint and are not free: a durable store of conversation references, without
  which nothing can be sent proactively, and a human installing the app into the team, without
  which the team cannot be reached at all.

- **Why:** The bot registration and the one endpoint are unavoidable — AgentCore Runtime is
  reached by a signed `InvokeAgentRuntime` call and is not publicly addressable, so a front door
  has to exist before Ripples can hear anything at all. Once it exists, the Connector multiplexes
  channel posts, group-chat posts, cards, card buttons, dialogs and message extensions through
  that same endpoint as differently-named activities. Every one of those surfaces is therefore
  incremental build on something already paid for, while a tab is a whole second system that the
  deploying team has to host, secure and keep reachable. Against a product that assumes no
  onboarding support, that asymmetry decides it: the conversational surfaces cost a feature each,
  the tab costs a deployment.

- **Refuted alternative:** The Adaptive-Card-based tab, which would have given a tab-shaped
  team view rendered from cards returned to `tab/fetch`, with no web origin at all. It was the
  cheapest route to a persistent, visitable team view and it is why the architect called its
  status the highest-leverage fact to confirm. It lost because it no longer exists — Microsoft
  removed Adaptive Card tabs from the new Teams client and tells anyone using one to rebuild it
  as a hosted web tab. The middle option is gone, so the choice is genuinely binary: a message,
  or a hosted page. Also refuted: the Workflows incoming webhook as the team-facing surface. It
  needs no Azure subscription, no app package and no administrator, which makes it the cheapest
  thing on the list, but it is one-way — no button reaches us, no identity comes back, no reply
  can be read. A surfacing feature that cannot be answered is not a surface Ripples can act on,
  so the webhook stays recorded as a fallback and is not the design.

- **Resolved by:** sameera on 2026-09-05
