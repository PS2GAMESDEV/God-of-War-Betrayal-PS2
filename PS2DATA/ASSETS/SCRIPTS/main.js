import "./scenes.js";
import { forSpartaUpdate } from "./LEVELS/forsparta.js";

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);

SceneManager.load(forSpartaUpdate);