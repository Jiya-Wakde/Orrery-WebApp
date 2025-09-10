// Import Three.js
import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a planet geometry and material
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// Create clouds geometry and material
// ... (code to create clouds based on your specifications)

// Create sunburst geometry and material
// ... (code to create sunburst based on your specifications)

// Set up lighting
// ... (code to add lights to the scene)

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function viewPlanets() {
  alert("Navigating to view planets!"); // Placeholder action
  // Add code to display or navigate to the planet section
}
