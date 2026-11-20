# Objetivo de #BuildHybridAI

Ayudar a quienes cuidan plantas de interior a llevar observaciones comparables y decidir qué revisar físicamente. El piloto permite registrar una planta de cualquier especie a la vez. La primera prueba de cuidado será con una orquídea. La aplicación distingue lo que se ve de lo que falta por comprobar.

## Alcance del primer prototipo

| Qué queremos demostrar | Criterio de aceptación |
| --- | --- |
| Registrar dos observaciones | Al recargar se conservan el nombre opcional de la planta y dos observaciones, cada una con foto, fecha opcional y nota opcional. |
| Comparar dos fotos | El resultado identifica al menos un cambio visible cuando la diferencia es clara y reconoce cuándo la luz o el ángulo impiden concluir. |
| Funcionar sin internet | Con la app y el modelo preparados, bloquear la conexión, recargar, ejecutar una comparación nueva y obtener un resultado de origen local. |
| Respetar la decisión de la persona | La nube se activa mediante un botón y una confirmación. La información de riego se limita a comprobaciones físicas. |

## Alcance de la entrega

- Categoría **Web/Chrome**. Ejecutar comparaciones mediante Firebase AI Logic con Gemini Nano 4 en Chrome y comprobar la ruta de nube mediante el mismo SDK. La aplicación debe integrar App Check.
- Dar evidencia con una comparación local sin conexión, una comparación en nube y un caso donde las fotos dificulten concluir. Mostrar el origen que devuelve Firebase.
- Compartir una aplicación gratuita y un repositorio público en GitHub o GitLab con licencia abierta e instrucciones reproducibles.
- Entregar en inglés la descripción, los materiales de la postulación y un video público de YouTube en inglés o subtitulado en inglés. Apuntar a menos de tres minutos. Un enlace de demo alojada es recomendable.
- Contar el problema, qué se construyó durante el reto, cómo se usa Firebase y por qué importa conservar la función sin internet.
- Cierre oficial el **30 de noviembre de 2026 a las 19:00 de Santiago**. La cuota temporal de Google es opcional.

## Qué mostrar en el video

1. Cargar dos observaciones y verlas juntas.
2. Desconectar la red y ejecutar la comparación. Mostrar el origen y una diferencia verificable.
3. Restablecer la conexión y demostrar la comparación en nube con confirmación.
4. Mostrar una foto poco comparable y cómo el diario expresa la incertidumbre.

[Reglas oficiales de #BuildHybridAI](https://firebasehybridaihackathon.devpost.com/rules)  
[Requisitos técnicos de Firebase para Chrome](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started)
