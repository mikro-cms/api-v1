const crypto = require('crypto');
const { body, validationResult } = require('express-validator/check');
const modelUser = require('@mikro-cms/models/user');
const modelSession = require('@mikro-cms/models/session');

async function handlerLogin(req, res, next) {
  if (typeof res.locals.session.token !== 'undefined') {
    res.result = {
      'status': 400,
      'message': res.trans('user.login_failed')
    };

    return next();
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const user = await modelUser.findOne({
    'user_username': req.body.username,
    'user_password': crypto.createHash('md5').update(req.body.password).digest('hex')
  }).exec();

  if (user === null) {
    res.result = {
      'status': 400,
      'message': res.trans('user.invalid_username_or_password')
    };

    return next();
  }

  const token = crypto.createHash('md5')
                  .update(crypto.randomBytes(48).toString())
                  .digest('hex');
  const currentTime = Date.now();
  const maxAge = process.env.SESSION_EXPIRES * (1000 * 60);

  const newSession = new modelSession({
    'expired': currentTime + maxAge,
    'device': '',
    'ip': '',
    'token': token,
    'user': user._id
  });

  user.last_login = currentTime;

  await newSession.save();
  await user.save();

  res.cookie('token', token, {
    maxAge: maxAge,
    path: '/'
  });

  res.result = {
    'message': res.trans('user.login_success'),
    'token': token
  };

  return next();
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
