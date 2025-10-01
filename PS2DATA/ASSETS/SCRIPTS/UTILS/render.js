let debugMemoryEnabled = false;
let debugPlayerEnabled = false;
let font = new Font("default");

function DebugMemory() {
    const ramStats = System.getMemoryStats();
    const totalRAM = 32 * 1048576;
    const availableRAM = totalRAM - ramStats.core;
    const userUsedRAM = ramStats.used - ramStats.core;
    const userFreeRAM = availableRAM - userUsedRAM;
    
    const availableMB = (availableRAM / 1048576).toFixed(2);
    const userUsedMB = (userUsedRAM / 1048576).toFixed(2);
    const userFreeMB = (userFreeRAM / 1048576).toFixed(2);
    const coreMB = (ramStats.core / 1048576).toFixed(2);
    
    return [
        `Used: ${userUsedMB}MB / ${availableMB}MB`,
        `Free: ${userFreeMB}MB`,
        `Core (Engine): ${coreMB}MB`
    ];
}

function DebugPlayer(player, camera) {
    if (!player) return [];
    
    return [
        `Player X: ${Math.floor(player.x)} Y: ${Math.floor(player.y)}`,
        `Velocity X: ${player.velocityX.toFixed(2)} Y: ${player.velocityY.toFixed(2)}`,
        `Camera X: ${Math.floor(camera.x)} Y: ${Math.floor(camera.y)}`,
        `State: ${player.state} Direction: ${player.direction}`,
        `OnGround: ${player.onGround}`
    ];
}

export function renderScreen(callback, player = null, camera = null) {
    Screen.display(() => {
        callback();

        let yOffset = 10;

        if (debugPlayerEnabled && player) {
            const playerDebug = DebugPlayer(player, camera || { x: 0, y: 0 });
            playerDebug.forEach(line => {
                font.print(10, yOffset, line);
                yOffset += 15;
            });
            yOffset += 10;
        }

        if (debugMemoryEnabled) {
            const memoryDebug = DebugMemory();
            memoryDebug.forEach(line => {
                font.print(10, yOffset, line);
                yOffset += 15;
            });
        }
    });
}

export function toggleDebugMemory() {
    debugMemoryEnabled = !debugMemoryEnabled;
    console.log(`Debug Memory: ${debugMemoryEnabled ? "ON" : "OFF"}`);
}

export function toggleDebugPlayer() {
    debugPlayerEnabled = !debugPlayerEnabled;
    console.log(`Debug Player: ${debugPlayerEnabled ? "ON" : "OFF"}`);
}

export function setDebugMemory(value) {
    debugMemoryEnabled = value;
}

export function setDebugPlayer(value) {
    debugPlayerEnabled = value;
}