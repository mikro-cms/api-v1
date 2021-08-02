function handlerLogout(req, res, next) {
  const remove = res.locals.session.remove();

  res.result = {
    message: res.trans('user.logout_success')
  };

  return next();
}

module.exports = [
  handlerLogout
];
