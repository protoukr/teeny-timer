function assert (evalRes: boolean, msg: string): void {
  if (!evalRes) {
    throw new Error(msg)
  }
}

type TimerListener = (timer: Timer) => void
export class Timer {
  private timeoutID?: ReturnType<typeof setTimeout>

  tickListener?: TimerListener

  completedListener?: TimerListener

  errorHandler?: (error: unknown, timer: Timer) => void

  defIntervalMs?: number

  defRepeatCount: number

  constructor (params: {
    tickListener?: TimerListener
    completedListener?: TimerListener
    errorHandler?: (error: unknown, timer: Timer) => void
    defIntervalMs?: number
    defRepeatCount?: number
  } = {}) {
    const {
      tickListener,
      completedListener,
      errorHandler,
      defIntervalMs,
      defRepeatCount = 1
    } = params
    this.tickListener = tickListener
    this.completedListener = completedListener
    this.errorHandler = errorHandler
    this.defIntervalMs = defIntervalMs
    this.defRepeatCount = defRepeatCount
  }

  start (intervalMs = this.defIntervalMs, repeat = this.defRepeatCount): void {
    assert(intervalMs !== undefined && intervalMs > 0, 'Interval should be defined and higher 0')
    assert(repeat > 0, 'Repeat count should be higher 0')
    this.stop()
    const timeoutCallback = (): void => {
      repeat--
      this.callListener(this.tickListener)
      if (repeat > 0) {
        this.timeoutID = setTimeout(timeoutCallback, intervalMs)
      } else {
        this.callListener(this.completedListener)
      }
    }
    this.timeoutID = setTimeout(timeoutCallback, intervalMs)
  }

  stop (): void {
    if (this.timeoutID !== undefined) {
      clearTimeout(this.timeoutID)
      this.timeoutID = undefined
    }
  }

  private callListener (listener?: TimerListener): void {
    if (listener == null) {
      return
    }
    if (this.errorHandler == null) {
      listener(this)
      return
    }
    try {
      listener(this)
    } catch (err) {
      this.errorHandler(err, this)
    }
  }
}
