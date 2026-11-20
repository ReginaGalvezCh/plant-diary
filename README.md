# Plant Diary

Compare two photos of a houseplant, keep observations on the device, and decide what to check in person. The diary accepts any houseplant and stores one pair of observations at a time. The first field trial used an orchid.

## Run locally

Use Node 26 (see `.nvmrc`) and Python 3.

```sh
npm ci
npm run build
npm start
```

Open <http://127.0.0.1:8765/> in desktop Chrome. Add two photos of the same plant. Enter the dates, plant name, or notes if you have them. Select **Compare on this device**. Use the photo buttons to enlarge each image. The result records which engine ran the comparison.

The first visit saves the application shell, translations, and loaded animation bundle in Chrome. If the local model is not already installed, Chrome needs an internet connection for the initial download. Once the page and model are ready, switch the Chrome DevTools Network panel to **Offline**, reload normally, and run a fresh comparison. The language selector works with the network off. The diary keeps existing notes and images when the interface language changes.

English and Spanish ship as local message catalogs. The browser chooses a supported language on first load and remembers changes made with the selector. To add another language, add a catalog in `public/messages.js` and verify that Chrome's model supports it before enabling that language for model output. The original result remains in the language in which it was generated.

## Enable Firebase AI Logic

Without Firebase settings the prototype uses Chrome's local Prompt API directly. Configure the Firebase SDK for the hackathon submission and for the optional cloud comparison. Sending photos to the cloud requires confirmation in the app.

1. Register a web app in a Firebase project. In the AI Logic guided setup, choose the Gemini Developer API backend and configure App Check with reCAPTCHA Enterprise.
2. Copy `public/firebase-settings.js` to `public/firebase-settings.local.js` and fill in the web app configuration and reCAPTCHA Enterprise site key. For localhost, set `appCheckDebug` to `true` and register the browser-generated debug token in the Firebase console. Keep the debug token out of the repository and demo. Use an authorized host and disable debug mode for hosted deployment.
3. Run `npm run build` and open the app once online to save the SDK bundle and settings in the local cache.
4. Test both routes. A local comparison must show **On this device · Firebase AI Logic**. The SDK must confirm `ON_DEVICE` before the app shows that label.

[Firebase web setup](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started) · [App Check debug provider](https://firebase.google.com/docs/app-check/web/debug-provider)

## Tests

Build and start the app before running the browser checks:

```sh
node tests/ui.mjs
node tests/offline.mjs
```

The UI check uses a controlled model response and verifies keyboard focus, photo enlargement, reduced motion, offline reload, and language switching. The offline check uses the real Chrome model with two controlled illustrations. Set `DIARY_PREPARE=1` to attempt the initial download online. A test-only profile with the model already installed may be supplied with `DIARY_CHROME_PROFILE`.

[Entry requirements](REQUIREMENTS.md) · [Verification notes](VERIFICATION.md)
