import * as THREE from 'three';
import { scene, vehicles, tripods, projectiles, activeVehicle, gameState } from './state.js';
import { takeDamage } from './vehicles.js';
import { destroyTripod } from './tripods.js';
import { updateEnemyHP, hideEnemyUI } from './ui.js';

// Preload shot sound
const shotSound = new Audio('assets/sounds/machine-gun-shot.mp3');
shotSound.preload = 'auto';

// Cannon constants
const GRAVITY = 0.03;
const CANNON_DAMAGE = 20;
const MACHINEGUN_DAMAGE = 10;
export const MACHINEGUN_FIRE_RATE = 250;  // 4 bullets/second
export const CANNON_FIRE_RATE = 1000;     // 1 shot/second

export function shoot() {
    if (!activeVehicle || !activeVehicle.isAlive || gameState.isPaused) return;

    if (activeVehicle.type === 'cannon') {
        shootCannon();
    } else {
        shootMachineGun();
    }
}

function shootMachineGun() {
    const projectileGeometry = new THREE.SphereGeometry(0.2);
    const projectileMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00
    });
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

    const barrelWorldPos = new THREE.Vector3();
    activeVehicle.barrel.getWorldPosition(barrelWorldPos);
    projectile.position.copy(barrelWorldPos);

    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(activeVehicle.quaternion);
    projectile.userData.velocity = direction.multiplyScalar(1.5);
    projectile.userData.gravity = false;
    projectile.userData.damage = MACHINEGUN_DAMAGE;

    scene.add(projectile);
    projectiles.push(projectile);

    // Play shot sound
    const sfx = shotSound.cloneNode();
    sfx.volume = 0.5;
    sfx.play();
}

function shootCannon() {
    const projectileGeometry = new THREE.SphereGeometry(0.4);
    const projectileMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.3
    });
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

    const barrelWorldPos = new THREE.Vector3();
    activeVehicle.barrel.getWorldPosition(barrelWorldPos);
    projectile.position.copy(barrelWorldPos);

    // Direction from the barrel pivot's world orientation (includes elevation angle)
    const direction = new THREE.Vector3(0, 0, -1);
    activeVehicle.barrelPivot.getWorldQuaternion(projectile.quaternion);
    direction.applyQuaternion(projectile.quaternion);
    projectile.userData.velocity = direction.multiplyScalar(1.0);
    projectile.userData.gravity = true;
    projectile.userData.damage = CANNON_DAMAGE;

    scene.add(projectile);
    projectiles.push(projectile);

    // TODO: add cannon shot sound when asset is available
}

function applyHitToTripod(tripod, damage, hitPart) {
    gameState.lastAttackedEnemy = tripod;

    tripod.userData.health -= damage;
    tripod.userData.legsHit++;

    updateEnemyHP(tripod.userData.health, tripod.userData.maxHealth);

    // Visual feedback - flash the hit part red
    hitPart.material = hitPart.material.clone();
    hitPart.material.color.set(0xff0000);
    hitPart.material.emissive.set(0xff0000);
    hitPart.material.emissiveIntensity = 0.8;

    setTimeout(() => {
        if (tripod && tripod.userData && tripod.userData.isAlive && hitPart && hitPart.material) {
            hitPart.material.color.set(0xffffff);
            hitPart.material.emissive.set(0x000000);
            hitPart.material.emissiveIntensity = 0;
        }
    }, 200);

    if (tripod.userData.health <= 0) {
        destroyTripod(tripod);
        if (gameState.lastAttackedEnemy === tripod) {
            hideEnemyUI();
            gameState.lastAttackedEnemy = null;
        }
    }
}

export function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];

        // Apply gravity to cannon projectiles
        if (proj.userData.gravity) {
            proj.userData.velocity.y -= GRAVITY;
        }

        proj.position.add(proj.userData.velocity);

        // Check collision with tripods (legs + body)
        let hit = false;
        tripods.forEach(tripod => {
            if (!tripod.userData.isAlive || hit) return;

            // Check body sphere (radius 1.5, at y=8 relative to tripod)
            const bodyWorldPos = new THREE.Vector3();
            tripod.body.getWorldPosition(bodyWorldPos);
            const bodyDist = proj.position.distanceTo(bodyWorldPos);
            const bodyHitRadius = 1.5 + 0.5; // sphere radius + buffer

            if (bodyDist < bodyHitRadius) {
                hit = true;
                applyHitToTripod(tripod, proj.userData.damage, tripod.body);
                return;
            }

            // Check leg cylinders
            tripod.legs.forEach(leg => {
                if (hit) return;

                const legWorldPos = new THREE.Vector3();
                leg.getWorldPosition(legWorldPos);

                const horizontalDist = Math.sqrt(
                    Math.pow(proj.position.x - legWorldPos.x, 2) +
                    Math.pow(proj.position.z - legWorldPos.z, 2)
                );

                const legRadius = 0.3;
                const hitRadius = legRadius + 0.5;
                const legBottom = legWorldPos.y - 4;
                const legTop = legWorldPos.y + 4;

                if (horizontalDist < hitRadius &&
                    proj.position.y >= legBottom &&
                    proj.position.y <= legTop) {

                    hit = true;
                    applyHitToTripod(tripod, proj.userData.damage, leg);
                }
            });
        });

        // Remove projectile if hit, hit ground, or out of bounds
        const hitGround = proj.userData.gravity && proj.position.y <= 0;
        if (hit || hitGround || proj.position.length() > 100) {
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
            if (tripod.userData.heatRayActivationTime === null) {
                tripod.userData.heatRayActivationTime = currentTime;
            }

            const timeInRange = currentTime - tripod.userData.heatRayActivationTime;
            const activationDelay = 1000;

            if (timeInRange >= activationDelay) {
                takeDamage(closestVehicle, 5 * delta);
                if (tripod.heatRay && tripod.heatRay.material) {
                    tripod.heatRay.material.emissiveIntensity = 1 + Math.sin(Date.now() * 0.01) * 0.5;
                    tripod.heatRay.material.color.set(0xff0000);
                    tripod.heatRay.material.emissive.set(0xff0000);
                }
            } else {
                if (tripod.heatRay && tripod.heatRay.material) {
                    tripod.heatRay.material.emissiveIntensity = 0.5 + (timeInRange / activationDelay) * 0.5;
                    tripod.heatRay.material.color.set(0xffffff);
                    tripod.heatRay.material.emissive.set(0xffffff);
                }
            }

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

            if (tripod.warningBeam && tripod.warningBeam.material) {
                tripod.warningBeam.material.color.set(timeInRange >= activationDelay ? 0xff0000 : 0xffffff);
                tripod.warningBeam.material.opacity = timeInRange >= activationDelay ? 0.6 : 0.3;
            }

        } else {
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
