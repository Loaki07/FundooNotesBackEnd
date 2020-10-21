class ErrorResponse extends Error {
  /**
   * @description Function to create unique error response with status code 
   * @param {String} message 
   * @param {Number} statusCode 
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

const noteErrors = {
  1: {
    error: `Note already exists!`,
    statusCode: 400,
  },
  2: {
    error: `There are no Notes to display`,
    statusCode: 404,
  }
};

export { ErrorResponse, noteErrors };

// `Note with title '${data.title}' already exists!`, 400
