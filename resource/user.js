const mockUser = require('./mock/user');

function handlerUser(req, res, next) {
  const user = res.locals.session.user;

  res.result = {
    'user': mockUser(user)
  };

  return next();
}

module.exports = [
  handlerUser
];
