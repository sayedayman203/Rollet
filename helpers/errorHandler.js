exports.errorHandler = (err) => {
  if (err.name === "MongoError" && err.code === 11000) {
    err.status = 409;
    err.message = "USER_EXISTS";
  }
  return err;
};
