/**
 * Command :: Representation of a command
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export interface Command {
    /**
     * Execute the current command
     */
    execute(): void;
}