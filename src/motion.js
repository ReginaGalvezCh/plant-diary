import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const canAnimate = () => matchMedia("(prefers-reduced-motion: no-preference)").matches;

export function capturePhoto(image) {
  return canAnimate() ? Flip.getState(image) : null;
}

export function transitionPhoto(state, image) {
  if (state && canAnimate()) {
    Flip.from(state, { targets: image, duration: 0.28, ease: "power2.out", scale: true });
  }
}

export function returnPhoto(image, thumbnail, close) {
  if (!canAnimate()) {
    close();
    return;
  }
  Flip.killFlipsOf(image);
  Flip.fit(image, thumbnail, {
    duration: 0.22, scale: true, ease: "power2.inOut",
    onComplete() {
      close();
      gsap.set(image, { clearProps: "transform" });
    },
  });
}

export function revealResult(section) {
  if (canAnimate()) {
    gsap.fromTo(section, { opacity: 0, y: 10 }, {
      opacity: 1, y: 0, duration: 0.26, ease: "power2.out", clearProps: "opacity,transform", overwrite: "auto",
    });
  }
}
