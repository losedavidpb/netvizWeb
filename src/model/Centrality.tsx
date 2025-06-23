import type { Graph } from './Graph';

/**
 * Available centrality types
 */
export const CentralityType = {
    Betweenness: "Betweenness",
    DegreeCentrality: "DegreeCentrality",
    DistanceCentrality: "DistanceCentrality"
} as const;

// Derive a union type from the values
export type CentralityType = typeof CentralityType[keyof typeof CentralityType];

/**
 * Centrality :: Representation of a centrality algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export abstract class Centrality {
    /**
     * Apply the centrality algorithm
     */
    abstract apply(graph: Graph): void;

    /**
     * Convert HSV to RGB
     *
     * @param h H-component (hue)
     * @param s S-component (saturation)
     * @param v V-component (value)
     * @returns
     */
    protected static HSVtoRGB(h: number, s: number, v: number): [r: number, g: number, b: number] {
        if (!(this.in_range(h, 0, 360) && this.in_range(s, 0, 1) && this.in_range(v, 0, 1))) {
            throw new Error("InvalidHSV :: Color values are not valid");
        }

        let [r, g, b] = [v, v, v];

        if (s !== 0) {
            h /= 60;

            const i = Math.floor(h);
            const f = h - i;
            const p = v * (1 - s);
            const q = v * (1 - s * f);
            const t = v * (1 - s * (1 - f));

            switch (i) {
                case 0: r = v; g = t; b = p;  break;
                case 1: r = q; g = v; b = p;  break;
                case 2: r = p; g = v; b = t;  break;
                case 3: r = p; g = q; b = v;  break;
                case 4: r = t; g = p; b = v;  break;
                default: r = v; g = p; b = q; break;
            }
        }

        return [r, g, b];
    }

    /**
     * Normalize the value between the given min and max range
     *
     * @param x value to be normalized
     * @param max maximum value
     * @param min minimum value
     * @returns normalized value
     */
    protected static normalize(x: number, max: number, min: number): number {
        if (max < min) {
            throw new Error("InvalidMaxMin :: Maximum value is less than the minimum value");
        }

        return (x - min) / (max - min);
    }

    // --------------------------------
    // Private
    // --------------------------------

    private static in_range(x: number, min: number, max: number): boolean {
        return x >= min && x <= max;
    }
}