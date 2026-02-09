const TYPE_LABELS = {
    machinegun: 'Machine Gun',
    cannon: 'Cannon'
};

export function updateVehicleHP(vehicleNumber, hp) {
    document.getElementById(`hp-text-${vehicleNumber}`).textContent = Math.ceil(hp);
    document.getElementById(`hp-fill-${vehicleNumber}`).style.width = hp + '%';
}

export function updateScore(score) {
    document.getElementById('score').textContent = score;
}

export function updateActiveVehicleLabel(vehicleNumber, type) {
    const label = TYPE_LABELS[type] || 'Machine Gun';
    document.getElementById('active-vehicle').textContent = `Vehicle ${vehicleNumber} (${label})`;
}

export function updateEnemyHP(health, maxHealth) {
    document.getElementById('enemy-ui').style.display = 'block';
    document.getElementById('enemy-hp-fill').style.width =
        (health / maxHealth * 100) + '%';
    document.getElementById('enemy-hp-text').textContent = Math.max(0, health);
}

export function hideEnemyUI() {
    document.getElementById('enemy-ui').style.display = 'none';
}

export function showGameOver() {
    document.getElementById('message').innerHTML =
        'DESTROYED<br><button onclick="location.reload()" style="margin-top: 20px; padding: 15px 30px; font-size: 24px; cursor: pointer; background: #d2b48c; color: white; border: 2px solid white; border-radius: 5px;">Retry</button>';
    document.getElementById('message').style.display = 'block';
}

export function showVictory() {
    document.getElementById('message').innerHTML =
        'VICTORY!<br><button onclick="location.reload()" style="margin-top: 20px; padding: 15px 30px; font-size: 24px; cursor: pointer; background: #4a6fa5; color: white; border: 2px solid white; border-radius: 5px;">Play Again</button>';
    document.getElementById('message').style.display = 'block';
}

export function togglePause(isPaused) {
    document.getElementById('pause-indicator').style.display = isPaused ? 'block' : 'none';
}

export function updateCannonAngle(angleDegrees) {
    document.getElementById('cannon-angle').textContent = angleDegrees;
}

export function showCannonAngleUI() {
    document.getElementById('cannon-angle-ui').style.display = 'block';
}

export function hideCannonAngleUI() {
    document.getElementById('cannon-angle-ui').style.display = 'none';
}
