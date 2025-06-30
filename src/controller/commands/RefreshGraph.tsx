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

    private callback: () => void = () => { };

    /**
     * Updates the callback used to render the graph,
     *
     * @param callback callback for rendering
     */
    setCallback(callback: () => void): void {
        this.callback = callback;
    }

    execute(): void {
        this.callback();
    }
}