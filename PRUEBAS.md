# Prueba en Chrome del 20 de noviembre de 2026

Chrome 157 de escritorio en macOS 26.6.2, con un perfil aislado. El ensayo usó dos ilustraciones de la misma maceta, con una flor en la primera y dos en la segunda. Las notas de prueba no indicaban el cambio que el modelo debía detectar.

| Comprobación | Resultado observado |
| --- | --- |
| Cargar los dos archivos y una nota, y recargar | Las dos imágenes y la nota seguían disponibles. |
| Emular la conexión cortada y recargar | El diario se abrió desde su copia local, mostró «Sin conexión» y conservó ambas imágenes. |
| Ejecutar una comparación nueva | Chrome respondió `unavailable` para texto y para imágenes. La app explicó el bloqueo y no mostró ninguna comparación. |
| Revisar las solicitudes tras pulsar comparar | Cero solicitudes de red de la página durante ese intento. |
| Compilar el adaptador de Firebase AI Logic | Compilación completada. Las rutas de Firebase necesitan un proyecto web configurado con App Check para verificarse como entrega del concurso. |

Un segundo intento con una copia aislada de los componentes de modelo ya presentes en este Mac también devolvió `unavailable`. No se midió la calidad de la inferencia.

## Evidencia que falta para la entrega

- Obtener una comparación nueva con dos fotos reales, conexión cortada y origen `ON_DEVICE` confirmado por Firebase AI Logic.
- Verificar la comparación en nube con App Check y consentimiento.
- Repetir con iluminación o encuadre distintos y revisar si el resultado reconoce la incertidumbre.
