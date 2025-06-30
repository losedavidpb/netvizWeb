/**
 * Command :: Representation of a command
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export interface Command {
    /**
     * Executes the current command
     */
    execute(): void;
}