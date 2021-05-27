function handlerLogout(req, res) {
  const remove = res.locals.session.remove();

  res.json({
    message: res.trans('user.logout_success')
  });
}

module.exports = [
  handlerLogout
];
