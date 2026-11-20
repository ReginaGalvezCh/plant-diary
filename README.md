# Diario de plantas

Prototipo web para seguir una planta de interior a partir de dos observaciones. La orquídea es el primer caso del piloto. El diario conserva las fotos, fechas y notas en el navegador. La comparación describe cambios visibles, propone una comprobación sencilla y explicita qué queda por confirmar. La humedad se comprueba en la maceta.

## Abrir en este equipo

Con Python 3 instalado, ejecuta `npm start` desde esta carpeta. Abre <http://127.0.0.1:8765/> en Chrome de escritorio. La primera apertura prepara la copia local de la aplicación. Gemini Nano necesita una descarga inicial si Chrome indica que el modelo es descargable.

1. Carga dos imágenes de la misma planta en orden temporal. Se aceptan JPEG, PNG y WebP. Usa un encuadre y una iluminación similares.
2. Escribe el nombre o especie si la conoces y añade fechas o notas si ayudan.
3. Pulsa **Comparar en este equipo**. El resultado debe indicar el origen del procesamiento.
4. Con el modelo instalado y la página ya abierta, simula el estado sin conexión desde Chrome o corta la conexión. Recarga, pulsa **Comparar en este equipo** y verifica que aparece una comparación nueva.

Sin configuración de Firebase, este primer prototipo usa directamente la API local de Chrome. La integración con Firebase se activa con la configuración de abajo. El botón de nube requiere confirmación antes de enviar las dos imágenes y sus notas.

## Activar Firebase AI Logic

1. Usa Node 22 y ejecuta `npm ci` y `npm run build:firebase`.
2. Registra una app web en un proyecto de Firebase con Firebase AI Logic, el backend Gemini Developer API y App Check. Configura el proveedor reCAPTCHA Enterprise.
3. Copia `public/firebase-settings.js` a `public/firebase-settings.local.js`. Completa `firebaseConfig` y `recaptchaEnterpriseSiteKey`. Para localhost activa `appCheckDebug`, abre la app y registra el token de depuración que genera el navegador en la consola de Firebase. Mantén ese token privado. Para un sitio alojado utiliza un host autorizado y desactiva `appCheckDebug`.
4. Abre el diario de nuevo con conexión para que el navegador guarde los módulos. Comprueba el funcionamiento local y el de nube en sesiones separadas. El resultado solo muestra el sello de Firebase si el SDK devuelve el origen esperado.

[Guía oficial de Firebase para web](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started)

## Ejecutar la prueba

Con el servidor iniciado y Chrome instalado, ejecuta `node tests/offline.mjs` con Node 22. La prueba usa dos ilustraciones controladas, verifica que el diario conserva los datos al recargar, activa el modo sin conexión de Chrome e intenta una comparación nueva. Falla si Chrome no puede producir el resultado. `DIARY_PREPARE=1` intenta primero la preparación conectada. `DIARY_CHROME_PROFILE` puede apuntar a un perfil aislado persistente para conservar la descarga entre pruebas. Evita usar un perfil de uso personal.

[Alcance y requisitos del hackathon](REQUISITOS.md)
