// Core Three.js objects (initialized by scene.js)
export let scene = null;
export let camera = null;
export let renderer = null;

export function initCore(s, c, r) {
    scene = s;
    camera = c;
    renderer = r;
}

// Game entity arrays
export const vehicles = [];
export const tripods = [];
export const projectiles = [];

// Active vehicle tracking
export let activeVehicle = null;
export let activeVehicleIndex = 0;

export function setActiveVehicle(vehicle, index) {
    activeVehicle = vehicle;
    activeVehicleIndex = index;
}

// Game state
export const gameState = {
    score: 0,
    lastAttackedEnemy: null,
    isPaused: false,
    totalTripods: 4,
    lastShot: 0
};

// Input state
export const keys = {};
export const mouse = { x: 0, y: 0 };
