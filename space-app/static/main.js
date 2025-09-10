// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);  // Adjusted FOV for wider view
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),  // Ensure #bg exists in HTML
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = true;
controls.minDistance = 5;
controls.maxDistance = 80;  // Adjusted max distance for wider zoom

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Create the Sun with increased size
const sunTexture = textureLoader.load('static/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);  // Increased size of Sun
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });  // Switch to MeshStandardMaterial
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data (radii, speeds, sizes, and texture files)
const planetsData = [
    { radius: 4.0, speed: 0.015, size: 0.1, texture: 'static/mercury.jpg' },  // Mercury
    { radius: 5.5, speed: 0.012, size: 0.15, texture: 'static/venus.jpg' },   // Venus
    { radius: 7.0, speed: 0.010, size: 0.18, texture: 'static/earth.jpg' },   // Earth
    { radius: 9.0, speed: 0.008, size: 0.13, texture: 'static/mars.jpg' },    // Mars
    { radius: 13.0, speed: 0.004, size: 0.4, texture: 'static/jupiter.jpg' }, // Jupiter
    { radius: 18.0, speed: 0.002, size: 0.35, texture: 'static/saturn.jpg' }, // Saturn
    { radius: 23.0, speed: 0.0015, size: 0.25, texture: 'static/uranus.jpg' },// Uranus
    { radius: 30.0, speed: 0.001, size: 0.22, texture: 'static/neptune.jpg' } // Neptune
];

// Create planets and orbits with textures
const planets = planetsData.map(data => {
    // Load planet texture
    const planetTexture = textureLoader.load(data.texture);

    // Create planet mesh with texture
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: planetTexture });  // Switch to MeshStandardMaterial
    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);

    // Create orbital path (ring geometry) and use DoubleSide
    const orbitGeometry = new THREE.RingGeometry(data.radius - 0.01, data.radius + 0.01, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,  // Make it visible from both sides
        opacity: 0.5,
        transparent: true
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;  // Align the orbit to the XZ plane
    scene.add(orbit);

    return { mesh: planet, orbit, ...data, angle: 0 };  // Store angle and other properties
});

// Adjust the camera to a position similar to the image view
camera.position.set(0, 10, 50);  // Adjusted to ensure visibility of the whole system
camera.lookAt(0, 0, 0);  // Point the camera at the Sun (center of the system)

// Add lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Add stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.15, 24, 24);  // Reduced star size
    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });  // Dimmer stars
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));  // Stars spread over larger area
    star.position.set(x, y, z);
    scene.add(star);
}
Array(100).fill().forEach(addStar);  // Reduced number of stars

// Animation function
let startTime = Date.now();

// Update planet positions based on elapsed time
function animate() {
    requestAnimationFrame(animate);

    let elapsedTime = (Date.now() - startTime) / 1000;  // Time in seconds

    // Update planet positions based on elapsed time
    planets.forEach(planet => {
        planet.angle = elapsedTime * planet.speed;
        // Orbit the planets along the XZ plane
        planet.mesh.position.x = planet.radius * Math.cos(planet.angle);
        planet.mesh.position.z = planet.radius * Math.sin(planet.angle);
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Move camera to match the angle and zoom level from the provided image
camera.position.set(0, 15, 15);  // Positioned slightly above and farther back
camera.lookAt(1, 5, 10);  // Look at the center (the Sun)

// Adjust OrbitControls to start from the same view without changing during initial render
controls.target.set(1, 5, 5);  // Centered on the Sun
controls.update();  // Update controls to reflect new settings

function animate() {
    requestAnimationFrame(animate);

    let elapsedTime = (Date.now() - startTime) / 1000;  // Time in seconds

    // Update planet positions based on elapsed time
    planets.forEach(planet => {
        planet.angle = elapsedTime * planet.speed;
        planet.mesh.position.x = planet.radius * Math.cos(planet.angle);
        planet.mesh.position.z = planet.radius * Math.sin(planet.angle);
    });

    controls.update();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
