import type { GLWindow } from "../../gui/GLWindow";
import type { Command } from "../Command";

/**
 * NameByIndex :: Command to name the vertices using their index
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class NameByIndex implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;

    /**
     * Constructor for NameByIndex
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
    }

    execute(): void {
        const graph = this.window.getGraph();

        if (graph !== null) {
            const vertices = graph.getVertices();

            for (let j = 0; j < vertices.length; ++j) {
                vertices[j].setText(j + '');

                if (this.window.getSelectedNode() === vertices[j]) {
                    this.window.updateTextNode(vertices[j].getText());
                }
            }

            for (let j = 0; j < vertices.length; ++j) {
                const edges = vertices[j].getEdges();

                for (let k = 0; k < edges.length; k++) {
                    const base = edges[k].getBase();
                    const connect = edges[k].getConnect();

                    edges[k].setText(base.getText() + ' - ' + connect.getText());

                    // TODO: Selected edges?
                }
            }

            this.window.refresh(false, false);
        }
    }
}