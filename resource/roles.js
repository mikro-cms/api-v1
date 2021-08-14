const { query, validationResult } = require('express-validator/check');
const modelRole = require('@mikro-cms/models/role');
const mockRole = require('./mock/role');

async function handlerRoles(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const offset = req.query.offset || 0;
  const length = req.query.length || 10;
  const query = {};

  const roles = await modelRole.find(query, [
    '_id',
    'role_name',
    'role_name'
  ])
  .skip(parseInt(offset))
  .limit(parseInt(length));

  if (roles === null) {
    res.result = {
      'roles': [],
      'total': 0
    };
  } else {
    for (var roleIndex in roles) {
      let role = roles[roleIndex];

      roles[roleIndex] = mockRole(role);
    }

    const totalRoles = await modelRole.countDocuments(query);

    res.result = {
      'roles': roles,
      'total': totalRoles
    };
  }

  return next();
}

module.exports = [
  query('offset')
    .optional()
    .isNumeric(),
  query('length')
    .optional()
    .isNumeric(),
  handlerRoles
];
