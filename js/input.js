import { keys, mouse, gameState, vehicles, setActiveVehicle } from './state.js';
import { updateActiveVehicleLabel, togglePause, showCannonAngleUI, hideCannonAngleUI } from './ui.js';

export function initInput() {
    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyP') {
            gameState.isPaused = !gameState.isPaused;
            togglePause(gameState.isPaused);
        }
        // Vehicle switching
        if (e.code === 'Digit1') {
            if (vehicles.length > 0 && vehicles[0].isAlive) {
                setActiveVehicle(vehicles[0], 0);
                updateActiveVehicleLabel(1, vehicles[0].type);
                hideCannonAngleUI();
            }
        }
        if (e.code === 'Digit2') {
            if (vehicles.length > 1 && vehicles[1].isAlive) {
                setActiveVehicle(vehicles[1], 1);
                updateActiveVehicleLabel(2, vehicles[1].type);
                if (vehicles[1].type === 'cannon') {
                    showCannonAngleUI();
                }
            }
        }
    });
}
