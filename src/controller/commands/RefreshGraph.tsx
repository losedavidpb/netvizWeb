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
    private applyAlgorithm: boolean;
    private applyColoration: boolean;
    private callback: () => void;

    /**
     * Constructor for RefreshGraph
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.applyAlgorithm = true;
        this.applyColoration = true;
        this.callback = () => { };
    }

    /**
     * Enable or disable the algorithm
     *
     * @param applyAlgorithm state of the algorithm
     */
    setApplyAlgorithm(applyAlgorithm: boolean): void {
        this.applyAlgorithm = applyAlgorithm;
    }

    /**
     * Enable or disable the coloration
     *
     * @param applyColoration state of the coloration
     */
    setApplyColoration(applyColoration: boolean): void {
        this.applyColoration = applyColoration;
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
        if (this.applyAlgorithm) this.window.applyAlgorithm();
        if (this.applyColoration) this.window.applyColoration();

        this.callback();
    }
}