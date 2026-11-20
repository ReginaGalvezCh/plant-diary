# Verification

## Real local model, November 20, 2026

The prototype completed a new comparison of an earlier orchid photo and a photo from November 20 in Chrome 157 with DevTools set to Offline. The page displayed the Chrome Gemini Nano source and its comparison status confirmed that it completed offline. No page requests appeared after the Network log was cleared and the comparison was started. Private photos were saved in the browser for the trial and are not included in this repository.

The model treated parts of the framing difference as changes and inferred that the leaves looked more hydrated. The photos could not establish either conclusion. The updated prompt explicitly restricts hydration claims. Retest the revised output before using the result as care guidance.

An isolated browser profile reported that the local image model was unavailable. The application still cached the shell and retained the uploaded images and notes on offline reload. Browser and model setup matter for reproducing the real-inference test.

## UI checks

The browser suite exercises mobile width, offline reload, photo enlargement and focus restoration, normal and reduced motion, and both interface languages. These checks use a controlled model response to verify presentation.

## Pending submission evidence

- Configure a real Firebase web project and App Check.
- Repeat the orchid comparison with network emulation set to Offline and verify the Firebase SDK's `ON_DEVICE` source.
- Verify the cloud route with App Check using shareable test images.
- Check whether the revised output acknowledges uncertainty when photos differ in angle, framing, or light.
