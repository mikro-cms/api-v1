const { body, validationResult } = require('express-validator/check');
const modelUser = require('@mikro-cms/models/user');
const mockUser = require('./mock/user');

async function handlerUsers(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const offset = req.query.offset || 0;
  const length = req.query.length || 10;
  const query = {};

  if (req.query.fullname) {
    query.user_fullname = { $regex: `.*${req.query.fullname}.*` };
  }

  if (req.query.email) {
    query.user_email = { $regex: `.*${req.query.email}.*` };
  }

  if (req.query.username) {
    query.user_username = { $regex: `.*${req.query.username}.*`};
  }

  const users = await modelUser.find(query, [
    '_id',
    'deleted_at',
    'user_fullname',
    'user_email',
    'user_username',
    'last_login'
  ])
  .populate('role', 'role_name role_group')
  .skip(parseInt(offset))
  .limit(parseInt(length));

  if (users === null) {
    res.json({ users: [], total: 0 });
  } else {
    for (var userIndex in users) {
      let user = users[userIndex];

      users[userIndex] = mockUser(user);
    }
  }

  const total = await modelUser.countDocuments();

  res.json({
    users: users,
    total: total
  });
}

module.exports = [
  body('offset')
    .optional()
    .isNumeric(),
  body('length')
    .optional()
    .isNumeric(),
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
  handlerUsers
];
