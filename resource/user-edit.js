const crypto = require('crypto');
const { body, validationResult } = require('express-validator/check');
const modelUser = require('@mikro-cms/models/user');
const mockUser = require('./mock/user');

async function handlerUserEdit(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const selectedUser = await modelUser.findOne({
    _id: req.body.user_id
  }).exec();

  if (selectedUser === null) {
    return res.status(400).json({
      'message': res.trans('user.user_not_found')
    });
  }

  if (req.body.email) {
    const emailRegistered = await modelUser.findOne({
      'user_email': req.body.email
    }).exec();

    if (emailRegistered !== null) {
      return res.status(400).json({
        'message': res.trans('user.email_taken')
      });
    } else {
      selectedUser.user_email = req.body.email;
    }
  }

  if (req.body.username) {
    const usernameRegistered = await modelUser.findOne({
      'user_username': req.body.username
    }).exec();

    if (usernameRegistered !== null) {
      return res.status(400).json({
        'message': res.trans('user.username_taken')
      });
    } else {
      selectedUser.user_username = req.body.user_username;
    }
  }

  if (req.body.password) {
    selectedUser.password = crypto.createHash('md5').update(req.body.password).digest('hex');
  }

  selectedUser.updated_by = res.locals.session.user._id;
  selectedUser.updated_at = Date.now();

  await selectedUser.save();

  res.json({
    message: res.trans('user.edit_user_success'),
    user: mockUser(selectedUser)
  });
}

module.exports = [
  body('user_id')
    .exists({ checkFalsy: true }).withMessage('user.user_id_required'),
  body('fullname')
    .optional()
    .isLength({ min: 1, max: 128 }).withMessage('user.fullname_limit'),
  body('email')
    .optional()
    .isEmail().withMessage('user.email_format'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 16 }).withMessage('user.username_limit')
    .isAlphanumeric().withMessage('user.username_format'),
  body('password')
    .optional()
    .isLength({ min: 3, max: 16 }).withMessage('user.password_limit'),
  handlerUserEdit
];
