import { mapImages } from "./forsparta/mapimages.js"
import { hitboxes } from "./forsparta/hitboxes.js"

export function forSpartaUpdate() {
    const level = {
        player: null,
        enemies: [],
        camera: { x: 0, y: 0 },
        levelWidth: 9850,
        levelHeight: 448,
        time: Timer.new(),
        lastTime: 0,
        initialized: false,
        debug: false
    }

    const game = {
        keys: { right: false, left: false, up: false, l1: false, l2: false, square: false, cross: false },
        gravity: 60,
        jumpPower: -860,
        forwardImpulse: 350
    }

    const pad = Pads.get(0)

    function initLevel() {
        if (level.initialized) return
        try {
            level.player = new Player(0, 0, 128, 128)
            level.camera.x = 0
            level.camera.y = 0
            level.initialized = true
        } catch (e) {
            console.log(`erro ao iniciar: ${e.message}`)
        }
    }

    function handleInput() {
        pad.update()
        game.keys.right = pad.pressed(Pads.RIGHT)
        game.keys.left = pad.pressed(Pads.LEFT)
        game.keys.up = pad.justPressed(Pads.UP)
        game.keys.l1 = pad.pressed(Pads.L1)
        game.keys.l2 = pad.pressed(Pads.L2)
        game.keys.square = pad.justPressed(Pads.SQUARE)
        game.keys.cross = pad.justPressed(Pads.CROSS)
        if (pad.justPressed(Pads.SELECT)) {
            level.debug = !level.debug
        }
    }

    renderScreen(() => {
        
    if (!level.initialized) initLevel()
    const currentTime = Timer.getTime(level.time) / 1000
    const deltaTime = currentTime - level.lastTime
    level.lastTime = currentTime

    handleInput()

    if (level.player) {
        level.player.update(deltaTime, game, hitboxes)
        const screenWidth = 640
        level.camera.x = level.player.x - screenWidth / 2
        if (level.camera.x < 0) level.camera.x = 0
        if (level.camera.x > level.levelWidth - screenWidth)
            level.camera.x = level.levelWidth - screenWidth
        level.camera.y = 0
    }

    mapImages.forEach(tile => {
        tile.img.draw(tile.x - level.camera.x, tile.y - level.camera.y)
    })

    hitboxes.forEach(hb => hb.draw(level.camera))
    if (level.player) {
        level.player.render(level.camera)
    }
    level.enemies.forEach(enemy => {
        if (enemy.update) enemy.update(deltaTime)
        if (enemy.render) enemy.render(level.camera)
    })
}, level.player, level.camera)}