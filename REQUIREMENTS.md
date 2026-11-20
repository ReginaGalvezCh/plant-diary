# #BuildHybridAI requirements

Plant Diary helps houseplant owners compare two observations and decide what to check in person. The prototype tracks one plant at a time, supports English and Spanish, and uses an orchid as its first field trial.

| Goal | Acceptance criterion |
| --- | --- |
| Record two observations | An optional name and two photos, dates, and notes survive reload. Dates and notes are optional. Multiple views with the same date are described without inferring a timeline. |
| Compare two photos | A clear difference is described when the photos support it. Lighting, framing, and reflections are stated as limitations when they matter. Photo analysis does not establish hydration. |
| Work offline | Prepare the app and model, simulate offline mode in Chrome, reload normally, and generate a new comparison. The submission must show Firebase AI Logic reporting local inference. |
| Respect the user's choices | Local comparison is the primary action. The cloud route asks before transferring photos and notes. Photo zoom and the comparison result work with reduced motion. |
| Support both interface languages | English and Spanish can be selected offline. Switching language preserves photos, dates, and notes. |

## Submission

- Enter the Web/Chrome platform. Integrate Firebase AI Logic with Gemini Nano on-device and verify the cloud route through the SDK. Integrate Firebase App Check.
- Provide a free working app, an open-source public GitHub or GitLab repository, setup instructions, and English submission materials.
- Publish a public YouTube demo up to three minutes long, in English or with English subtitles. A hosted demo URL is recommended. Use demo assets that can be shared publicly.
- Demonstrate a fresh comparison in Chrome Offline mode and show the SDK's inference source. Show what happens when a pair of photos is hard to compare and demonstrate cloud processing with explicit consent.
- Deadline: **November 30, 2026 at 19:00 Santiago time**.

[Official contest rules](https://firebasehybridaihackathon.devpost.com/rules) · [Firebase web hybrid inference](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started)
