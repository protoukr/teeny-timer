declare type TimerListener = (timer: Timer) => void;
export declare class Timer {
    private timeoutID?;
    tickListener?: TimerListener;
    completedListener?: TimerListener;
    errorHandler?: (error: unknown, timer: Timer) => void;
    defIntervalMs?: number;
    defRepeatCount: number;
    constructor(params?: {
        tickListener?: TimerListener;
        completedListener?: TimerListener;
        errorHandler?: (error: unknown, timer: Timer) => void;
        defIntervalMs?: number;
        defRepeatCount?: number;
    });
    start(intervalMs?: number | undefined, repeat?: number): void;
    stop(): void;
    private callListener;
}
export {};
