import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { inicializarEscena } from './escenaAcuatica.js';

const { scene, camera, renderer, controls, limitesEntorno } = inicializarEscena();

// --- REQUISITO 1: 100 agentes configurados para InstancedMesh (T5) ---
const NUM_AGENTES = 100;

// Geometría base del pez orientada hacia el eje X delantero
const geometry = new THREE.ConeGeometry(0.6, 2.5, 4);
geometry.rotateZ(-Math.PI / 2); 

// --- REQUISITO 2: Shader Avanzado Personalizado (T4: Vertex Wobble + Toon/Cel Shading) ---
const customMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uLightDirection: { value: new THREE.Vector3(10, 30, 10).normalize() },
        uBaseColor: { value: new THREE.Color(0x00bfff) }
    },
    vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vec3 transformed = position;
            
            // --- EFECTO VERTEX WOBBLE (T4) ---
            // Modificación matemática por vértice en la GPU para simular la ondulación del nado
            if (transformed.x < 0.0) {
                float wave = sin(uTime * 12.0 + transformed.x * 2.5) * 0.3;
                transformed.z += wave;
            }

            // SOPORTE PARA INSTANCEDMESH: Multiplicamos explícitamente por la matriz de cada instancia
            vec4 instancePosition = instanceMatrix * vec4(transformed, 1.0);
            vec4 modelViewPosition = modelViewMatrix * instancePosition;
            
            // Transformación correcta de las normales para la iluminación por instancia
            vNormal = normalMatrix * mat3(instanceMatrix) * normal;
            vViewPosition = -modelViewPosition.xyz;

            gl_Position = projectionMatrix * modelViewPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 uLightDirection;
        uniform vec3 uBaseColor;
        varying vec3 vNormal;

        void main() {
            vec3 normal = normalize(vNormal);
            // Cálculo del factor difuso Lambert clásico
            float intensity = dot(normal, uLightDirection);
            
            // --- EFECTO TOON / CEL-SHADING (T4) ---
            // Discretización de los pasos de luz para crear bandas de color sólidas de estilo cómic/animación
            float toonIntensity = 0.3;
            if (intensity > 0.75) toonIntensity = 1.0;
            else if (intensity > 0.4) toonIntensity = 0.7;
            else if (intensity > 0.1) toonIntensity = 0.4;

            // Variación de color basada en el sombreado Toon calculado
            vec3 finalColor = uBaseColor * toonIntensity;
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
});

// Inicialización del objeto de mallas instanciadas
const instancedMesh = new THREE.InstancedMesh(geometry, customMaterial, NUM_AGENTES);
scene.add(instancedMesh);

// --- REQUISITO 3: Datos de Movimiento Independiente Coherente ---
const agentes = [];
const dummy = new THREE.Object3D();

// Paleta de colores subacuáticos para diferenciar los agentes
const coloresValidos = [0x00f2fe, 0x4facfe, 0x00ff7f, 0xff007f, 0x7f00ff];

for (let i = 0; i < NUM_AGENTES; i++) {
    const posicion = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 40
    );
    const velocidad = 0.08 + Math.random() * 0.07;
    const direccion = new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5) * 0.1, // Nado balanceado horizontalmente
        (Math.random() - 0.5)
    ).normalize();

    agentes.push({ posicion, velocidad, direccion });

    // Asignación de color estático por instancia
    const colorAleatorio = new THREE.Color(coloresValidos[i % coloresValidos.length]);
    instancedMesh.setColorAt(i, colorAleatorio);
}
instancedMesh.instanceColor.needsUpdate = true;

// --- REQUISITO 4: Métricas de Rendimiento en Pantalla ---
let lastTime = performance.now();
let frames = 0;
const fpsElement = document.getElementById('fps-counter');

// --- BUCLE DE SIMULACIÓN Y ANIMACIÓN ---
function animate() {
    requestAnimationFrame(animate);
    
    // Pasar el tiempo transcurrido uniformemente al shader de deformación
    const time = performance.now() * 0.001;
    customMaterial.uniforms.uTime.value = time;

    // Cálculo y actualización del contador nativo de FPS en el DOM
    frames++;
    if (performance.now() >= lastTime + 1000) {
        if (fpsElement) {
            fpsElement.innerText = `FPS: ${frames}`;
        }
        frames = 0;
        lastTime = performance.now();
    }

    // Actualización de la física individual de los agentes independientes
    for (let i = 0; i < NUM_AGENTES; i++) {
        const agente = agentes[i];

        // Movimiento rectilíneo uniforme basado en su vector dirección
        agente.posicion.addScaledVector(agente.direccion, agente.velocidad);

        // Control de colisiones espaciales (límites del acuario virtuales con rebote inverso)
        if (Math.abs(agente.posicion.x) > limitesEntorno.x) {
            agente.direccion.x *= -1;
            agente.posicion.x = Math.sign(agente.posicion.x) * limitesEntorno.x;
        }
        if (Math.abs(agente.posicion.y) > limitesEntorno.y) {
            agente.direccion.y *= -1;
            agente.posicion.y = Math.sign(agente.posicion.y) * limitesEntorno.y;
        }
        if (Math.abs(agente.posicion.z) > limitesEntorno.z) {
            agente.direccion.z *= -1;
            agente.posicion.z = Math.sign(agente.posicion.z) * limitesEntorno.z;
        }

        // Posicionar y orientar la matriz espacial de la instancia usando el objeto dummy auxiliar
        dummy.position.copy(agente.posicion);
        
        const puntoObjetivo = new THREE.Vector3().copy(agente.posicion).add(agente.direccion);
        dummy.lookAt(puntoObjetivo);

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    // Indicar a Three.js que actualice las matrices de transformación enviadas a la GPU
    instancedMesh.instanceMatrix.needsUpdate = true;
    
    controls.update();
    renderer.render(scene, camera);
}

animate();