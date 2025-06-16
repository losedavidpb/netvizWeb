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

    private commands: Record<string, Command> = {};

    /**
     * Get the command with passed name
     *
     * @param name name of the command
     * @returns command
     */
    get(name: string): Command {
        return this.commands[name];
    }

    /**
     * Add the passed command
     *
     * @param name name of the command
     * @param command command to be added
     */
    add(name: string, command: Command): void {
        if (this.commands[name] === undefined) {
            this.commands[name] = command;
        }
    }

    /**
     * Execute passed command
     *
     * @param name name of the command
     */
    execute(name: string): void {
        if (this.commands[name] !== undefined) {
            this.commands[name].execute();
        }
    }
}