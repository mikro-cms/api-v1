const { query, validationResult } = require('express-validator/check');
const modelUser = require('@mikro-cms/models/user');
const mockUser = require('./mock/user');

async function handlerUserDelete(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const selectedUser = await modelUser.findOne({
    _id: req.query.user_id
  }).exec();

  if (selectedUser === null) {
    return res.status(400).json({
      'message': res.trans('user.user_not_found')
    });
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
}

module.exports = [
  query('user_id')
    .exists({ checkFalsy: true }).withMessage('user.user_not_found'),
  handlerUserDelete
];
