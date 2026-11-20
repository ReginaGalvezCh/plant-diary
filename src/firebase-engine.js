import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import {
  getAI, getGenerativeModel, GoogleAIBackend, InferenceMode,
} from "firebase/ai";

export function createFirebaseEngine({ firebaseConfig, recaptchaEnterpriseSiteKey, appCheckDebug }, expectedInputs, expectedOutputs) {
  const app = initializeApp(firebaseConfig);
  if (!recaptchaEnterpriseSiteKey) throw new Error("Falta configurar App Check.");
  if (appCheckDebug && ["localhost", "127.0.0.1"].includes(location.hostname)) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaEnterpriseSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const createModel = mode => getGenerativeModel(ai, {
    mode,
    onDeviceParams: { createOptions: { expectedInputs, expectedOutputs } },
  });
  const local = createModel(InferenceMode.ONLY_ON_DEVICE);
  const cloud = createModel(InferenceMode.ONLY_IN_CLOUD);

  return async function compareWithFirebase(prompt, images, useCloud, signal, onDownloadProgress) {
    const model = useCloud ? cloud : local;
    const parts = [
      { text: prompt },
      ...images.flatMap(({ label, dataUrl }) => [
        { text: label },
        { inlineData: { mimeType: "image/jpeg", data: dataUrl.split(",")[1] } },
      ]),
    ];
    if (!useCloud) await model.initializeDeviceModel(onDownloadProgress);
    signal.throwIfAborted();
    const { response } = await model.generateContent(parts, { signal });
    const source = response.inferenceSource;
    if (source !== (useCloud ? "IN_CLOUD" : "ON_DEVICE")) {
      throw new Error("Firebase no confirmó el origen de la comparación.");
    }
    return { text: response.text(), source: useCloud ? "Nube · Firebase AI Logic" : "En este equipo · Firebase AI Logic" };
  };
}
