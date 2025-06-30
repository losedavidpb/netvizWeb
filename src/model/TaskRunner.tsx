import { Config } from "../Config";

/**
 * TaskRunner :: Task runner that repeatedly executes a task
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class TaskRunner {

    // --------------------------------
    // Properties
    // --------------------------------

    private endThread: boolean = false;
    private isRunning: boolean = false;
    private readonly task: () => void;

    /**
     * Creates a new TaskRunner instance.
     *
     * @param task task to be executed
     */
    constructor(task: () => void) {
        this.task = task;
    }

    /**
     * Starts the current task
     */
    start(): void {
        if (this.isRunning) return;

        this.endThread = false;
        this.isRunning = true;

        this.run_loop();
    }

    /**
     * Stops the current task
     */
    stop(): void {
        if (!this.isRunning) return;

        this.endThread = true;
        this.isRunning = false;
    }

    // --------------------------------
    // Private
    // --------------------------------

    private async run_loop(): Promise<void> {
        while (!this.endThread) {
            this.task();
            await this.sleep(Config.delay);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
