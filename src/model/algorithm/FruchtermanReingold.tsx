import * as THREE from 'three';

import { Algorithm } from "../Algorithm";
import type { Graph } from "../Graph";
import type { Vertex } from "../Vertex";

/**
 * FruchtermanReingold :: FruchtermanReingold algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class FruchtermanReingold extends Algorithm {

    // --------------------------------
    // Static
    // --------------------------------

    // Width of the layout
    static readonly W: number = 128;

    // Height or longitude of the layout
    static readonly L: number = 72;

    // Layout to be used
    static readonly layout: THREE.Vector2 = new THREE.Vector2(FruchtermanReingold.W, FruchtermanReingold.L);

    // Calculated area of the layout
    static readonly area = FruchtermanReingold.W * FruchtermanReingold.L;

    // --------------------------------
    // Properties
    // --------------------------------

    private k: number = 0;
    private t: number = 0;

    /**
     * Constructor for FruchtermanReingold
     *
     * @param graph graph to be used
     */
    constructor(graph: Graph) {
        super(graph);

        if (this.graph.getNumVertices() !== 0) {
            this.t = this.graph.getNumVertices();
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
            const v = vertices[i];
            const pos_v = v.getPos();

            v.setForce({ x: 0, y: 0 });

            for (let j = 0; j < vertices.length; ++j) {
                if (i == j) continue;

                const u = vertices[j];
                const pos_u = u.getPos();

                const xDist = (pos_v.x - pos_u.x);
                const yDist = (pos_v.y - pos_u.y);
                let dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

                /* v8 ignore next 1 */
                if (dist < 0.00000000002) dist = 0.00000000002;

                const repulsion = this.k * this.k / dist;
                const force_v = v.getForce();

                v.setForce({
                    x: force_v.x + xDist / dist * repulsion,
                    y: force_v.y + yDist / dist * repulsion
                });
            }
        }
    }

    private apply_attraction(vertices: Vertex[], edges: number[][]): void {
        for (let i = 0; i < edges.length; ++i) {
            const v = vertices[edges[i][0]];
            const pos_v = v.getPos();

            const u = vertices[edges[i][1]];
            const pos_u = u.getPos();

            const xDist = (pos_v.x - pos_u.x);
            const yDist = (pos_v.y - pos_u.y);
            let dist = Math.sqrt((xDist * xDist) + (yDist * yDist));

            /* v8 ignore next 1 */
            if (dist < 0.00000000002) dist = 0.00000000002;

            const attraction = dist * dist / this.k;
            const force_v = v.getForce();
            const force_u = u.getForce();

            v.setForce({
                x: force_v.x - xDist / dist * attraction,
                y: force_v.y - yDist / dist * attraction
            });

            u.setForce({
                x: force_u.x + xDist / dist * attraction,
                y: force_u.y + yDist / dist * attraction
            });
        }
    }

    private apply_cooling(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            const v = vertices[i];
            const posV = v.getPos();

            v.setPos({
                x: posV.x + v.getForce().x * 0.0015,
                y: posV.y + v.getForce().y * 0.0015
            })
        }

        this.t *= .9;
    }

    private apply_placement(vertices: Vertex[]): void {
        const [W, L] = FruchtermanReingold.layout;

        for (let j = 0; j < vertices.length; ++j) {
            vertices[j].setPos({
                x: Math.random() * W - W / 2,
                y: Math.random() * L - L / 2,
                z: 0
            });
        }
    }

    /* v8 ignore next 13 */
    private check_duplications(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            const v_pos = vertices[i].getPos();

            for (let j = 0; j < vertices.length; ++j) {
                const u_pos = vertices[j].getPos();

                // TODO: Should I throw an error?
                if (v_pos.x === u_pos.x && i != j && v_pos.y === u_pos.y) {
                    console.log(`Warning: duplicate positions generated @ ${i}\n`);
                }
            }
        }
    }
}