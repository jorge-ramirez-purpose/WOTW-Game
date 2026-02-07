import * as THREE from 'three';
import { scene, camera, renderer, vehicles, tripods, activeVehicle, gameState, keys } from './state.js';
import { initScene } from './scene.js';
import { createVehicles } from './vehicles.js';
import { spawnTripods } from './tripods.js';
import { updateProjectiles, updateHeatRays } from './combat.js';
import { initInput } from './input.js';

// Initialize everything
initScene();
createVehicles();
spawnTripods();
initInput();

// Game loop
const clock = new THREE.Clock();

function updateVehicleMovement(delta) {
    const moveSpeed = 10 * delta;

    if (activeVehicle && activeVehicle.isAlive) {
        const rotateSpeed = 2 * delta;

        if (keys['KeyW']) {
            activeVehicle.position.x -= Math.sin(activeVehicle.rotation.y) * moveSpeed;
            activeVehicle.position.z -= Math.cos(activeVehicle.rotation.y) * moveSpeed;
        }
        if (keys['KeyS']) {
            activeVehicle.position.x += Math.sin(activeVehicle.rotation.y) * moveSpeed;
            activeVehicle.position.z += Math.cos(activeVehicle.rotation.y) * moveSpeed;
        }
        if (keys['KeyA']) {
            activeVehicle.rotation.y += rotateSpeed;
        }
        if (keys['KeyD']) {
            activeVehicle.rotation.y -= rotateSpeed;
        }

        // Keep active vehicle on ground
        activeVehicle.position.y = 0.5;
    }

    // Keep inactive alive vehicles on ground too
    vehicles.forEach(v => {
        if (v !== activeVehicle && v.isAlive) {
            v.position.y = 0.5;
        }
    });
}

function updateTripodAI(delta) {
    const moveSpeed = 10 * delta;
    const tripodSpeed = moveSpeed * 0.5;
    const recognitionRange = 20;

    tripods.forEach((tripod, index) => {
        if (!tripod.userData.isAlive) return;

        // Find closest alive vehicle
        const aliveVehicles = vehicles.filter(v => v.isAlive);
        if (aliveVehicles.length === 0) return;

        let closestVehicle = aliveVehicles[0];
        let closestDistance = tripod.position.distanceTo(aliveVehicles[0].position);

        for (let i = 1; i < aliveVehicles.length; i++) {
            const dist = tripod.position.distanceTo(aliveVehicles[i].position);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestVehicle = aliveVehicles[i];
            }
        }

        let targetPos = new THREE.Vector3();

        if (closestDistance < recognitionRange) {
            targetPos.copy(closestVehicle.position);
        } else {
            // Random wandering
            tripod.userData.wanderTimer -= delta;

            if (tripod.userData.wanderTimer <= 0) {
                tripod.userData.wanderTarget.set(
                    tripod.position.x + (Math.random() - 0.5) * 20,
                    0,
                    tripod.position.z + (Math.random() - 0.5) * 20
                );
                tripod.userData.wanderTimer = 2 + Math.random() * 3;
            }

            targetPos.copy(tripod.userData.wanderTarget);
        }

        // Move towards target
        const direction = new THREE.Vector3().subVectors(targetPos, tripod.position);
        direction.y = 0;

        if (direction.length() > 0.5) {
            const normalizedDir = direction.clone().normalize();

            // Check collision with other tripods
            const newPos = tripod.position.clone().add(normalizedDir.clone().multiplyScalar(tripodSpeed));
            let canMove = true;

            tripods.forEach((otherTripod, otherIndex) => {
                if (index === otherIndex || !otherTripod.userData.isAlive) return;

                const distanceToOther = newPos.distanceTo(otherTripod.position);
                if (distanceToOther < 6) {
                    canMove = false;
                }
            });

            if (canMove) {
                tripod.position.add(normalizedDir.multiplyScalar(tripodSpeed));
            }
        }
    });
}

function updateCamera() {
    if (activeVehicle && activeVehicle.isAlive) {
        const cameraOffset = new THREE.Vector3(0, 8, 15);
        cameraOffset.applyQuaternion(activeVehicle.quaternion);
        camera.position.copy(activeVehicle.position).add(cameraOffset);
        camera.lookAt(activeVehicle.position);
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    const anyVehicleAlive = vehicles.some(v => v.isAlive);
    if (!gameState.isPaused && anyVehicleAlive) {
        updateVehicleMovement(delta);
        updateTripodAI(delta);
        updateProjectiles();
        updateHeatRays(delta);
    }

    updateCamera();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
