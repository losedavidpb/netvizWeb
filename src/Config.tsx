import * as THREE from 'three';

import { FileType } from './controller/commands/SaveGraph';
import { CommandMap } from './controller/CommandMap';
import { GLWindow } from './gui/GLWindow';
import { AlgorithmType } from './model/Algorithm';
import { CentralityType } from './model/Centrality';

/**
 * Config :: Configuration of the entire project
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Config {
    // Avoid instances
    private constructor() { }

    // --------------------------------
    // General
    // --------------------------------

    // Specify whether or not the project is being tested. Do not modify
    // this setting here, but modify it in the test files instead
    static testMode: boolean = false;

    // --------------------------------
    // WebGL
    // --------------------------------

    // Scene in which all objects are rendered
    static scene: THREE.Scene;

    // Camera used to view the scene
    static camera: THREE.Camera;

    // WebGL renderer used to draw the scene
    static renderer: THREE.WebGLRenderer;

    // --------------------------------
    // File
    // --------------------------------

    // Default file type to save
    static readonly defaultFileType: FileType = FileType.ADJACENCY;

    // Extension of the default file type
    static readonly defaultExtension: string = '.adj';

    // Default filename to export
    static readonly defaultExportFile: string = 'Untitled' + Config.defaultExtension;

    // Default PNG filename
    static readonly defaultPNG: string = "DefaultPng.png";

    // Default SVG filename
    static readonly defaultSVG: string = "DefaultSvg.svg";

    // --------------------------------
    // Algorithm
    // --------------------------------

    // Default algorithm
    static readonly defaultAlgorithm: AlgorithmType = AlgorithmType.FruchtermanReingold;

    // --------------------------------
    // Centrality
    // --------------------------------

    // Default centrality algorithm
    static readonly defaultCentrality: CentralityType = CentralityType.DegreeCentrality;

    // --------------------------------
    // Command
    // --------------------------------

    static readonly commands: CommandMap = new CommandMap();

    // --------------------------------
    // Keys
    // --------------------------------

    // Available keys the user can employ to interact with the window
    static readonly keyBindings: Record<string, {
        key: string;
        state: boolean;
        handler: () => void;
    }> = {
        toogleToolbox:  { key: 'Escape',    state: false,   handler: () => { } },
        nameByIndex:    { key: 'n',         state: false,   handler: () => { } },
        pngScreenshot:  { key: 'F8',        state: false,   handler: () => { } },
        svgScreenshot:  { key: 'F9',        state: false,   handler: () => { } },
        deleteVertex:   { key: 'Delete',    state: false,   handler: () => { } },
        deleteEdge:     { key: 'Insert',    state: false,   handler: () => { } },
        select:         { key: 'Shift',     state: false,   handler: () => { } },
        dragVertex:     { key: 'Control',   state: false,   handler: () => { } }
    };

    /**
     * Save the new state of the key if is pressed
     *
     * @param key key to check
     */
    static keyPressed(key: string): void {
        this.set_key_state(key, true);
    }

    /**
     * Save the new state of the key if is released
     *
     * @param key key to check
     */
    static keyReleased(key: string): void {
        this.set_key_state(key, false);
    }

    /**
     * Set the key handler of the passed action
     *
     * @param action action to modify
     * @param handler new key handler
     */
    static setKeyHandler(action: string, handler: () => void): void {
        Config.keyBindings[action].handler = handler;
    }

    // --------------------------------
    // Mouse
    // --------------------------------

    // Current position of the mouse
    static mousePos = new THREE.Vector2();

    // Mouse buttons the user can employ to interact with the window
    static readonly mouseBindings: Record<string, {
        button: number;
        state: boolean;
        handler: () => void;
    }> = {
        left:   { button: 0, state: false, handler: () => { } },
        middle: { button: 1, state: false, handler: () => { } },
        right:  { button: 2, state: false, handler: () => { } },
    };

    /**
     * Handle mouse press events
     *
     * @param event mouse event
     */
    static mousePressed(event: React.MouseEvent): void {
        Config.mousePos = new THREE.Vector2(event.clientX, event.clientY);
        Config.set_mouse_state(event.button, true);
    }

    /**
     * Handle mouse release events
     *
     * @param event mouse event
     */
    static mouseReleased(event: React.MouseEvent): void {
        Config.mousePos = new THREE.Vector2(event.clientX, event.clientY);
        Config.set_mouse_state(event.button, false);
    }

    /**
     * Handle mouse position events
     *
     * @param event mouse event
     */
    static mousePosition(event: React.MouseEvent): void {
        const window = GLWindow.init();

        if (Config.mouseBindings['left'].state && Config.keyBindings['dragVertex'].state) {
            const mouseDiff = new THREE.Vector2(
                Config.mousePos.x - event.clientX,
                Config.mousePos.y - event.clientY
            );

            window.dragVertex(mouseDiff, 1);
        }
    }

    /**
     * Set the mouse handler of the passed action
     *
     * @param button action to modify
     * @param handler new mouse handler
     */
    static setMousehandler(button: string, handler: () => void): void {
        Config.mouseBindings[button].handler = handler;
    }

    // --------------------------------
    // Vertex
    // --------------------------------

    // Radius of the vertex
    static readonly radius: number = 1;

    // Number of horizontal divisions (latitude)
    // for the vertex sphere geometry
    static readonly rings: number = 12;

    // Number of vertical divisions (longitude)
    // for the vertex sphere geometry
    static readonly sectors: number = 12;

    // Size of the vertex for spherical dimensions
    static readonly size: number = Config.rings * Config.sectors * 3;

    // Step size between rings
    static readonly ringStep: number = 1.0 / (Config.rings - 1);

    // Step size between sectors
    static readonly sectorStep: number = 1.0 / (Config.sectors - 1);

    // --------------------------------
    // Private
    // --------------------------------

    private static set_key_state(key: string, state: boolean): void {
        for (const binding of Object.values(Config.keyBindings)) {
            if (binding.key === key) {
                binding.state = state;
                if (binding.state) binding.handler();
            }
        }
    }

    private static set_mouse_state(button: number, state: boolean): void {
        for (const binding of Object.values(Config.mouseBindings)) {
            if (binding.button === button) {
                binding.state = state;
                if (binding.state) binding.handler();
            }
        }
    }
}