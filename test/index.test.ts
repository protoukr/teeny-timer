import { Timer } from '../src'

describe('Timer', () => {
  test('one tick', async () => {
    const tickListenerSpy = jest.fn()

    await new Promise<any>((resolve) => {
      const timer = new Timer({
        tickListener: tickListenerSpy,
        completedListener: resolve
      })
      timer.start(5, 1)
    })

    expect(tickListenerSpy).toBeCalledTimes(1)
  })

  test('multiple ticks', async () => {
    const repeatCount = 10
    const tickListenerSpy = jest.fn()

    await new Promise<any>((resolve) => {
      const timer = new Timer({
        tickListener: tickListenerSpy,
        completedListener: resolve
      })
      timer.start(5, repeatCount)
    })

    expect(tickListenerSpy).toBeCalledTimes(repeatCount)
  })

  test('starting with wrong params', () => {
    const timer = new Timer()

    expect(() => timer.start(-1)).toThrow()
    expect(() => timer.start(100, -1)).toThrow()
  })

  test('handling error in tick listener', async () => {
    const errorHandlerSpy = jest.fn()
    const error = new Error()

    await new Promise((resolve) => {
      const timer = new Timer({
        tickListener: () => { throw error },
        completedListener: resolve,
        errorHandler: errorHandlerSpy
      })
      timer.start(10)
    })

    expect(errorHandlerSpy).toBeCalledWith(error, expect.any(Timer))
  })
})
