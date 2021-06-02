const { query, validationResult } = require('express-validator/check');
const modelRole = require('@mikro-cms/models/role');
const mockRole = require('./mock/role');

async function handlerRoles(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
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
    res.json({ roles: [], total: 0 });
  } else {
    for (var roleIndex in roles) {
      let role = roles[roleIndex];

      roles[roleIndex] = mockRole(role);
    }
  }

  const totalRoles = await modelRole.countDocuments(query);

  res.json({
    roles: roles,
    total: totalRoles
  });
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
