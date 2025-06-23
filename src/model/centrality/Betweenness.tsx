import { Centrality } from "../Centrality";
import type { Graph } from "../Graph";
import type { Vertex } from "../Vertex";

/**
 * Betweenness :: Centrality based on the betweenness
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Betweenness extends Centrality {

    // --------------------------------
    // Properties
    // --------------------------------

    private vals: number[] = [];
    private tree: number[][] = [];

    apply(graph: Graph): void {
        const vertices = graph.getVertices();
        this.vals = new Array(vertices.length).fill(0);

        this.init_centrality(graph, vertices)
        this.apply_centrality(vertices);
    }

    // --------------------------------
    // Private
    // --------------------------------

    private init_centrality(graph: Graph, vertices: Vertex[]): void {
        this.build_tree(graph);

        for (let i = 0; i < vertices.length; ++i) {
            for (let j = 0; j < vertices.length; ++j) {
                if (i == j) break;
                this.breadth_first_search(vertices, i, j);
            }
        }
    }

    private apply_centrality(vertices: Vertex[]): void {
        if (vertices.length !== 0) {
            const [max, min] = this.get_max_min(vertices);

            for (let i = 0; i < vertices.length; ++i) {
                const x = max === min ? 0 : Centrality.normalize(this.vals[i], max, min);
                const h = (1 - x) * 240;

                const [r, g, b] = Centrality.HSVtoRGB(h, 1, 1);
                vertices[i].setColour(r, g, b);
            }
        }
    }

    private get_max_min(vertices: Vertex[]): [max: number, min: number] {
        let [max, min] = [0, 999999999];

        for (let i = 0; i < vertices.length; ++i) {
            if (this.vals[i] > max) max = this.vals[i];
            if (this.vals[i] < min) min = this.vals[i];
        }

        return [max, min];
    }

    private build_tree(graph: Graph): void {
        const adj_matrix = graph.getAdjacencyMatrix();
        this.tree = [];

        for (let i = 0; i < adj_matrix.length; ++i) {
            const localTree = [];

            for (let j = 0; j < adj_matrix[i].length; ++j) {
                if (adj_matrix[i][j] === 1) {
                    localTree.push(j);
                }
            }

            this.tree.push(localTree);
        }
    }

    private breadth_first_search(vertices: Vertex[], v: number, u: number): void {
        const queue: number[] = [v];
        const links: [number, number][] = [];

        const visited = new Array(vertices.length).fill(0);
        visited[v] = 1;

        let [indx, i, found] = [1, v, false];

        while (!found) {
            found = this.bfs_adjacents(i, visited, queue, links, u);

            if (visited[queue[indx]] != 1 && !found) {
                visited[queue[indx]] = 1;
                i = queue[indx];
            }

            indx++;
        }

        this.mark_path_from_links(links, v, u);
    }

    private bfs_adjacents(i: number, visited: number[], queue: number[], links: [number, number][], u: number): boolean {
        for (let j = 0; j < this.tree[i].length; ++j) {
            const x = this.tree[i][j];

            if (visited[x] !== 1 && !queue.includes(x)) queue.push(x);

            links.push([i, x]);
            if (x === u) return true;
        }

        return false;
    }

    private mark_path_from_links(links: [number, number][], start: number, end: number): void {
        let look_for = end;
        this.vals[look_for]++;

        for (let i = links.length - 1; i > -1; --i) {
            let temp_look_for = 0;

            for (let j = i; j > -1; --j) {
                if (look_for === links[j][1]) {
                    temp_look_for = links[j][0];
                }
            }

            look_for = temp_look_for;
            this.vals[look_for]++;

            if (look_for === start) break;
        }
    }
}