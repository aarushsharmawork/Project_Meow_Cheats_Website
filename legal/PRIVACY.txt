# Privacy notice

Last reviewed: 18 October 2026. Scope: the `v3` browser extension and its local macOS keyboard helper in this repository. This notice does not describe the separate Mac application or certify browser-store compliance.

## Drafts and website settings

Your typing draft, timing preferences, enabled hostnames, site-control preferences, helper identity and Gemini opt-in state are saved in the browser's local extension storage. Drafts are not encrypted by MeowCheats; anyone with access to the browser profile or device may be able to access them. The extension does not use browser sync storage for these settings.

The extension inspects page focus and editor state to target the chosen field. The Unstable formatting option can inspect editor text/model state to check formatting. Starting typing passes the selected draft to the destination webpage; native keyboard mode also passes its characters to the local helper through browser native messaging. This is not a general-purpose recording of everything you type on the computer.

## Gemini and screenshots

Opening Gemini loads Google's website in the side panel and sends normal web requests to Google. Google may receive your IP address, account/session information, prompts, attachments and other service data according to its own policies. The extension does not automatically send its saved typing draft to Gemini.

Add screenshot captures the visible portion of the selected webpage when you click it. The extension displays a review before you choose Attach to Gemini. Attaching passes the image to Gemini and may upload it to Google immediately, before you send a chat message. The extension does not click Send for you or replace the system clipboard with the screenshot. Closing/cancelling the review does not undo an image already uploaded to Google.

A screenshot can contain names, account information, private code or other confidential material. Only attach content you have permission to share. MeowCheats does not persist screenshot previews in extension storage; Google's retention is separate. See [Google's Privacy Policy](https://policies.google.com/privacy) and the [Gemini Apps Privacy Hub](https://support.google.com/gemini/answer/13594961).

Enabling Gemini asks for an optional browser permission that permits narrowly scoped removal of framing/content-security response headers from embedded Gemini app pages. It changes those pages' security protections; the implementation does not establish Google's permission or approval. Disable Gemini to remove that embedding rule and revoke the optional permission.

## Local helper setup and permissions

The macOS installer reads local Chrome/Edge-family profile preference files to match this extension's installation path and ID. It writes a setup JSON containing the public extension ID in `v3`, and a native-messaging registration in the browser's local Application Support directory. It does not upload those profile files. Setup files and environment files are ignored by Git; manually created archives need separate checking.

The keyboard helper requests macOS Accessibility/keyboard-event access to send simulated keys and check the destination's application/window/field state. These are powerful permissions. Only grant them to a build you trust; revoke them in System Settings if you stop using the helper.

## External links and diagnostics

The inspected `v3` implementation contains no dedicated analytics, advertising SDK or developer-operated data-upload endpoint. This is not a claim that an enabled third-party service makes no network requests. Opening the project homepage, bug tracker, external test page or Gemini connects to those providers, whose own policies apply. Optional debug logs can include website URLs; review and redact logs before sharing them publicly.

## Removal and questions

Factory Reset in More settings clears local extension settings, including the saved draft; uninstalling removes the browser extension. This does not remove data already submitted to a website or Gemini. Remove the helper's Accessibility permission and local native-messaging registration separately when no longer needed. Review any setup JSON and separately saved files before sharing the project.

For questions about this implementation, use the [project's issue tracker](https://github.com/aarushsharmawork/Project_Meow_Cheats/issues). Do not post passwords, account cookies, screenshots of private information or other secrets in a public issue.
