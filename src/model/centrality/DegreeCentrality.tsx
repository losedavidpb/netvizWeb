import { Centrality } from "../Centrality";
import type { Graph } from "../Graph";
import type { Vertex } from "../Vertex";

/**
 * DegreeCentrality :: Representation of a DegreeCentrality algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class DegreeCentrality extends Centrality {
    apply(graph: Graph): void {
        let vertices = graph.getVertices();
        this.apply_centrality(vertices);
    }

    // --------------------------------
    // Private
    // --------------------------------

    private get_max_min(vertices: Vertex[]): [max: number, min: number] {
        let [max, min] = [0, 999999999];

        for (let i = 0; i < vertices.length; ++i) {
            let degree = vertices[i].getDegree();

            if (degree > max) max = degree;
            if (degree < min) min = degree;
        }

        return [max, min];
    }

    private apply_centrality(vertices: Vertex[]): void {
        if (vertices.length !== 0) {
            let [max, min] = this.get_max_min(vertices);

            for (let i = 0; i < vertices.length; ++i) {
                let x = max == min ? 0 : Centrality.normalize(vertices[i].getDegree(), max, min);
                let h = (1 - x) * 240;

                let [r, g, b] = Centrality.HSVtoRGB(h, 1, 1);
                vertices[i].setColour(r, g, b);
            }
        }
    }
}