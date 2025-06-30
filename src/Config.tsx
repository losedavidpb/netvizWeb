import * as THREE from 'three';

import type { GLWindow } from './gui/GLWindow';
import { FileType } from './controller/commands/SaveGraph';
import { CommandMap } from './controller/CommandMap';
import { AlgorithmType } from './model/Algorithm';
import { CentralityType } from './model/Centrality';

/**
 * Config :: Configuration of the project
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Config {
    // Avoid instances
    private constructor() { }

    // --------------------------------
    // General
    // --------------------------------

    // Name of the application
    static readonly name: string = "NetvizWeb";

    // Version of the application
    static readonly version: string = "v1.0.0";

    // Author of the application
    static readonly author: string = "David Parreño Barbuzano";

    // Contact of the author
    static readonly contact: string = "losedavidpb@gmail.com";

    // Footer of the application
    static readonly footer: string = `${Config.name} (${Config.version}) - ${Config.author} <${Config.contact}>`;

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
    // Concurrency
    // --------------------------------

    // Delay duration used to synchronise the execution timing .
    static readonly delay: number = 0.2;

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

    // Map of commands to be used
    static readonly commands: CommandMap = new CommandMap();

    // --------------------------------
    // Keys
    // --------------------------------

    // Available keys the user can employ to interact with the window.
    //
    // This variable should not be modified externally except by the method
    // setKeyHandler. However, the assigned keys within this structure may
    // be adjusted directly if required
    static readonly keyBindings: Record<string, {
        key: string;            // Assigned key
        state: boolean;         // State of the key
        handler: () => void;    // Function to be executed when key is pressed
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
     * Marks the key as pressed and invokes its handler.
     *
     * @param key key to check
     */
    static keyPressed(key: string): void {
        this.set_key_state(key, true);
    }

    /**
     * Marks the key as released.
     *
     * @param key key to check
     */
    static keyReleased(key: string): void {
        this.set_key_state(key, false);
    }

    /**
     * Updates the handler of the specified key.
     *
     * @param key associated key
     * @param handler new key handler
     */
    static setKeyHandler(key: string, handler: () => void): void {
        if (key in Config.keyBindings) {
            Config.keyBindings[key].handler = handler;
        }
    }

    // --------------------------------
    // Mouse
    // --------------------------------

    // Position where the mouse is pointing.
    private static mousePos = new THREE.Vector2();

    /**
     * Gets the position where the mouse is pointing.
     *
     * @returns mouse position
     */
    static getMousePos(): THREE.Vector2 {
        return new THREE.Vector2(
            Config.mousePos.x, Config.mousePos.y
        );
    }

    // Mouse buttons the user can employ to interact with the window.
    //
    // This variable should not be modified externally except
    // by the method setMouseHandler
    static readonly mouseBindings: Record<string, {
        button: number;         // Button of the mouse
        state: boolean;         // State of the button
        handler: () => void;    // Function to be executed when button is pressed
    }> = {
        left:   { button: 0, state: false, handler: () => { } },
        middle: { button: 1, state: false, handler: () => { } },
        right:  { button: 2, state: false, handler: () => { } },
    };

    /**
     * Marks the mouse as pressed and invokes its handler.
     *
     * @param event mouse event
     */
    static mousePressed(event: React.MouseEvent): void {
        Config.mousePos = new THREE.Vector2(event.clientX, event.clientY);
        Config.set_mouse_state(event.button, true);
    }

    /**
     * Marks the mouse as released.
     *
     * @param event mouse event
     */
    static mouseReleased(event: React.MouseEvent): void {
        Config.mousePos = new THREE.Vector2(event.clientX, event.clientY);
        Config.set_mouse_state(event.button, false);
    }

    /**
     * Handles mouse movement events.
     *
     * @param window window to be operated on
     * @param event mouse event
     */
    static mousePosition(window: GLWindow, event: React.MouseEvent): void {
        if (Config.mouseBindings['left'].state && Config.keyBindings['dragVertex'].state) {
            const mouseDiff = new THREE.Vector2(
                Config.mousePos.x - event.clientX,
                Config.mousePos.y - event.clientY
            );

            window.dragVertex(mouseDiff, 1);
        }
    }

    /**
     * Updates the handler of the specified mouse button.
     *
     * @param button button of the mouse
     * @param handler new mouse handler
     */
    static setMousehandler(button: string, handler: () => void): void {
        if (button in Config.mouseBindings) {
            Config.mouseBindings[button].handler = handler;
        }
    }

    // --------------------------------
    // Vertex
    // --------------------------------

    // Radius of the vertex
    static readonly radius: number = 1;

    // Horizontal divisions for the vertex geometry
    static readonly rings: number = 12;

    // Vertical divisions for the vertex geometry
    static readonly sectors: number = 12;

    // Vertex size for spherical dimensions
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

                break;
            }
        }
    }

    private static set_mouse_state(button: number, state: boolean): void {
        for (const binding of Object.values(Config.mouseBindings)) {
            if (binding.button === button) {
                binding.state = state;
                if (binding.state) binding.handler();

                break;
            }
        }
    }
}