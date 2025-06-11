import { Algorithm } from "../Algorithm";
import type { Vertex } from "../Vertex";

/**
 * SimpleForceDirected :: Representation of a SimpleForceDirected algorithm
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
            this.check_duplications(vertices);
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private apply_forces(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            let v = vertices[i];

            v.setForce({ x: 0, y: 0, z: 0 });

            this.apply_repulsion(i, v, vertices);
            this.apply_attraction(i, v, vertices);
            this.apply_cooling(v);
        }
    }

    private update_positions(vertices: Vertex[]): void {
        for (let i = 0; i < vertices.length; ++i) {
            let v = vertices[i];

            v.setPos({
                x: v.getPos().x + v.getVelocity().x,
                y: v.getPos().y + v.getVelocity().y
            });
        }
    }

    private apply_repulsion(i: number, v: Vertex, vertices: Vertex[]): void {
        let pos_v = v.getPos();

        for (let j = 0; j < vertices.length; ++j) {
            if (i == j) continue;

            let u = vertices[j];
            let pos_u = u.getPos();

            const rsq = .25 * (
                (pos_v.x - pos_u.x) * (pos_v.x - pos_u.x) +
                (pos_v.y - pos_u.y) * (pos_v.y - pos_u.y)
            );

            let forceV = v.getForce();

            v.setForce({
                x: forceV.x + 10 * ((pos_v.x - pos_u.x) / rsq),
                y: forceV.y + 10 * ((pos_v.y - pos_u.y) / rsq),
            });
        }
    }

    private apply_attraction(i: number, v: Vertex, vertices: Vertex[]): void {
        let adjacency_matrix = this.graph.getAdjacencyMatrix();
        let pos_v = v.getPos();

        for (let j = 0; j < vertices.length; ++j) {
            if (adjacency_matrix[i][j] === 1) {
                let u = vertices[j];
                let pos_u = u.getPos();

                let forceV = v.getForce();

                v.setForce({
                    x: forceV.x + 4 * (pos_u.x - pos_v.x),
                    y: forceV.y + 4 * (pos_u.y - pos_v.y)
                });
            }
        }
    }

    private apply_cooling(v: Vertex): void {
        v.setVelocity({
            x: (v.getVelocity().x + v.getForce().x) * 0.01,
            y: (v.getVelocity().y + v.getForce().y) * 0.01,
        });
    }

    private apply_placement(vertices: Vertex[]): void {
        for (let j = 0; j < vertices.length; ++j) {
            vertices[j].setPos({
                x: Math.random() * vertices.length - vertices.length / 2,
                y: Math.random() * vertices.length - vertices.length / 2,
                z: 0
            });
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