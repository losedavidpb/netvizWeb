import { Centrality, CentralityType } from "../Centrality";
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
     * Creates a centrality algorithm based on its type.
     *
     * @param type type of the centrality algorithm
     * @returns new instance of a centrality algorithm
     */
    static create(type: CentralityType): Centrality {
        switch (type) {
            case CentralityType.Betweenness: {
                return new Betweenness();
            }

            case CentralityType.DegreeCentrality: {
                return new DegreeCentrality();
            }

            case CentralityType.DistanceCentrality: {
                return new DistanceCentrality();
            }

            default:
                throw new Error(
                    "InvalidCentrality :: Passed centrality is not supported"
                );
        }
    }
}