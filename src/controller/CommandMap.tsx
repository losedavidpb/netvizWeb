import type { Command } from "./Command";

/**
 * CommandMap :: Representation of a map of commands
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class CommandMap {

    // --------------------------------
    // Properties
    // --------------------------------

    private readonly commands: Record<string, Command> = {};

    /**
     * Gets the command with passed name.
     *
     * @param name name of the command
     * @returns command with the passed name
     */
    get(name: string): Command | null {
        return name in this.commands ? this.commands[name] : null;
    }

    /**
     * Includes the passed command to the map.
     *
     * @param name name of the command
     * @param command command to be added
     */
    add(name: string, command: Command): void {
        this.commands[name] ??= command;
    }

    /**
     * Executes the passed command
     *
     * @param name name of the command
     */
    execute(name: string): void {
        this.get(name)?.execute();
    }
}