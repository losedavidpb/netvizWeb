import { Algorithm } from "../Algorithm";
import type { Graph } from "../Graph";
import type { Vertex } from "../Vertex";

/**
 * FruchtermanReingold :: Representation of a FruchtermanReingold algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class FruchtermanReingold extends Algorithm {

    // --------------------------------
    // Properties
    // --------------------------------

    static readonly W: number = 128;
    static readonly L: number = 72;

    static readonly area = FruchtermanReingold.W * FruchtermanReingold.L;

    private k: number = 0;
    private t: number = 0;

    /**
     * Constructor for FruchtermanReingold
     *
     * @param graph graph to be used
     */
    constructor(graph: Graph) {
        super(graph);

        if (graph.getVertices().length !== 0) {
            this.t = this.graph.getVertices().length;
            this.k = Math.sqrt(FruchtermanReingold.area / this.t);

            this.place();
        }
    }

    apply(): void {
        const vertices = this.graph.getVertices();
        const edges = this.graph.getEdges();

        if (vertices.length !== 0 && edges.length !== 0) {
            this.apply_repulsion(vertices);
            this.apply_attraction(vertices, edges);
            this.apply_cooling(vertices);
        }
    }

    place(): void {
        const vertices = this.graph.getVertices();

        if (vertices.length !== 0) {
            this.apply_placement(vertices);
            this.check_duplications(vertices);
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private apply_repulsion(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            let v = vertices[i];
            let pos_v = v.getPos();

            v.setForce({ x: 0, y: 0 });

            for (let j = 0; j < vertices.length; ++j) {
                if (i == j) continue;

                let u = vertices[j];
                let pos_u = u.getPos();

                let xDist = (pos_v.x - pos_u.x);
                let yDist = (pos_v.y - pos_u.y);
                let dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

                /* v8 ignore next 1 */
                if (dist < 0.00000000002) dist = 0.00000000002;

                let repulsion = this.k * this.k / dist;
                let forceV = v.getForce();

                v.setForce({
                    x: forceV.x + xDist / dist * repulsion,
                    y: forceV.y + yDist / dist * repulsion
                });
            }
        }
    }

    private apply_attraction(vertices: Vertex[], edges: number[][]): void {
        for (let i = 0; i < edges.length; ++i) {
            let v = vertices[edges[i][0]];
            let pos_v = v.getPos();

            let u = vertices[edges[i][1]];
            let pos_u = u.getPos();

            let xDist = (pos_v.x - pos_u.x);
            let yDist = (pos_v.y - pos_u.y);
            let dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

            /* v8 ignore next 1 */
            if (dist < 0.00000000002) dist = 0.00000000002;

            let attraction = dist * dist / this.k;
            let forceV = v.getForce();
            let forceU = u.getForce();

            v.setForce({
                x: forceV.x - xDist / dist * attraction,
                y: forceV.y - yDist / dist * attraction
            });

            u.setForce({
                x: forceU.x + xDist / dist * attraction,
                y: forceU.y + yDist / dist * attraction
            });
        }
    }

    private apply_cooling(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            let v = vertices[i];
            let posV = v.getPos();

            v.setPos({
                x: posV.x + v.getForce().x * 0.0015,
                y: posV.y + v.getForce().y * 0.0015
            })
        }

        this.t *= .9;
    }

    private apply_placement(vertices: Vertex[]): void {
        const W: number = FruchtermanReingold.W;
        const L: number = FruchtermanReingold.L;

        for (let j = 0; j < vertices.length; ++j) {
            vertices[j].setPos({
                x: Math.random() * W - W / 2,
                y: Math.random() * L - L / 2,
                z: 0
            })
        }
    }

    /* v8 ignore next 13 */
    private check_duplications(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            let v_pos = vertices[i].getPos();

            for (let j = 0; j < vertices.length; ++j) {
                let u_pos = vertices[j].getPos();

                if (v_pos.x === u_pos.x && i != j && v_pos.y === u_pos.y) {
                    console.log(`Warning: duplicate positions generated @ ${i}\n`);
                }
            }
        }
    }
}