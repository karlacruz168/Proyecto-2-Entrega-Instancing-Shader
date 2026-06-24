# Aquaswarm - 2ª Entrega: Enjambre Optimizado (Instancing + Shaders)

## Información del Equipo
* **Nombre del Equipo:** Aquaswarm
* **Integrantes:**
  * Cruz Duran Karla Lucero (Matrícula: 2213063802)
  * Cruces Ambriz Denylson Edu (Matrícula: 2223067769)
  * García López José Said (Matrícula: 2213063642)
* **UEA:** Seminario de Tecnologías de la Información II (Trimestre 26-P)
* **Institución:** Universidad Autónoma Metropolitana - Unidad Cuajimalpa

---

## 🚀 Enlaces del Proyecto
* **Demo en Vivo (GitHub Pages):** [https://karlacruz168.github.io/Proyecto-2-Entrega-Instancing-Shader/](https://karlacruz168.github.io/Proyecto-2-Entrega-Instancing-Shader/)
* **Repositorio Oficial:** [https://github.com/karlacruz168/Proyecto-2-Entrega-Instancing-Shader](https://github.com/karlacruz168/Proyecto-2-Entrega-Instancing-Shader)

---

## Descripción del Proyecto
Este proyecto consiste en la simulación interactiva de un enjambre autónomo masivo de peces (cardumen) en un entorno acuático virtual de alto rendimiento. En esta segunda etapa, la aplicación se migró a un paradigma de renderizado masivo en GPU mediante **Instanced Rendering** y **Custom Shaders (GLSL)**, permitiendo simular agentes independientes a una tasa de refresco óptima y fluida sin degradar el rendimiento del navegador.

---

## 🛠️ Integración de Tareas Técnicas (T1 + T2 + T4 + T5)

* **T1 + T2 (Estructura Limpia y Estática Nativa):** El motor gráfico está modularizado de forma nativa en JavaScript Vanilla (ES6 Modules) corriendo de manera independiente en la web. Se eliminaron los empaquetadores locales y dependencias pesadas en producción, utilizando enlaces **CDN oficiales** para cargar Three.js y OrbitControls, garantizando compatibilidad absoluta y directa con servidores estáticos como GitHub Pages.
* **T4 (Shaders Avanzados en GPU):** Se diseñó e inyectó un `THREE.ShaderMaterial` personalizado programado en GLSL que se ejecuta de forma paralela en la tarjeta gráfica:
  * **Vertex Shader (Deformación de Vértices):** Modifica la posición local de los vértices traseros de la geometría utilizando una función de onda sinusoidal (`sin`) combinada con el tiempo real (`uTime`) para generar una animación orgánica de ondulación de nado.
  * **Fragment Shader (Toon / Cel-Shading):** Evalúa el producto punto (`dot`) entre la normal de la superficie orientada y la dirección de la luz directional para discretizar la iluminación en escalones fijos, otorgando un acabado estético de estilo cómic o animación tradicional.
* **T5 (Instancing y Métricas de Rendimiento Masivo):** En lugar de instanciar mallas individuales en el grafo de escena, se implementó `THREE.InstancedMesh`. Esto reduce el cuello de botella del CPU enviando una sola llamada de dibujo (*1 Draw Call*) a la GPU para gestionar las 100 instancias simultáneamente. Las posiciones, orientaciones de rebote y colores individuales se manejan actualizando dinámicamente matrices de transformación (`setMatrixAt`) cuadro por cuadro, manteniendo un rendimiento estable y óptimo de **~60 FPS** reflejado en el contador nativo en pantalla.

---

## Estructura de Módulos Actualizada
```text
proyecto_2_Instancing_Shader/
├── src/
│   ├── escenaAcuatica.js  # Requisito 1: Configuración de escena base, iluminación y OrbitControls remotos
│   ├── main.js            # Punto de entrada: Lógica de simulación, ShaderMaterial y control de matrices de Instancing
│   └── style.css          # Estilos globales y visualización fija del contador de FPS
└── index.html             # Estructura del DOM con el Import Map (diccionario CDN de dependencias)
