import { Centrality } from "../Centrality";
import type { Graph } from "../Graph";
import type { Vertex } from "../Vertex";

/**
 * DistanceCentrality :: Representation of a DistanceCentrality algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class DistanceCentrality extends Centrality {
    apply(graph: Graph): void {
        let vertices = graph.getVertices();
        this.apply_centrality(vertices);
    }

    // --------------------------------
    // Private
    // --------------------------------

    private get_max_min(vertices: Vertex[], distances: number[]): [max: number, min: number] {
        let [max, min] = [0, 0];
        let dist = 0;

        for (let i = 0; i < vertices.length; ++i) {
            let pos_v = vertices[i].getPos();

            for (let j = 0; j < vertices.length; ++j) {
                if (i == j) continue;

                let pos_u = vertices[j].getPos();

                let x_dist = (pos_v.x - pos_u.x);
                let y_dist = (pos_v.y - pos_u.y);
                dist += Math.sqrt((x_dist * x_dist) + (y_dist * y_dist));
            }

            if (dist > max) max = dist;
            if (dist < min) min = dist;

            distances.push(dist);
            dist = 0;
        }

        return [max, min];
    }

    private apply_centrality(vertices: Vertex[]): void {
        if (vertices.length !== 0) {
            let distances: number[] = [];
            let [max, min] = this.get_max_min(vertices, distances);

            for (let i = 0; i < vertices.length; ++i) {
                let x = max == min ? 0 : Centrality.normalize(distances[i], max, min);
                let h = (1 - x) * 240;

                let [r, g, b] = Centrality.HSVtoRGB(h, 1, 1);
                vertices[i].setColour(r, g, b);
            }
        }
    }
}