const { query, validationResult } = require('express-validator/check');
const modelUser = require('@mikro-cms/models/user');
const mockUser = require('./mock/user');

async function handlerUserDelete(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const selectedUser = await modelUser.findOne({
    _id: req.query.user_id
  }).exec();

  if (selectedUser === null) {
    res.result = {
      'status': 400,
      'message': res.trans('user.user_not_found')
    };

    return next();
  }

  if (selectedUser.deleted_at !== null) {
    selectedUser.deleted_by = null;
    selectedUser.deleted_at = null;
  } else {
    selectedUser.deleted_by = res.locals.session.user._id;
    selectedUser.deleted_at = Date.now();
  }

  await selectedUser.save();

  res.json({
    message: res.trans('user.delete_user_success'),
    user: mockUser(selectedUser)
  });

  return next();
}

module.exports = [
  query('user_id')
    .exists({ checkFalsy: true }).withMessage('user.user_not_found'),
  handlerUserDelete
];
