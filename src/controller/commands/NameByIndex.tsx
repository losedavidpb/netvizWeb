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

    private readonly window: GLWindow;

    /**
     * Creates a new NameByIndex instance.
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

            for (const vertex of vertices) {
                const edges = vertex.getEdges();

                for (const edge of edges) {
                    const base = edge.getBase();
                    const connect = edge.getConnect();

                    edge.setText(base.getText() + ' - ' + connect.getText());
                }
            }

            this.window.refresh(true, true);
        }
    }
}