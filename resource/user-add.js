const crypto = require('crypto');
const { body, validationResult } = require('express-validator/check');
const modelUser = require('@mikro-cms/models/user');
const modelRole = require('@mikro-cms/models/role');
const mockUser = require('./mock/user');

async function handlerUserAdd(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const emailRegistered = await modelUser.findOne({
    'user_email': req.body.email
  }).exec();

  if (emailRegistered !== null) {
    res.result = {
      'status': 400,
      'message': res.trans('user.email_taken')
    };

    return next();
  }

  const usernameRegistered = await modelUser.findOne({
    'user_username': req.body.username
  }).exec();

  if (usernameRegistered !== null) {
    res.result = {
      'status': 400,
      'message': res.trans('user.username_taken')
    };

    return next();
  }

  const roleMember = await modelRole.findOne({ 'role_name': 'member' }).exec();

  if (roleMember === null) {
    res.result = {
      'status': 400,
      'message': res.trans('user.add_new_user_failed')
    };

    return next();
  }

  const password = crypto.createHash('md5').update(req.body.password).digest('hex');

  const newUser = new modelUser({
    'created_by': res.locals.session.user._id,
    'user_fullname': req.body.fullname,
    'user_email': req.body.email,
    'user_username': req.body.username,
    'user_password': password,
    'role': roleMember._id
  });

  await newUser.save();

  newUser.role = roleMember;

  res.result = {
    'message': res.trans('user.add_new_user_success'),
    'user': mockUser(newUser)
  };

  return next();
}

module.exports = [
  body('fullname')
    .exists({ checkFalsy: true }).withMessage('user.fullname_required')
    .isLength({ min: 1, max: 128 }).withMessage('user.fullname_limit'),
  body('email')
    .exists({ checkFalsy: true }).withMessage('user.email_required')
    .isEmail().withMessage('user.email_format'),
  body('username')
    .exists({ checkFalsy: true }).withMessage('user.username_required')
    .isLength({ min: 3, max: 16 }).withMessage('user.username_limit')
    .isAlphanumeric().withMessage('user.username_format'),
  body('password')
    .exists({ checkFalsy: true }).withMessage('user.password_required')
    .isLength({ min: 3, max: 16 }).withMessage('user.password_limit'),
  handlerUserAdd
];
