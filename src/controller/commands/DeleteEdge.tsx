import type { GLWindow } from "../../gui/GLWindow";
import { EdgeGraph } from "../../model/graph/EdgeGraph";
import type { Command } from "../Command";

/**
 * DeleteEdge :: Command to delete the selected edge
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class DeleteEdge implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;
    private selectedEdge: number;

    /**
     * Constructor for DeleteEdge
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.selectedEdge = -1;
    }

    /**
     * Set the selected edge
     *
     * @param selectedEdge selected edge
     */
    setSelectedEdge(selectedEdge: number): void {
        this.selectedEdge = selectedEdge;
    }

    execute(): void {
        if (this.selectedEdge !== -1) {
            const graph = this.window.getGraph();

            if (graph !== undefined) {
                const newEdges = graph.getEdges().filter((_, i) =>
                    i != this.selectedEdge
                );

                const tempGraph = graph;
                const oldVertices = tempGraph.getVertices();

                const newGraph = new EdgeGraph(undefined, newEdges);
                const newVertices = newGraph.getVertices();

                for (let i = 0; i < newVertices.length; ++i) {
                    const oldPos = oldVertices[i].getPos();
                    const [r, g, b] = oldVertices[i].getColour();

                    newVertices[i].setPos({ x: oldPos.x, y: oldPos.y, z: oldPos.z });
                    newVertices[i].setText(oldVertices[i].getText());
                    newVertices[i].setColour(r, g, b);
                }

                this.window.setGraph(newGraph);
                this.window.refresh();
            }
        }
    }
}