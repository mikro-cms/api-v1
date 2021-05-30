const { query, validationResult } = require('express-validator/check');
const modelApiPermission = require('@mikro-cms/models/api-permission');
const mockResource = require('./mock/resource');

async function handlerResource(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const query = {
    '_id': req.query.resource_id
  };

  const resource = await modelApiPermission.findOne(query, [
    '_id',
    'role_group',
    'api_resource',
    'api_method'
  ]);

  res.json({
    resource: mockResource(resource)
  });
}

module.exports = [
  query('resource_id')
    .exists({ checkFalsy: false }).withMessage('api.resource_id_required')
    .isAlphanumeric(),
  handlerResource
];
