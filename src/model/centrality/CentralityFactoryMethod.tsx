import type { Centrality, CentralityType } from "../Centrality";
import { Betweenness } from "./Betweenness";
import { DegreeCentrality } from "./DegreeCentrality";
import { DistanceCentrality } from "./DistanceCentrality";

/**
 * CentralityFactoryMethod :: Factory method for centrality algorithms
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class CentralityFactoryMethod {
    /**
     * Create an centrality algorithm based on its type
     *
     * @param type type of algorithm
     * @returns algorithm
     */
    static createCentrality(type: CentralityType): Centrality {
        switch (type) {
            case 'Betweenness': return new Betweenness();
            case 'DegreeCentrality': return new DegreeCentrality();
            case 'DistanceCentrality': return new DistanceCentrality();
            default:
                throw new Error(
                    "InvalidCentrality :: Passed centrality is not supported"
                );
        }
    }
}