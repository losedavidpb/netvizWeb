import type { GLWindow } from "../../gui/GLWindow";
import type { Command } from "../Command";
import { GraphFactoryMethod } from '../../model/graph/GraphFactoryMethod';

/**
 * LoadGraph :: Command to load the graph
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class LoadGraph implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;

    /**
     * Constructor for LoadGraph
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
    }

    execute(): void {
        const content = this.window.getContent();

        if (content !== '') {
            const lines = content.split(/\r?\n/);
            const line = lines[0];

            const graph = GraphFactoryMethod.createGraph(line, content);
            this.window.setGraph(graph);

            this.window.refresh();
        }
    }
}