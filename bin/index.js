"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const assert = require("assert");
class Timer {
    constructor(params = {}) {
        const { tickListener, completedListener, errorHandler, defIntervalMs, defRepeatCount = 1 } = params;
        this.tickListener = tickListener;
        this.completedListener = completedListener;
        this.errorHandler = errorHandler;
        this.defIntervalMs = defIntervalMs;
        this.defRepeatCount = defRepeatCount;
    }
    start(intervalMs = this.defIntervalMs, repeat = this.defRepeatCount) {
        assert(intervalMs !== undefined && intervalMs > 0, 'Interval should be defined and higher 0');
        assert(repeat > 0, 'Repeat count should be higher 0');
        this.stop();
        const timeoutCallback = () => {
            repeat--;
            this.callListener(this.tickListener);
            if (repeat > 0) {
                this.timeoutID = setTimeout(timeoutCallback, intervalMs);
            }
            else {
                this.callListener(this.completedListener);
            }
        };
        this.timeoutID = setTimeout(timeoutCallback, intervalMs);
    }
    stop() {
        if (this.timeoutID !== undefined) {
            clearTimeout(this.timeoutID);
            this.timeoutID = undefined;
        }
    }
    callListener(listener) {
        if (listener == null) {
            return;
        }
        if (this.errorHandler == null) {
            listener(this);
            return;
        }
        try {
            listener(this);
        }
        catch (err) {
            this.errorHandler(err, this);
        }
    }
}
exports.Timer = Timer;
