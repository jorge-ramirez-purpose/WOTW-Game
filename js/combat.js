import * as THREE from 'three';
import { scene, vehicles, tripods, projectiles, activeVehicle, gameState } from './state.js';
import { takeDamage } from './vehicles.js';
import { destroyTripod } from './tripods.js';
import { updateEnemyHP, hideEnemyUI } from './ui.js';

// Preload shot sound
const shotSound = new Audio('assets/sounds/machine-gun-shot.mp3');
shotSound.preload = 'auto';

export function shoot() {
    if (!activeVehicle || !activeVehicle.isAlive || gameState.isPaused) return;

    const projectileGeometry = new THREE.SphereGeometry(0.2);
    const projectileMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00
    });
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

    // Start at active vehicle's barrel position
    const barrelWorldPos = new THREE.Vector3();
    activeVehicle.barrel.getWorldPosition(barrelWorldPos);
    projectile.position.copy(barrelWorldPos);

    // Shoot in active vehicle's forward direction
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(activeVehicle.quaternion);
    projectile.userData.velocity = direction.multiplyScalar(1.5);

    scene.add(projectile);
    projectiles.push(projectile);

    // Play shot sound (cloneNode allows overlapping rapid-fire playback)
    const sfx = shotSound.cloneNode();
    sfx.volume = 0.5;
    sfx.play();
}

export function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        proj.position.add(proj.userData.velocity);

        // Check collision with tripod legs
        let hit = false;
        tripods.forEach(tripod => {
            if (!tripod.userData.isAlive || hit) return;

            tripod.legs.forEach(leg => {
                if (hit) return;

                const legWorldPos = new THREE.Vector3();
                leg.getWorldPosition(legWorldPos);

                // Check horizontal distance (ignore Y)
                const horizontalDist = Math.sqrt(
                    Math.pow(proj.position.x - legWorldPos.x, 2) +
                    Math.pow(proj.position.z - legWorldPos.z, 2)
                );

                // Check if bullet is within cylinder bounds
                const legRadius = 0.3;
                const hitRadius = legRadius + 0.5;
                const legBottom = legWorldPos.y - 4;
                const legTop = legWorldPos.y + 4;

                if (horizontalDist < hitRadius &&
                    proj.position.y >= legBottom &&
                    proj.position.y <= legTop) {

                    hit = true;

                    gameState.lastAttackedEnemy = tripod;

                    // Deal 20 damage
                    tripod.userData.health -= 20;
                    tripod.userData.legsHit++;

                    // Update enemy health bar
                    updateEnemyHP(tripod.userData.health, tripod.userData.maxHealth);

                    // Visual feedback - flash the leg red
                    leg.material = leg.material.clone();
                    leg.material.color.set(0xff0000);
                    leg.material.emissive.set(0xff0000);
                    leg.material.emissiveIntensity = 0.8;

                    setTimeout(() => {
                        if (tripod && tripod.userData && tripod.userData.isAlive && leg && leg.material) {
                            leg.material.color.set(0xffffff);
                            leg.material.emissive.set(0x000000);
                            leg.material.emissiveIntensity = 0;
                        }
                    }, 200);

                    // Destroy tripod if health depleted
                    if (tripod.userData.health <= 0) {
                        destroyTripod(tripod);
                        if (gameState.lastAttackedEnemy === tripod) {
                            hideEnemyUI();
                            gameState.lastAttackedEnemy = null;
                        }
                    }
                }
            });
        });

        // Remove projectile if hit or out of bounds
        if (hit || proj.position.length() > 100) {
            scene.remove(proj);
            projectiles.splice(i, 1);
        }
    }
}

export function updateHeatRays(delta) {
    const currentTime = Date.now();

    tripods.forEach(tripod => {
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

        const heatRayRange = 10;

        if (closestDistance < heatRayRange) {
            // Track when player first entered range
            if (tripod.userData.heatRayActivationTime === null) {
                tripod.userData.heatRayActivationTime = currentTime;
            }

            const timeInRange = currentTime - tripod.userData.heatRayActivationTime;
            const activationDelay = 1000;

            // Only apply damage after 1 second delay
            if (timeInRange >= activationDelay) {
                takeDamage(closestVehicle, 5 * delta);
                if (tripod.heatRay && tripod.heatRay.material) {
                    tripod.heatRay.material.emissiveIntensity = 1 + Math.sin(Date.now() * 0.01) * 0.5;
                    tripod.heatRay.material.color.set(0xff0000);
                    tripod.heatRay.material.emissive.set(0xff0000);
                }
            } else {
                // Charging up - pulsing slowly in white
                if (tripod.heatRay && tripod.heatRay.material) {
                    tripod.heatRay.material.emissiveIntensity = 0.5 + (timeInRange / activationDelay) * 0.5;
                    tripod.heatRay.material.color.set(0xffffff);
                    tripod.heatRay.material.emissive.set(0xffffff);
                }
            }

            // Show beam from tripod to closest vehicle
            if (!tripod.warningBeam) {
                const beamGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
                const beamMaterial = new THREE.MeshBasicMaterial({
                    color: timeInRange >= activationDelay ? 0xff0000 : 0xffffff,
                    transparent: true,
                    opacity: timeInRange >= activationDelay ? 0.6 : 0.3
                });
                tripod.warningBeam = new THREE.Mesh(beamGeometry, beamMaterial);
                scene.add(tripod.warningBeam);
            }

            // Update beam position and orientation
            const tripodTopPos = new THREE.Vector3();
            tripod.heatRay.getWorldPosition(tripodTopPos);

            const targetVehiclePos = closestVehicle.position.clone();
            targetVehiclePos.y = 1;

            const beamLength = tripodTopPos.distanceTo(targetVehiclePos);
            const midPoint = new THREE.Vector3().lerpVectors(tripodTopPos, targetVehiclePos, 0.5);

            tripod.warningBeam.scale.y = beamLength;
            tripod.warningBeam.position.copy(midPoint);
            tripod.warningBeam.lookAt(targetVehiclePos);
            tripod.warningBeam.rotateX(Math.PI / 2);

            // Update color and opacity based on activation
            if (tripod.warningBeam && tripod.warningBeam.material) {
                tripod.warningBeam.material.color.set(timeInRange >= activationDelay ? 0xff0000 : 0xffffff);
                tripod.warningBeam.material.opacity = timeInRange >= activationDelay ? 0.6 : 0.3;
            }

        } else {
            // Player left range - reset
            tripod.userData.heatRayActivationTime = null;
            if (tripod.heatRay && tripod.heatRay.material) {
                tripod.heatRay.material.emissiveIntensity = 0.5;
                tripod.heatRay.material.color.set(0xff0000);
                tripod.heatRay.material.emissive.set(0xff0000);
            }

            if (tripod.warningBeam) {
                scene.remove(tripod.warningBeam);
                tripod.warningBeam = null;
            }
        }
    });
}
