import * as THREE from 'three';
import { scene, vehicles, activeVehicle, setActiveVehicle } from './state.js';
import { updateVehicleHP, updateActiveVehicleLabel, showGameOver } from './ui.js';

function createSingleVehicle(color, x, y, z) {
    const geometry = new THREE.BoxGeometry(2, 1, 3);
    const material = new THREE.MeshStandardMaterial({ color });
    const vehicle = new THREE.Mesh(geometry, material);
    vehicle.position.set(x, y, z);
    vehicle.castShadow = true;
    vehicle.hp = 100;
    vehicle.maxHp = 100;
    vehicle.isAlive = true;
    scene.add(vehicle);

    // Barrel
    const barrelGeometry = new THREE.BoxGeometry(0.3, 0.3, 2);
    const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.position.set(0, 0.5, -2);
    vehicle.add(barrel);
    vehicle.barrel = barrel;

    return vehicle;
}

export function createVehicles() {
    const vehicle1 = createSingleVehicle(0xd2b48c, 0, 0.5, 0);
    const vehicle2 = createSingleVehicle(0x8b7355, 10, 0.5, 0);

    vehicles.push(vehicle1, vehicle2);
    setActiveVehicle(vehicles[0], 0);
}

export function takeDamage(vehicle, amount) {
    if (!vehicle.isAlive) return;

    vehicle.hp = Math.max(0, vehicle.hp - amount);

    const vehicleIndex = vehicles.indexOf(vehicle) + 1;
    updateVehicleHP(vehicleIndex, vehicle.hp);

    if (vehicle.hp <= 0) {
        vehicle.isAlive = false;

        // Visual effect - make vehicle red
        vehicle.material.color.set(0xff0000);
        vehicle.material.emissive.set(0xff0000);
        vehicle.material.emissiveIntensity = 0.5;

        setTimeout(() => {
            scene.remove(vehicle);
            const index = vehicles.indexOf(vehicle);
            if (index > -1) {
                vehicles.splice(index, 1);
            }

            const aliveVehicles = vehicles.filter(v => v.isAlive);
            if (aliveVehicles.length === 0) {
                showGameOver();
            } else {
                // Switch to another alive vehicle if this was the active one
                if (vehicle === activeVehicle) {
                    const newIndex = vehicles.indexOf(aliveVehicles[0]);
                    setActiveVehicle(aliveVehicles[0], newIndex);
                    updateActiveVehicleLabel(newIndex + 1);
                }
            }
        }, 1000);
    }
}
