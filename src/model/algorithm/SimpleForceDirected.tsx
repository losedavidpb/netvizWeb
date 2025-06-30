import { Algorithm } from "../Algorithm";
import type { Vertex } from "../Vertex";

/**
 * SimpleForceDirected :: SimpleForceDirected algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class SimpleForceDirected extends Algorithm {

    apply(): void {
        const vertices = this.graph.getVertices();

        if (vertices.length !== 0) {
            this.apply_forces(vertices);
            this.update_positions(vertices);
        }
    }

    place(): void {
        const vertices = this.graph.getVertices();

        if (vertices.length !== 0) {
            this.apply_placement(vertices);
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private apply_forces(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            const v = vertices[i];

            v.setForce({ x: 0, y: 0, z: 0 });

            this.apply_repulsion(i, v, vertices);
            this.apply_attraction(i, v, vertices);
            this.apply_cooling(v);
        }
    }

    private update_positions(vertices: Vertex[]): void {
        for (const v of vertices) {
            const pos = v.getPos();
            const velocity = v.getVelocity();

            v.setPos({
                x: pos.x + velocity.x,
                y: pos.y + velocity.y
            });
        }
    }

    private apply_repulsion(i: number, v: Vertex, vertices: Vertex[]): void {
        const pos_v = v.getPos();

        for (let j = 0; j < vertices.length; ++j) {
            if (i == j) continue;

            const u = vertices[j];
            const pos_u = u.getPos();

            const rsq = .25 * (
                (pos_v.x - pos_u.x) * (pos_v.x - pos_u.x) +
                (pos_v.y - pos_u.y) * (pos_v.y - pos_u.y)
            );

            const force_v = v.getForce();

            v.setForce({
                x: force_v.x + 10 * ((pos_v.x - pos_u.x) / rsq),
                y: force_v.y + 10 * ((pos_v.y - pos_u.y) / rsq),
            });
        }
    }

    private apply_attraction(i: number, v: Vertex, vertices: Vertex[]): void {
        const adjacency_matrix = this.graph.getAdjacencyMatrix();
        const pos_v = v.getPos();

        for (let j = 0; j < vertices.length; ++j) {
            if (adjacency_matrix[i][j] === 1) {
                const u = vertices[j];
                const pos_u = u.getPos();

                const force_v = v.getForce();

                v.setForce({
                    x: force_v.x + 4 * (pos_u.x - pos_v.x),
                    y: force_v.y + 4 * (pos_u.y - pos_v.y)
                });
            }
        }
    }

    private apply_cooling(v: Vertex): void {
        const velocity = v.getVelocity();
        const force = v.getForce();

        v.setVelocity({
            x: (velocity.x + force.x) * 0.01,
            y: (velocity.y + force.y) * 0.01,
        });
    }

    private apply_placement(vertices: Vertex[]): void {
        const crypto = window.crypto || (window as any).msCrypto;
        const buf = new Uint32Array(2);

        for (const v of vertices) {
            crypto.getRandomValues(buf);

            const randX = buf[0] / (0xFFFFFFFF + 1);
            const randY = buf[1] / (0xFFFFFFFF + 1);

            v.setPos({
                x: randX * vertices.length - vertices.length / 2,
                y: randY * vertices.length - vertices.length / 2,
                z: 0
            });
        }
    }
}