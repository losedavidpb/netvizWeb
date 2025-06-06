/**
 * Matrix Market I/O library taken from the C-version of the Mathematical and Computational Sciences Division
 * of the Information Technology Laboratory of the National Institute of Standards and Technology.
 *
 * See http://math.nist.gov/MatrixMarket for details.
 */

import * as fs from 'fs';

export const MM_MAX_LINE_LENGTH = 1025;
export const MatrixMarketBanner = "%%MatrixMarket";
export const MM_MAX_TOKEN_LENGTH = 64;

export type MM_typecode = [string, string, string, string];

export function mm_typecode_to_str(matcode: MM_typecode): string | null {
    let types: MM_typecode = ['', '', '', ''];

    /* fin for MTX type */

    if (mm_is_matrix(matcode)) types[0] = MM_MTX_STR;
    else return null;

    /* fin for CRD or ARR matrix */

    if (mm_is_sparse(matcode)) types[1] = MM_SPARSE_STR;
    else if (mm_is_dense(matcode)) types[1] = MM_DENSE_STR;
    else return null;

    /* fin for element data type */

    if (mm_is_real(matcode)) types[2] = MM_REAL_STR;
    else if (mm_is_complex(matcode)) types[2] = MM_COMPLEX_STR;
    else if (mm_is_pattern(matcode)) types[2] = MM_PATTERN_STR;
    else if (mm_is_integer(matcode)) types[2] = MM_INT_STR;
    else return null;

    /* fin for symmetry type */

    if (mm_is_general(matcode)) types[3] = MM_GENERAL_STR;
    else if (mm_is_symmetric(matcode)) types[3] = MM_SYMM_STR;
    else if (mm_is_hermitian(matcode)) types[3] = MM_HERM_STR;
    else if (mm_is_skew(matcode)) types[3] = MM_SKEW_STR;
    else return null;

    return types[0] + " " + types[1] + " " + types[2] + " " + types[3];
}

export function mm_read_banner(lines: string[]): [ matcode: MM_typecode, num_line: number ] | number {
    let matcode : MM_typecode = ['', '', '', ''];

    mm_clear_typecode(matcode);

    const tokens = lines[0].trim().split(/\s+/);
    if (tokens.length !== 5) return MM_PREMATURE_EOF;

    let [banner, mtx, crd, data_type, storage_scheme] = tokens;

    /* fin for banner */

    if (!banner.startsWith(MatrixMarketBanner)) return MM_NO_HEADER;

    mtx = mtx.toLowerCase();
    crd = crd.toLowerCase();
    data_type = data_type.toLowerCase();
    storage_scheme = storage_scheme.toLowerCase();

    /* first field should be "mtx" */

    if (mtx !== MM_MTX_STR) return MM_UNSUPPORTED_TYPE;
    mm_set_matrix(matcode);

    /* second field describes whether this is a sparse matrix (in coordinate
            storgae) or a dense array */

    if (crd === MM_SPARSE_STR) mm_set_sparse(matcode);
    else if (crd === MM_DENSE_STR) mm_set_dense(matcode);
    else return MM_UNSUPPORTED_TYPE;

    /* third field */

    if (data_type === MM_REAL_STR) mm_set_real(matcode);
    else if (data_type === MM_COMPLEX_STR) mm_set_complex(matcode);
    else if (data_type === MM_PATTERN_STR) mm_set_pattern(matcode);
    else if (data_type === MM_INT_STR) mm_set_integer(matcode);
    else return MM_UNSUPPORTED_TYPE;

    /* fourth field */

    if (storage_scheme === MM_GENERAL_STR) mm_set_general(matcode);
    else if (storage_scheme === MM_SYMM_STR) mm_set_symmetric(matcode);
    else if (storage_scheme === MM_HERM_STR) mm_set_hermitian(matcode);
    else if (storage_scheme === MM_SKEW_STR) mm_set_skew(matcode);
    else return MM_UNSUPPORTED_TYPE;

    return [matcode, 1];
}

export function mm_read_mtx_crd_size(lines: string[], num_line: number): [M: number, N: number, nz: number, num_line: number] | number {
    let line = '';

    /* set return null parameter values, in case we exit with errors */

    let M = 0; let N = 0; let nz = 0;

    /* now continue scanning until you reach the end-of-comments */

    do {
        line = lines[num_line++]
        if (num_line >= lines.length) return MM_PREMATURE_EOF;
    } while (line?.startsWith('%'));

    let ret = mm_read_m_n_nz(line);

    if (ret !== null) {
        [M, N, nz] = ret;
        return [M, N, nz, num_line];
    }

    else {
        while (true) {
            line = lines[num_line++]
            if (num_line >= lines.length) return MM_PREMATURE_EOF;

            ret = mm_read_m_n_nz(line.trim());

            if (ret !== null) {
                [M, N, nz] = ret;
                return [M, N, nz, num_line];
            }
        }
    }
}

export function mm_read_mtx_array_size(lines: string[], num_line: number): [M: number, N: number, num_line: number] | number {
    let line = '';

    /* set return null parameter values, in case we exit with errors */

    let M = 0; let N = 0;

    /* now continue scanning until you reach the end-of-comments */

    do {
        const raw = lines[num_line++];
        if (raw === null) return MM_PREMATURE_EOF;

        line = raw.trim();
    } while (line?.startsWith('%'));

    /* line[] is either blank or has M,N, nz */

    let ret = mm_read_m_n(line);

    if (ret !== null) {
        [M, N] = ret;
        return [M, N, num_line];
    }

    /* we have a blank line */

    else {
        while (true) {
            const raw = lines[num_line++];
            if (raw === null) return MM_PREMATURE_EOF;

            ret = mm_read_m_n(raw.trim());

            if (ret !== null) {
                [M, N] = ret;
                return [M, N, num_line];
            }
        }
    }
}

export function mm_write_banner(matcode: MM_typecode, filePath?: string): number {
    const str = mm_typecode_to_str(matcode);
    const line = `${MatrixMarketBanner} ${str}`;

    try {
        if (filePath === undefined) {
            console.log(line);
        } else {
            fs.writeFileSync(filePath, line, { encoding: "utf8", flag: "a+" });
        }

        return 0;
    } catch {
        return MM_COULD_NOT_WRITE_FILE;
    }
}

export function mm_write_mtx_crd_size(M: number, N: number, nz: number, filePath?: string): number {
    const line = `${M} ${N} ${nz}`;

    try {
        if (filePath === undefined) {
            console.log(line);
        } else {
            fs.writeFileSync(filePath, line, { encoding: "utf8", flag: "a+" });
        }

        return 0;
    } catch {
        return MM_COULD_NOT_WRITE_FILE;
    }
}

export function mm_write_mtx_array_size(M: number, N: number, filePath?: string): number {
    const line = `${M} ${N}`;

    try {
        if (filePath === undefined) {
            console.log(line);
        } else {
            fs.writeFileSync(filePath, line, { encoding: "utf8", flag: "a+" });
        }

        return 0;
    } catch {
        return MM_COULD_NOT_WRITE_FILE;
    }
}

/********************* MM_typecode query fucntions ***************************/

export const mm_is_matrix = (t: MM_typecode) => t[0] === 'M';
export const mm_is_sparse = (t: MM_typecode) => t[1] === 'C';
export const mm_is_coordinate = (t: MM_typecode) => t[1] === 'C';
export const mm_is_dense = (t: MM_typecode) => t[1] === 'A';
export const mm_is_array = (t: MM_typecode) => t[1] === 'A';
export const mm_is_complex = (t: MM_typecode) => t[2] === 'C';
export const mm_is_real = (t: MM_typecode) => t[2] === 'R';
export const mm_is_pattern = (t: MM_typecode) => t[2] === 'P';
export const mm_is_integer = (t: MM_typecode) => t[2] === 'I';
export const mm_is_symmetric = (t: MM_typecode) => t[3] === 'S';
export const mm_is_general = (t: MM_typecode) => t[3] === 'G';
export const mm_is_skew = (t: MM_typecode) => t[3] === 'K';
export const mm_is_hermitian = (t: MM_typecode) => t[3] === 'H';

export function mm_is_valid(matcode: MM_typecode): boolean {
    if (!mm_is_matrix(matcode)) return false;
    if (mm_is_dense(matcode) && mm_is_pattern(matcode)) return false;
    if (mm_is_real(matcode) && mm_is_hermitian(matcode)) return false;
    if (mm_is_pattern(matcode) && (mm_is_hermitian(matcode) || mm_is_skew(matcode))) return false;

    return true;
}

/********************* MM_typecode modify fucntions ***************************/

export const mm_set_matrix = (t: MM_typecode) => t[0] = 'M';
export const mm_set_coordinate = (t: MM_typecode) => t[1] = 'C';
export const mm_set_array = (t: MM_typecode) => t[1] = 'A';
export const mm_set_dense = mm_set_array;
export const mm_set_sparse = mm_set_coordinate;

export const mm_set_complex = (t: MM_typecode) => t[2] = 'C';
export const mm_set_real = (t: MM_typecode) => t[2] = 'R';
export const mm_set_pattern = (t: MM_typecode) => t[2] = 'P';
export const mm_set_integer = (t: MM_typecode) => t[2] = 'I';

export const mm_set_symmetric = (t: MM_typecode) => t[3] = 'S';
export const mm_set_general = (t: MM_typecode) => t[3] = 'G';
export const mm_set_skew = (t: MM_typecode) => t[3] = 'K';
export const mm_set_hermitian = (t: MM_typecode) => t[3] = 'H';

export const mm_clear_typecode = (t: MM_typecode) => { t[0] = ' '; t[1] = ' '; t[2] = ' '; t[3] = 'G'; };
export const mm_initialize_typecode = mm_clear_typecode;

/********************* Matrix Market error codes ***************************/

export const MM_COULD_NOT_READ_FILE = 11;
export const MM_PREMATURE_EOF = 12;
export const MM_NOT_MTX = 13;
export const MM_NO_HEADER = 14;
export const MM_UNSUPPORTED_TYPE = 15;
export const MM_LINE_TOO_LONG = 16;
export const MM_COULD_NOT_WRITE_FILE = 17;

/******************** Matrix Market internal definitions ********************

   MM_matrix_typecode: 4-character sequence

                    ojbect 		sparse/   	data        storage
                                    dense     	type        scheme

   string position:	 [0]        [1]			[2]         [3]

   Matrix typecode:  M(atrix)  C(oord)		R(eal)   	G(eneral)
                                A(array)	C(omplex)   H(ermitian)
                                            P(attern)   S(ymmetric)
                                            I(nteger)	K(kew)

 ***********************************************************************/

export const MM_MTX_STR = "matrix";
export const MM_ARRAY_STR = "array";
export const MM_DENSE_STR = "array";
export const MM_COORDINATE_STR = "coordinate";
export const MM_SPARSE_STR = "coordinate";
export const MM_COMPLEX_STR = "complex";
export const MM_REAL_STR = "real";
export const MM_INT_STR = "integer";
export const MM_GENERAL_STR = "general";
export const MM_SYMM_STR = "symmetric";
export const MM_HERM_STR = "hermitian";
export const MM_SKEW_STR = "skew-symmetric";
export const MM_PATTERN_STR = "pattern";

/*  high level routines */

export function mm_write_mtx_crd(
    fname: string, M: number, N: number, nz: number,
    I: number[], J: number[], val: number[], matcode: MM_typecode
): number {

    const typecode = mm_typecode_to_str(matcode);

    try {
        /* print banner followed by typecode */

        fs.writeFileSync(fname, `${MatrixMarketBanner}`, { encoding: "utf8", flag: "a+" });
        fs.writeFileSync(fname, `${typecode}\n`, { encoding: "utf8", flag: "a+" });

        /* print matrix sizes and nonzeros */

        fs.writeFileSync(fname, `${M} ${N} ${nz}\n`, { encoding: "utf8", flag: "a+" });

        /* print values */

        if (mm_is_pattern(matcode)) {
            for (let i = 0; i < nz; i++) {
                fs.writeFileSync(fname, `${I[i]} ${J[i]}\n`, { encoding: "utf8", flag: "a+" });
            }
        } else if (mm_is_real(matcode)) {
            for (let i = 0; i < nz; i++) {
                let val_i = val[i].toPrecision(20);

                fs.writeFileSync(fname, `${I[i]} ${J[i]} ${val_i}\n`, { encoding: "utf8", flag: "a+" });
            }
        } else if (mm_is_complex(matcode)) {
            for (let i = 0; i < nz; i++) {
                let val_i1 = val[2 * i].toPrecision(20);
                let val_i2 = val[2 * i + 1].toPrecision(20);

                fs.writeFileSync(fname, `${I[i]} ${J[i]} ${val_i1} ${val_i2}\n`, { encoding: "utf8", flag: "a+" });
            }
        } else {
            return MM_UNSUPPORTED_TYPE;
        }

        return 0;
    } catch {
        return MM_COULD_NOT_WRITE_FILE;
    }
}

/*-------------------------------------------------------------------------*/

/******************************************************************/
/* use when I[], J[], and val[]J, and val[] are already allocated */
/******************************************************************/

export function mm_read_mtx_crd_data(
    lines: string[], num_line: number, nz: number, I: number[], J: number[],
    val: number[], matcode: MM_typecode
): [I: number[], J: number[], val: number[], num_line: number] | number {

    let line: string | null = '';

    if (mm_is_complex(matcode)) {
        for (let i = 0; i < nz; i++) {
            line = lines[num_line++];

            if (line != null) {
                const tokens = line.trim().split(/\s+/);

                if (tokens.length !== 4) return MM_PREMATURE_EOF;

                I[i] = parseInt(tokens[0], 10);
                J[i] = parseInt(tokens[1], 10);
                val[2 * i] = parseFloat(tokens[2]);
                val[2 * i + 1] = parseFloat(tokens[3]);
            }
        }
    } else if (mm_is_real(matcode)) {
        for (let i = 0; i < nz; i++) {
            const tokens = line.trim().split(/\s+/);

            if (line != null) {
                if (tokens.length !== 3) return MM_PREMATURE_EOF;

                I[i] = parseInt(tokens[0], 10);
                J[i] = parseInt(tokens[1], 10);
                val[i] = parseFloat(tokens[2]);
            }
        }
    } else if (mm_is_pattern(matcode)) {
        for (let i = 0; i < nz; i++) {
            const tokens = line.trim().split(/\s+/);

            if (line != null) {
                if (tokens.length !== 2) return MM_PREMATURE_EOF;

                I[i] = parseInt(tokens[0], 10);
                J[i] = parseInt(tokens[1], 10);
            }
        }
    } else {
        return MM_UNSUPPORTED_TYPE;
    }

    return [I, J, val, num_line];
}

/************************************************************************
    mm_read_mtx_crd()  fills M, N, nz, array of values, and return
                        type code, e.g. 'MCRS'

                        if matrix is complex, values[] is of size 2*nz,
                            (nz pairs of real/imaginary values)
************************************************************************/

export function mm_read_mtx_crd_entry(
    lines: string[], num_line: number, matcode: MM_typecode
): [I: number, J: number, real: number, imag: number, num_line: number] | number {

    let line: string | null = '';

    let I = 0; let J = 0;
    let real = 0; let imag = 0;

    if (mm_is_complex(matcode)) {
        line = lines[num_line++];

        if (line != null) {
            const tokens = line.trim().split(/\s+/);

            if (tokens.length !== 4) return MM_PREMATURE_EOF;

            I = parseInt(tokens[0], 10);
            J = parseInt(tokens[1], 10);
            real = parseFloat(tokens[2]);
            imag = parseFloat(tokens[3]);
        }
    } else if (mm_is_real(matcode)) {
        line = lines[num_line++];

        if (line != null) {
            const tokens = line.trim().split(/\s+/);

            if (tokens.length !== 3) return MM_PREMATURE_EOF;

            I = parseInt(tokens[0], 10);
            J = parseInt(tokens[1], 10);
            real = parseFloat(tokens[2]);
        }
    } else if (mm_is_pattern(matcode)) {
        line = lines[num_line++];

        if (line != null) {
            const tokens = line.trim().split(/\s+/);

            if (tokens.length !== 2) return MM_PREMATURE_EOF;

            I = parseInt(tokens[0], 10);
            J = parseInt(tokens[1], 10);
        }
    } else {
        return MM_UNSUPPORTED_TYPE;
    }

    return [I, J, real, imag, num_line];
}

export function mm_read_unsymmetric_sparse(fname: string, lines: string[]
): [M: number, N: number, nz: number, I: number[], J: number[], val: number[], num_line: number] | number {

    let line: string | null = '';

    try {
        let ret_matcode = mm_read_banner(lines);

        if (typeof ret_matcode === 'number') {
            console.log("mm_read_unsymetric: Could not process Matrix Market banner ");
            console.log(" in file [%s]\n", fname);
            return -1;
        }

        let [matcode, num_line] = ret_matcode;

        if (!(mm_is_real(matcode) && mm_is_matrix(matcode) && mm_is_sparse(matcode))) {
            console.log("Sorry, this application does not support ");
            console.log("Market Market type: [%s]\n", mm_typecode_to_str(matcode));
            return -1;
        }

        /* find out size of sparse matrix: M, N, nz .... */

        let ret = mm_read_mtx_crd_size(lines, num_line);

        if (typeof ret === 'number') {
            console.log("read_unsymmetric_sparse(): could not parse matrix size.\n");
            return -1;
        }

        let [M, N, nz] = [0, 0, 0];
        [M, N, nz, num_line] = ret;

        /* reseve memory for matrices */

        let val = [];
        let I = [];
        let J = [];

        /* NOTE: when reading in doubles, ANSI C requires the use of the "l"  */
        /*   specifier as in "%lg", "%lf", "%le", otherwise errors will occur */
        /*  (ANSI C X3.159-1989, Sec. 4.9.6.2, p. 136 edges 13-15)            */

        for (let i = 0; i < nz; i++) {
            line = lines[num_line++];

            if (line != null) {
                const tokens = line.trim().split(/\s+/);

                I.push(parseInt(tokens[0], 10));
                J.push(parseInt(tokens[1], 10));
                val.push(parseFloat(tokens[3]));

                I[i]--;
                J[i]--;
            }
        }

        return [M, N, nz, I, J, val, num_line];
    } catch {
        return MM_COULD_NOT_READ_FILE;
    }
}

// --------------------------------
// Private
// --------------------------------

// Read the M, N, nz of a file
function mm_read_m_n_nz(raw: string): [M: number, N: number, nz: number] | null {
    let parts = raw.trim().split(/\s+/);

    if (parts.length === 3) {
        let M = parseInt(parts[0], 10);
        let N = parseInt(parts[1], 10);
        let nz = parseInt(parts[2], 10);

        if (![M, N, nz].some(isNaN)) {
            return [M, N, nz];
        }
    }

    return null;
}

// Read the M, N of a file
function mm_read_m_n(raw: string): [M: number, N: number] | null {
    const parts = raw.split(/\s+/);

    if (parts.length === 2) {
        let M = parseInt(parts[0], 10);
        let N = parseInt(parts[1], 10);

        if (![M, N].some(isNaN)) {
            return [M, N];
        }
    }

    return null;
}