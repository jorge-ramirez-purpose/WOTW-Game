import * as THREE from 'three';
import { scene, tripods, vehicles, gameState } from './state.js';
import { updateScore, showVictory } from './ui.js';

function createTripod(x, z) {
    const tripod = new THREE.Group();

    // Central body (sphere)
    const bodyGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 8;
    body.castShadow = true;
    tripod.add(body);
    tripod.body = body;

    // Three legs in triangle formation
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.2
    });

    const legPositions = [
        { x: 0, z: -2 },
        { x: 1.7, z: 1 },
        { x: -1.7, z: 1 }
    ];

    tripod.legs = [];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos.x, 4, pos.z);
        leg.castShadow = true;
        leg.userData.isLeg = true;
        leg.userData.tripodParent = tripod;
        tripod.add(leg);
        tripod.legs.push(leg);
    });

    // Heat ray emitter
    const heatRayGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const heatRayMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });
    const heatRay = new THREE.Mesh(heatRayGeometry, heatRayMaterial);
    heatRay.position.y = 7;
    tripod.add(heatRay);
    tripod.heatRay = heatRay;

    tripod.position.set(x, 0, z);
    tripod.userData.isAlive = true;
    tripod.userData.legsHit = 0;
    tripod.userData.maxHealth = 200;
    tripod.userData.health = 200;
    tripod.userData.heatRayActivationTime = null;

    // Movement AI properties
    tripod.userData.wanderTarget = new THREE.Vector3(x, 0, z);
    tripod.userData.wanderTimer = Math.random() * 3;

    return tripod;
}

export function spawnTripods() {
    for (let i = 0; i < gameState.totalTripods; i++) {
        const x = (Math.random() - 0.5) * 60;
        const z = -30 - Math.random() * 50;
        const tripod = createTripod(x, z);
        scene.add(tripod);
        tripods.push(tripod);
    }
}

export function destroyTripod(tripod) {
    tripod.userData.isAlive = false;
    gameState.score++;
    updateScore(gameState.score);

    // Clean up heat ray beam
    if (tripod.warningBeam) {
        scene.remove(tripod.warningBeam);
        tripod.warningBeam = null;
    }

    // Visual effect - make everything red
    tripod.children.forEach(child => {
        if (child && child.material) {
            child.material.color.set(0xff0000);
            child.material.emissive.set(0xff0000);
            child.material.emissiveIntensity = 1;
        }
    });

    // Check for win condition
    if (gameState.score >= gameState.totalTripods) {
        setTimeout(() => {
            const anyVehicleAlive = vehicles.some(v => v.isAlive);
            if (anyVehicleAlive) {
                showVictory();
            }
        }, 500);
    }

    // Remove after delay
    setTimeout(() => {
        scene.remove(tripod);
        const index = tripods.indexOf(tripod);
        if (index > -1) tripods.splice(index, 1);
    }, 1000);
}
