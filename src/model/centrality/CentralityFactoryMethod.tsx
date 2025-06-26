import { Centrality, CentralityType } from "../Centrality";

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
    static async createCentrality(type: CentralityType): Promise<Centrality> {
        switch (type) {
            case CentralityType.Betweenness:
                const { Betweenness } = await import("./Betweenness");
                return new Betweenness();

            case CentralityType.DegreeCentrality:
                const { DegreeCentrality } = await import("./DegreeCentrality");
                return new DegreeCentrality();

            case CentralityType.DistanceCentrality:
                const { DistanceCentrality } = await import("./DistanceCentrality");
                return new DistanceCentrality();

            default:
                throw new Error(
                    "InvalidCentrality :: Passed centrality is not supported"
                );
        }
    }
}