import * as THREE from 'three';

export class Pez {
  constructor(colorCuerpo = 0xff1493, colorCola = 0xffd700) {
    this.mesh = new THREE.Group();
    this.velocidad = 0.05 + Math.random() * 0.05;
    this.tiempoInterno = Math.random() * 100;
    this.direccion = new THREE.Vector3(1, 0, 0);
    this._construirCuerpo(colorCuerpo, colorCola);
  }

  _construirCuerpo(colorCuerpo, colorCola) {
    // Cuerpo
    this.body = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({ color: colorCuerpo })
    );
    this.body.scale.set(1.5, 1, 1);
    this.mesh.add(this.body);

    // Ojos
    const eyes = new THREE.Group();
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eyeMaterial);
    eye1.position.set(2, 0.5, 0.8);
    eyes.add(eye1);
    
    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eyeMaterial);
    eye2.position.set(2, 0.5, -0.8);
    eyes.add(eye2);
    this.mesh.add(eyes);

    // Boca
    this.mouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.05, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    this.mouth.rotation.y = Math.PI / 2;
    this.mouth.position.set(2.7, -0.3, 0);
    this.mesh.add(this.mouth);

    // Cola Articulada
    this.tail1 = new THREE.Group();
    this.tail1.position.x = -3;
    this.mesh.add(this.tail1);

    const tailMesh1 = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 2, 4),
      new THREE.MeshStandardMaterial({ color: colorCola })
    );
    tailMesh1.rotation.z = Math.PI / 2;
    tailMesh1.position.x = -1;
    this.tail1.add(tailMesh1);

    this.tail2 = new THREE.Group();
    this.tail2.position.x = -2;
    this.tail1.add(this.tail2);

    const tailMesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 1.5, 4),
      new THREE.MeshStandardMaterial({ color: 0xff69b4 })
    );
    tailMesh2.rotation.z = Math.PI / 2;
    tailMesh2.position.x = -0.8;
    this.tail2.add(tailMesh2);

    // Aleta Superior
    this.topFin = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 1.5, 4),
      new THREE.MeshStandardMaterial({ color: 0x9400d3 })
    );
    this.topFin.rotation.z = Math.PI;
    this.topFin.position.set(0, 1.7, 0);
    this.mesh.add(this.topFin);

    // Aletas Laterales
    const finGeo = new THREE.BoxGeometry(1, 0.2, 2);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    
    this.finL = new THREE.Mesh(finGeo, finMat);
    this.finL.position.set(0, 0, 1.8);
    this.mesh.add(this.finL);

    this.finR = new THREE.Mesh(finGeo, finMat);
    this.finR.position.set(0, 0, -1.8);
    this.mesh.add(this.finR);
  }

  inicializar(posicion, rotacionY) {
    this.mesh.position.copy(posicion);
    this.mesh.rotation.y = rotacionY;
  }

  update(limites) {
    this.tiempoInterno += 0.01;
    const time = this.tiempoInterno * 5;

    this.tail1.rotation.y = Math.sin(time) * 0.5;
    this.tail2.rotation.y = Math.sin(time + 0.5) * 0.8;
    this.finL.rotation.x = Math.sin(time * 2) * 0.3;
    this.finR.rotation.x = -Math.sin(time * 2) * 0.3;
    this.topFin.rotation.z = Math.PI + Math.sin(time * 1.5) * 0.1;
    this.body.rotation.z = Math.sin(time * 0.5) * 0.05;
    this.mouth.scale.y = 1 + Math.sin(time * 3) * 0.05;

    const vectorAvance = new THREE.Vector3(1, 0, 0);
    vectorAvance.applyQuaternion(this.mesh.quaternion);
    this.mesh.position.addScaledVector(vectorAvance, this.velocidad);

    if (Math.abs(this.mesh.position.x) > limites.x) {
      this.mesh.rotation.y = Math.PI - this.mesh.rotation.y;
      this.mesh.position.x = Math.sign(this.mesh.position.x) * limites.x;
    }
    if (Math.abs(this.mesh.position.z) > limites.z) {
      this.mesh.rotation.y = -this.mesh.rotation.y;
      this.mesh.position.z = Math.sign(this.mesh.position.z) * limites.z;
    }

    this.mesh.position.y += Math.sin(time * 0.2) * 0.02;
    if (Math.abs(this.mesh.position.y) > limites.y) {
      this.mesh.position.y = Math.sign(this.mesh.position.y) * limites.y;
    }
  }
}
