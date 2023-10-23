class SeatomException extends Error {
  constructor(code, message) {
    super(message) // (1)
    this.name = 'SeatomException' // (2)
    this.code = code
    this.message = message
  }
}

// exports = module.exports = SeatomException
// export class SeatomException;/
module.exports = SeatomException
