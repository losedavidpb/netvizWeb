import type { GLWindow } from "../../gui/GLWindow";
import type { Command } from "../Command";

/**
 * RefreshGraph :: Command to refresh the graph
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class RefreshGraph implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;
    private callback: () => void;

    /**
     * Constructor for RefreshGraph
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.callback = () => { };
    }

    /**
     * Set the callback used to re-render the graph
     *
     * @param callback callback for rendering
     */
    setCallback(callback: () => void): void {
        this.callback = callback;
    }

    execute(): void {
        this.window.applyAlgorithm();
        this.window.applyColoration();
        this.callback();
    }
}