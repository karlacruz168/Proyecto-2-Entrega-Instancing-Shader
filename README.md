# Aquaswarm - 1ª Entrega: Escena + Agente

## Información del Equipo
* **Nombre del Equipo:** Aquaswarm
* **Integrantes:**
  * Cruz Duran Karla Lucero (Matrícula: 2213063802)
  * Cruces Ambriz Denylson Edu (Matrícula: 2223067769)
  * García López José Said (Matrícula: 2213063642)
* **UEA:** Seminario de Tecnologías de la Información II (Trimestre 26-P)
* **Institución:** Universidad Autónoma Metropolitana - Unidad Cuajimalpa

---

## Descripción del Proyecto
Este proyecto consiste en la simulación interactiva de un enjambre autónomo de peces (cardumen) en un entorno acuático virtual, utilizando gráficos 3D en la Web mediante la biblioteca **Three.js**. En esta primera etapa, se enfoca en el comportamiento cinemático individual y la gestión del grafo de escena jerárquico.

---

## Estructura de Módulos e Integración
El proyecto se ha desarrollado bajo un enfoque modular y de Programación Orientada a Objetos (POO) para facilitar la escalabilidad en las siguientes fases (Flocking y Colisiones):

```text
proyecto_1_ESCENA/
├── src/
│   ├── PezAgente.js       # Requisito 2: Definición de la clase del Agente (Pez Articulado)
│   ├── escenaAcuatica.js  # Requisito 1: Configuración de Escena base, iluminación y Render Loop
│   ├── main.js            # Punto de entrada de la aplicación (Vite)
│   └── style.css          # Estilos del lienzo (Canvas) en pantalla completa adaptativa
├── index.html             # Lienzo (Canvas) principal del DOM e importación de módulos
└── package.json           # Gestión de dependencias (Three.js, Vite)