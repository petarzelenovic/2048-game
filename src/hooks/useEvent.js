import { useEffect } from "react";

export default function useEvent(event, handler) {
  // prima 3 arg: tip eventa, fja koja se zove kada se okine event,
  useEffect(() => {
    //koristimo ga za dodavanje i uklanjanje event listenera
    window.addEventListener(event, handler);

    return function cleanUp() {
      window.removeEventListener(event, handler);
    };
    // uklanja listener koji smo postavili na globalni window
  });
}
