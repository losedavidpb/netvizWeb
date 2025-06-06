import * as fs from 'fs';

import { Graph } from "../Graph";
import * as mmio from './mmio';
import { Vertex } from '../Vertex';

/**
 * MatrixMarket :: Representation of an MatrixMarket graph
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class MatrixMarketGraph extends Graph {
    protected read(filePath: string): void {
        const content = fs.readFileSync(filePath, 'utf-8').trim();
        const lines = content.split(/\r?\n/);

        let ret_matcode = mmio.mm_read_banner(lines);

        /* v8 ignore next 5 */
        if (typeof ret_matcode === 'number') {
            throw new Error(
                "MatrixMarket :: Could not process Matrix Market banner."
            );
        }

        let [matcode, num_line] = ret_matcode;

        if (!mmio.mm_is_coordinate(matcode) || !mmio.mm_is_pattern(matcode) || !mmio.mm_is_symmetric(matcode)) {
            let coord_str = mmio.MM_COORDINATE_STR;
            let pattrn_str = mmio.MM_PATTERN_STR;
            let symm_str = mmio.MM_SYMM_STR;

            throw new Error(
                "MatrixMarket :: Sorry, this application only supports graphs that are:\n" +
                "\tMatrix Market type: [" + coord_str + "][" + pattrn_str + "][" + symm_str + "]\n" +
                "\tand not: [" + mmio.MM_INT_STR + "]\n"
            );
        }

        let ret_crd_size = mmio.mm_read_mtx_crd_size(lines, num_line);

        /* v8 ignore next 5 */
        if (typeof ret_crd_size === 'number') {
            throw new Error(
                "MatrixMarket :: Could not process Matrix Market size."
            );
        }

        let [rows, cols, edgs] = [0, 0, 0];
        [rows, cols, edgs, num_line] = ret_crd_size;

        let I = new Array(edgs).fill(0);
        let J = new Array(edgs).fill(0);

        for (let i = 0; i < edgs; i++) {
            let line = lines[num_line++];

            if (line != null) {
                const tokens = line.trim().split(/\s+/);

                I[i] = parseInt(tokens[0], 10);
                J[i] = parseInt(tokens[1], 10);

                I[i]--;
                J[i]--;
            }
        }

        for (let i = 0; i < rows; ++i) {
            this.vertices.push(new Vertex(0, 0, 0));
            this.adjacencyMatrix.push([]);

            for (let j = 0; j < rows; ++j) {
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
            for (let j = i; j < rows; ++j) {
                if (this.adjacencyMatrix[i][j] == 1) {
                    this.edgeList.push([i, j]);
                }
            }
        }
    }
}