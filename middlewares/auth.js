const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    return res.status(401).send({
      success: false,
      errorType: "UnAuthorized",
      errorMessage: "UnAuthorized User! Access Denied",
    });
  }
};

module.exports = { isAuthenticated};
