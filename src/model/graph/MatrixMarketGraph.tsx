import { Graph } from "../Graph";
import * as mmio from './mmio';
import { Vertex } from '../Vertex';

/**
 * MatrixMarket :: Graph based on the MatrixMarket format
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class MatrixMarketGraph extends Graph {

    protected read(content: string): void {
        if (content !== '') {
            const lines = content.split(/\r?\n/);
            const ret_matcode = mmio.mm_read_banner(lines);

            /* v8 ignore next 5 */
            if (typeof ret_matcode === 'number') {
                throw new Error(
                    "MatrixMarket :: Could not process Matrix Market banner."
                );
            }

            const [matcode, line] = ret_matcode;
            let num_line = line;

            if (!mmio.mm_is_coordinate(matcode) || !mmio.mm_is_pattern(matcode) || !mmio.mm_is_symmetric(matcode)) {
                throw new Error(
                    "MatrixMarket :: Sorry, this application only supports graphs that are:\n" +
                    "\tMatrix Market type: [" + mmio.MM_COORDINATE_STR + "][" + mmio.MM_PATTERN_STR + "][" + mmio.MM_SYMM_STR + "]\n" +
                    "\tand not: [" + mmio.MM_INT_STR + "]\n"
                );
            }

            const ret_crd_size = mmio.mm_read_mtx_crd_size(lines, num_line);

            /* v8 ignore next 5 */
            if (typeof ret_crd_size === 'number') {
                throw new Error(
                    "MatrixMarket :: Could not process Matrix Market size."
                );
            }

            let [rows, cols, edgs] = [0, 0, 0];
            [rows, cols, edgs, num_line] = ret_crd_size;

            const I = new Array(edgs).fill(0);
            const J = new Array(edgs).fill(0);

            for (let i = 0; i < edgs; i++) {
                const line = lines[num_line++];

                if (line != null) {
                    const tokens = line.trim().split(/\s+/);

                    I[i] = parseInt(tokens[0], 10) - 1;
                    J[i] = parseInt(tokens[1], 10) - 1;
                }
            }

            for (let i = 0; i < rows; ++i) {
                this.vertices.push(new Vertex(0, 0, 0));
                this.adjacencyMatrix.push([]);

                for (let j = 0; j < cols; ++j) {
                    this.adjacencyMatrix[i].push(0);
                }
            }

            for (let k = 0; k < edgs; ++k) {
                if (I[k] != J[k]) {
                    this.vertices[I[k]].attachPoint(this.vertices[J[k]]);

                    this.vertices[I[k]].updateDegree();
                    this.vertices[J[k]].updateDegree();

                    this.adjacencyMatrix[I[k]][J[k]] = 1;
                    this.adjacencyMatrix[J[k]][I[k]] = 1;
                }
            }

            this.edgeList = [];

            for (let i = 0; i < rows; ++i) {
                for (let j = i; j < cols; ++j) {
                    if (this.adjacencyMatrix[i][j] == 1) {
                        this.edgeList.push([i, j]);
                    }
                }
            }
        }
    }
}