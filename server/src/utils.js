const checkIfAdmin = (req, res, next) => {
  const ADMIN_EMAIL = 'psantwani@gmail.com';
  if (res.locals.loggedIn && req.session.email === ADMIN_EMAIL) {
    return next();
  }

  res.status(500).send('Unauthorized!');
};

const checkIfLoggedIn = (req, res, next) => {
  // For testing. TODO : Remove later
  req.session.userId = '8091c31e-e48b-4acc-b58e-fe327a25d5de';
  return next();

  /**
  if (res.locals.loggedIn) {
    return next();
  }

  res.status(500).send('Unauthorized!');
   */
};


module.exports = {
  checkIfAdmin,
  checkIfLoggedIn,
};
