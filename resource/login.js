const crypto = require('crypto');
const { body, validationResult } = require('express-validator/check');
const modelUser = require('@mikro-cms/models/user');
const modelSession = require('@mikro-cms/models/session');

async function handlerLogin(req, res) {
  if (typeof res.locals.session.token !== 'undefined') {
    return res.json({
      message: res.trans('user.login_failed')
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const user = await modelUser.findOne({
    'user_username': req.body.username,
    'user_password': crypto.createHash('md5').update(req.body.password).digest('hex')
  }).exec();

  if (user === null) {
    return res.status(400).json({
      'message': res.trans('user.invalid_username_or_password')
    });
  }

  const token = crypto.createHash('md5')
                  .update(crypto.randomBytes(48).toString())
                  .digest('hex');

  const newSession = new modelSession({
    'expired': Date.now(),
    'device': '',
    'ip': '',
    'token': token,
    'user': user._id
  });

  await newSession.save();

  res.cookie('token', token, {
    maxAge: process.env.SESSION_EXPIRES * (1000 * 60),
    path: '/'
  }).json({
    message: res.trans('user.login_success')
  });
}

module.exports = [
  body('username')
    .exists({ checkFalsy: true }).withMessage('user.username_required')
    .isLength({ min: 3, max: 16 }).withMessage('user.username_limit')
    .isAlphanumeric().withMessage('user.username_format'),
  body('password')
    .exists({ checkFalsy: true }).withMessage('user.password_required')
    .isLength({ min: 3, max: 16 }).withMessage('user.password_limit'),
  handlerLogin
];
