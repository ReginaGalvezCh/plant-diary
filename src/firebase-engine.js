import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import {
  getAI, getGenerativeModel, GoogleAIBackend, InferenceMode,
} from "firebase/ai";

export function createFirebaseEngine({ firebaseConfig, recaptchaEnterpriseSiteKey, appCheckDebug }) {
  const app = initializeApp(firebaseConfig);
  if (!recaptchaEnterpriseSiteKey) throw new Error("Missing App Check configuration.");
  if (appCheckDebug && ["localhost", "127.0.0.1"].includes(location.hostname)) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaEnterpriseSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const cloud = getGenerativeModel(ai, { mode: InferenceMode.ONLY_IN_CLOUD });
  const localModels = new Map();

  return async function compareWithFirebase(prompt, images, useCloud, signal, onDownloadProgress, locale, createOptions) {
    if (!useCloud && !localModels.has(locale)) {
      localModels.set(locale, getGenerativeModel(ai, {
        mode: InferenceMode.ONLY_ON_DEVICE,
        onDeviceParams: { createOptions },
      }));
    }
    const model = useCloud ? cloud : localModels.get(locale);
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
      throw new Error("unverifiedSource");
    }
    return { text: response.text(), source: useCloud ? "sourceCloud" : "sourceLocal" };
  };
}
