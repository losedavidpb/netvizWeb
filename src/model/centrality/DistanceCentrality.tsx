import { Centrality } from "../Centrality";
import type { Graph } from "../Graph";
import type { Vertex } from "../Vertex";

/**
 * DistanceCentrality :: Centrality based on the distance
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class DistanceCentrality extends Centrality {

    apply(graph: Graph): void {
        const vertices = graph.getVertices();
        this.apply_centrality(vertices);
    }

    // --------------------------------
    // Private
    // --------------------------------

    private get_max_min(vertices: Vertex[], distances: number[]): [max: number, min: number] {
        let [max, min] = [0, 999999999];

        for (let i = 0; i < vertices.length; ++i) {
            const pos_v = vertices[i].getPos();
            let dist = 0;

            for (let j = 0; j < vertices.length; ++j) {
                if (i == j) continue;

                const pos_u = vertices[j].getPos();

                const x_dist = (pos_v.x - pos_u.x);
                const y_dist = (pos_v.y - pos_u.y);
                dist += Math.sqrt((x_dist * x_dist) + (y_dist * y_dist));
            }

            if (dist > max) max = dist;
            if (dist < min) min = dist;

            distances.push(dist);
        }

        return [max, min];
    }

    private apply_centrality(vertices: Vertex[]): void {
        if (vertices.length !== 0) {
            const distances: number[] = [];
            const [max, min] = this.get_max_min(vertices, distances);

            for (let i = 0; i < vertices.length; ++i) {
                const x = max === min ? 0 : Centrality.normalize(distances[i], max, min);
                const h = (1 - x) * 240;

                const [r, g, b] = Centrality.HSVtoRGB(h, 1, 1);
                vertices[i].setColour(r, g, b);
            }
        }
    }
}