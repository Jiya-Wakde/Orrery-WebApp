// Game Variables
let score = 0;
let gameActive = true;

// Set up Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Player spaceship - a cone shape
const playerGeometry = new THREE.ConeGeometry(0.5, 1, 16);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.rotation.x = Math.PI;  // Point the cone forward
scene.add(player);
player.position.z = -5;

// Asteroids array to keep track of all asteroids
const asteroids = [];

// Function to spawn new asteroids - torus shape
function spawnAsteroid() {
    const asteroidGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
    const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0xff3366 });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    
    // Position asteroid randomly on x and y axes, slightly ahead on z axis
    asteroid.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 5);
    asteroids.push(asteroid);
    scene.add(asteroid);
}

// Spawn an asteroid every second
setInterval(spawnAsteroid, 1000);

// Keyboard controls
const playerSpeed = 0.1;
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners for keydown and keyup
document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// Function to move the player based on pressed keys
function movePlayer() {
    if (keys.ArrowUp) player.position.y += playerSpeed;
    if (keys.ArrowDown) player.position.y -= playerSpeed;
    if (keys.ArrowLeft) player.position.x -= playerSpeed;
    if (keys.ArrowRight) player.position.x += playerSpeed;
}

// Game loop
function animate() {
    if (gameActive) {
        score += 1;  // Increment score

        movePlayer();  // Move player based on key input

        // Move asteroids closer to the player
        asteroids.forEach((asteroid) => {
            asteroid.position.z -= 0.1;  // Move asteroid closer
            if (asteroid.position.z < player.position.z) {
                asteroid.position.z = 5;  // Reset position if it goes past player
            }
            // Check for collision with the player
            const distance = player.position.distanceTo(asteroid.position);
            if (distance < 1) {
                gameOver();  // End game if collision detected
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);  // Continue animation
    }
}

// Game Over function
function gameOver() {
    gameActive = false;
    document.getElementById("game-over").style.display = "block";
    submitScore(score);
}

// Send score to the backend for leaderboard
function submitScore(score) {
    fetch('/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_name: "Player", score: score })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Score submitted:", data.message);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

// Run the game loop
animate();

function gameOver() {
    gameActive = false;
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-over").innerHTML = `Game Over! Your score: ${score}<br>Loading leaderboard...`;
    submitScore(score).then(() => showLeaderboard());
}

// Fetch leaderboard data and display it
function showLeaderboard() {
    fetch('/leaderboard')
        .then(response => response.json())
        .then(data => {
            let leaderboardHTML = "<h3>Leaderboard</h3><ul>";
            data.leaderboard_data.forEach((entry, index) => {
                leaderboardHTML += `<li>${index + 1}. ${entry.name}: ${entry.score}</li>`;
            });
            leaderboardHTML += "</ul>";
            document.getElementById("game-over").innerHTML += leaderboardHTML;
        })
        .catch((error) => {
            console.error("Error loading leaderboard:", error);
            document.getElementById("game-over").innerHTML += "<p>Could not load leaderboard.</p>";
        });
}

// Submit score to the backend
function submitScore(score) {
    return fetch('/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_name: "Player", score: score })
    });
}

