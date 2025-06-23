/**
 * TaskRunner :: Thread as a task runner
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class TaskRunner {

    // --------------------------------
    // Properties
    // --------------------------------

    private endThread: boolean = false;
    private isRunning: boolean = false;
    private apply: () => void;

    /**
     * Constructor of TaskRunner
     *
     * @param apply function to apply
     */
    constructor(apply: () => void) {
        this.apply = apply;
    }

    /**
     * Start the task
     */
    start(): void {
        if (this.isRunning) return;

        this.endThread = false;
        this.isRunning = true;

        this.run_loop();
    }

    /**
     * Stop the current task
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
            this.apply();
            await this.sleep(10);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
