function handlerUser(req, res) {
  const user = res.locals.session.user;

  res.json({
    _id: user._id,
    email: user.user_email,
    username: user.user_username
  });
}

module.exports = [
  handlerUser
];
