import { Config } from "../../Config";
import { Algorithm } from "../Algorithm";
import { Graph } from "../Graph";
import { Vertex } from "../Vertex";

/**
 * MultiForce :: MultiForce algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class MultiForce extends Algorithm {

    // --------------------------------
    // Static
    // --------------------------------

    // Width of the layout
    static readonly W: number = 80;

    // Height or longitude of the layout
    static readonly L: number = 45;

    // Calculated area of the layout
    static readonly area = MultiForce.W * MultiForce.L;

    // --------------------------------
    // Properties
    // --------------------------------

    private k: number = 0;
    private t: number = 0;

    private visitedVertices: number[] = [];
    private edgeIndex: number = 0;

    /**
     * Constructor for MultiForce
     *
     * @param graph graph to be used
     */
    constructor(graph: Graph) {
        super(graph);

        if (graph.getNumVertices() !== 0) {
            this.t = graph.getNumVertices();
            this.k = Math.sqrt(MultiForce.area / this.t);

            this.placement();
        }
    }

    apply(): void {
        const vertices = this.graph.getVertices();
        const edges = this.graph.getEdges();

        if (vertices.length !== 0 && edges.length !== 0) {
            if (this.edgeIndex < edges.length) {
                let energy = 999999999;
                this.place();

                while (energy > (10 + this.visitedVertices.length * 0.1)) {
                    energy = 0;

                    this.apply_repulsion(vertices, this.visitedVertices.length, this.visitedVertices);
                    this.apply_attraction(vertices, edges, this.edgeIndex);
                    energy = this.apply_cooling(vertices, this.visitedVertices, energy);
                }
            } else {
                this.apply_repulsion(vertices, vertices.length);
                this.apply_attraction(vertices, edges, edges.length);
                this.apply_cooling(vertices);
            }
        }
    }

    place(): void {
        const vertices = this.graph.getVertices();
        const edges = this.graph.getEdges();

        if (vertices.length !== 0 && edges.length !== 0 && this.edgeIndex < edges.length) {
            const v = edges[this.edgeIndex][0];
            const connectedEdges = this.get_connected_edges(edges, v);
            const connectedNodes = this.get_connected_nodes(edges, v);

            this.apply_placement(vertices, v, connectedNodes, connectedEdges);
            this.update_visited_vertices(connectedNodes);
        }
    }

    placement(): void {
        const vertices = this.graph.getVertices();

        for (let j = 0; j < vertices.length; ++j) {
            vertices[j].setPos({ x: 1, y: 1, z: 0 });
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private apply_repulsion(vertices: Vertex[], num_vertices: number, visited_vertices?: number[]): void {
        for (let i = 0; i < num_vertices; ++i) {
            const v = vertices[visited_vertices !== undefined ? visited_vertices[i] : i];
            const pos_v = v.getPos();

            v.setForce({ x: 0, y: 0 });

            for (let j = 0; j < num_vertices; ++j) {
                if (i == j) continue;

                const u = vertices[visited_vertices !== undefined ? visited_vertices[j] : j];
                const pos_u = u.getPos();

                const xDist = (pos_v.x - pos_u.x);
                const yDist = (pos_v.y - pos_u.y);
                let dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

                if (dist < 0.00000000002 || isNaN(dist)) dist = 0.00000000002;

                const repulsion = this.k * this.k / dist;
                const forceV = v.getForce();

                v.setForce({
                    x: forceV.x + (xDist / dist * repulsion),
                    y: forceV.y + (yDist / dist * repulsion)
                });
            }
        }
    }

    private apply_attraction(vertices: Vertex[], edges: number[][], edgeIndex: number): void {
        for (let i = 0; i < edgeIndex; ++i) {
            const v = vertices[edges[i][0]];
            const pos_v = v.getPos();

            const u = vertices[edges[i][1]];
            const pos_u = u.getPos();

            const xDist = (pos_v.x - pos_u.x);
            const yDist = (pos_v.y - pos_u.y);
            let dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

            if (dist < 0.00000000002 || isNaN(dist)) dist = 0.00000000002;

            const attraction = dist * dist / this.k;
            const forceV = v.getForce();
            const forceU = u.getForce();

            v.setForce({
                x: forceV.x - xDist / dist * attraction,
                y: forceV.y - yDist / dist * attraction
            });

            u.setForce({
                x: forceU.x + (xDist / dist * attraction),
                y: forceU.y + (yDist / dist * attraction)
            });
        }
    }

    private apply_cooling(vertices: Vertex[], visited_vertices?: number[], energy?: number): number {
        const num_vertices = visited_vertices !== undefined ? visited_vertices.length : vertices.length;

        for (let i = 0; i < num_vertices; ++i) {
            const v = vertices[visited_vertices !== undefined ? visited_vertices[i] : i];
            const pos_v = v.getPos();

            v.setPos({
                x: pos_v.x + v.getForce().x * 0.0015,
                y: pos_v.y + v.getForce().y * 0.0015,
            });

            if (energy !== undefined && (v.getForce().x + v.getForce().y) > energy) {
                energy = v.getForce().x + v.getForce().y;
            }
        }

        return energy ? energy : 0;
    }

    private get_connected_edges(edges: number[][], v: number): number {
        let connected_edges = 1;

        const is_connected_edge = () => {
            const indx = this.edgeIndex + connected_edges;
            return indx < edges.length && edges[indx][0] === v;
        }

        while (is_connected_edge()) connected_edges++;
        return connected_edges;
    }

    private get_connected_nodes(edges: number[][], v: number): number[] {
        const connectedNodes = [];

        for (const [base, connect] of edges) {
            if (base === v) {
                connectedNodes.push(connect);
            } else if (connect === v) {
                connectedNodes.push(base);
            }
        }

        return connectedNodes;
    }

    private apply_placement(vertices: Vertex[], v: number, connectedNodes: number[], connectedEdges: number): void {
        vertices[v].setPos({ z: 0 });

        for (let i = 0; i < connectedEdges; ++i) {
            const vertex_a = vertices[connectedNodes[i]];
            const aux = (2 * Math.PI * this.edgeIndex) / connectedNodes.length;

            vertex_a.setPos({
                x: vertex_a.getPos().x + Math.cos(aux) * Config.radius,
                y: vertex_a.getPos().y + Math.sin(aux) * Config.radius,
                z: 0
            });

            this.edgeIndex++;
        }
    }

    private update_visited_vertices(connectedNodes: number[]): void {
        for (let i = 0; i < connectedNodes.length; ++i) {
            if (!this.is_visited(connectedNodes[i])) {
                this.visitedVertices.push(connectedNodes[i]);
            }
        }
    }

    private is_visited(connectedNode: number): boolean {
        for (let j = 0; j < this.visitedVertices.length; ++j) {
            if (connectedNode === this.visitedVertices[j]) {
                return true;
            }
        }

        return false;
    }
}