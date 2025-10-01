import { SceneManager, ImageManager, SfxManager, StreamManager } from "./UTILS/scenemanager.js";
import { renderScreen, toggleDebugMemory, toggleDebugPlayer, setDebugMemory, setDebugPlayer } from "./UTILS/render.js";
import { Player } from "./UTILS/player.js";
import { AnimationSystem } from "./animation.js";

globalThis.renderScreen = renderScreen;
globalThis.toggleDebugMemory = toggleDebugMemory;
globalThis.toggleDebugPlayer = toggleDebugPlayer;
globalThis.setDebugMemory = setDebugMemory;
globalThis.setDebugPlayer = setDebugPlayer;
globalThis.SceneManager = SceneManager;
globalThis.ImageManager = ImageManager;
globalThis.SfxManager = SfxManager;
globalThis.StreamManager = StreamManager;
globalThis.Player = Player;
globalThis.AnimationSystem = AnimationSystem;