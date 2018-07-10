class ServerStats {
  static start (action) {
    let actionMeasurements = this.measurements[action]
    if (!actionMeasurements) {
      actionMeasurements = []
      this.measurements[action] = actionMeasurements
    }
    actionMeasurements.push({
      start: Date.now(),
      stop: Number.MAX_SAFE_INTEGER
    })
  }

  static stop (action) {
    let actionMeasurements = this.measurements[action]
    actionMeasurements[actionMeasurements.length - 1].stop = Date.now()
  }
}

ServerStats.measurements = {}

module.exports = ServerStats
