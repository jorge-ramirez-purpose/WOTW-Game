import { keys, mouse, gameState, vehicles, setActiveVehicle } from './state.js';
import { shoot } from './combat.js';
import { updateActiveVehicleLabel, togglePause } from './ui.js';

export function initInput() {
    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            const now = Date.now();
            if (now - gameState.lastShot > 200) {
                shoot();
                gameState.lastShot = now;
            }
        }
        if (e.code === 'KeyP') {
            gameState.isPaused = !gameState.isPaused;
            togglePause(gameState.isPaused);
        }
        // Vehicle switching
        if (e.code === 'Digit1') {
            if (vehicles.length > 0 && vehicles[0].isAlive) {
                setActiveVehicle(vehicles[0], 0);
                updateActiveVehicleLabel(1);
            }
        }
        if (e.code === 'Digit2') {
            if (vehicles.length > 1 && vehicles[1].isAlive) {
                setActiveVehicle(vehicles[1], 1);
                updateActiveVehicleLabel(2);
            }
        }
    });
}
