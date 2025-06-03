import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { World } from "./world";
import { createUI } from "./ui";

// Initialise the FPS counter.
const stats = new Stats();
document.body.appendChild(stats.dom);

// Initialise the webgl renderer.
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x80a0e0)

document.body.appendChild(renderer.domElement);

// Initialise a perspective camera.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(-32, 16, -32);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();

// Create our basic scene.
const scene = new THREE.Scene();

const world = new World();
world.generate();
scene.add(world);


// Handle window resize events.
window.addEventListener("resize", (event) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});


// Utility functions.
function setupLights() {
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight();
  light2.position.set(-1, 1, -0.5);
  scene.add(light2);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add(ambient);
}


// Main game loop.
function animate() {
  requestAnimationFrame(animate);
  stats.update();

  // Render the scene using our camera.
  renderer.render(scene, camera);
}

setupLights();
createUI(world);
animate();