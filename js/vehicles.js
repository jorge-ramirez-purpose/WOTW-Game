import * as THREE from 'three';
import { scene, vehicles, activeVehicle, setActiveVehicle } from './state.js';
import { updateVehicleHP, updateActiveVehicleLabel, showGameOver } from './ui.js';

function createSingleVehicle(color, x, y, z, type) {
    const geometry = new THREE.BoxGeometry(2, 1, 3);
    const material = new THREE.MeshStandardMaterial({ color });
    const vehicle = new THREE.Mesh(geometry, material);
    vehicle.position.set(x, y, z);
    vehicle.castShadow = true;
    vehicle.hp = 100;
    vehicle.maxHp = 100;
    vehicle.isAlive = true;
    vehicle.type = type;
    scene.add(vehicle);

    if (type === 'cannon') {
        // Cannon uses a pivot group so the barrel can tilt up/down
        const barrelPivot = new THREE.Group();
        barrelPivot.position.set(0, 0.5, -1);
        vehicle.add(barrelPivot);
        vehicle.barrelPivot = barrelPivot;
        vehicle.barrelAngle = 0;

        // Thicker, shorter barrel for cannon look
        const barrelGeometry = new THREE.BoxGeometry(0.5, 0.5, 1.5);
        const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.position.set(0, 0, -0.75);
        barrelPivot.add(barrel);
        vehicle.barrel = barrel;
    } else {
        // Machine gun barrel (original)
        const barrelGeometry = new THREE.BoxGeometry(0.3, 0.3, 2);
        const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.position.set(0, 0.5, -2);
        vehicle.add(barrel);
        vehicle.barrel = barrel;
    }

    return vehicle;
}

export function createVehicles() {
    const vehicle1 = createSingleVehicle(0xd2b48c, 0, 0.5, 0, 'machinegun');
    const vehicle2 = createSingleVehicle(0x556b2f, 10, 0.5, 0, 'cannon');

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
                    updateActiveVehicleLabel(newIndex + 1, aliveVehicles[0].type);
                }
            }
        }, 1000);
    }
}
