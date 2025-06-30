/**
 * Matrix Market I/O library taken from the C-version of the Mathematical and Computational Sciences Division
 * of the Information Technology Laboratory of the National Institute of Standards and Technology.
 *
 * See http://math.nist.gov/MatrixMarket for details.
 */

export const MM_MAX_LINE_LENGTH = 1025;
export const MatrixMarketBanner = "%%MatrixMarket";
export const MM_MAX_TOKEN_LENGTH = 64;

export type MM_typecode = [string, string, string, string];
export type MM_dim = { M: number, N: number; }

export function mm_read_banner(lines: string[]): [ matcode: MM_typecode, num_line: number ] | number {
    const matcode : MM_typecode = ['', '', '', ''];

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

    const ret = define_type(mtx, crd, data_type, storage_scheme, matcode);
    if (ret) return ret;

    return [matcode, 1];
}

export function mm_read_mtx_crd_size(lines: string[], num_line: number): [dim: MM_dim, nz: number, num_line: number] | number {
    let line = '';

    /* set return null parameter values, in case we exit with errors */

    let dim: MM_dim;
    let nz: number;

    /* now continue scanning until you reach the end-of-comments */

    do {
        line = lines[num_line++]
        if (num_line >= lines.length) return MM_PREMATURE_EOF;
    } while (line?.startsWith('%'));

    let ret = mm_read_m_n_nz(line);

    if (ret !== null) {
        [dim, nz] = ret;
        return [dim, nz, num_line];
    }

    else {
        while (true) {
            line = lines[num_line++]
            if (num_line >= lines.length) return MM_PREMATURE_EOF;

            ret = mm_read_m_n_nz(line.trim());

            if (ret !== null) {
                [dim, nz] = ret;
                return [dim, nz, num_line];
            }
        }
    }
}

/********************* MM_typecode query fucntions ***************************/

export const mm_is_matrix = (t: MM_typecode) => t[0] === 'M';
export const mm_is_coordinate = (t: MM_typecode) => t[1] === 'C';
export const mm_is_pattern = (t: MM_typecode) => t[2] === 'P';
export const mm_is_symmetric = (t: MM_typecode) => t[3] === 'S';

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

// --------------------------------
// Private
// --------------------------------

function define_type(mtx: string, crd: string, data_type: string, storage_scheme: string, matcode: MM_typecode): void | number {
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
}

function mm_read_m_n_nz(raw: string): [dim: MM_dim, nz: number] | null {
    const parts = raw.trim().split(/\s+/);

    if (parts.length === 3) {
        const M = parseInt(parts[0], 10);
        const N = parseInt(parts[1], 10);
        const nz = parseInt(parts[2], 10);

        if (![M, N, nz].some(isNaN)) {
            return [{M, N}, nz];
        }
    }

    return null;
}