const mockUser = require('./mock/user');

function handlerUser(req, res) {
  const user = res.locals.session.user;

  res.json({
    user: mockUser(user)
  });
}

module.exports = [
  handlerUser
];
