const { query, validationResult } = require('express-validator/check');
const modelApiPermission = require('@mikro-cms/models/api-permission');
const mockResource = require('./mock/resource');

async function handlerResource(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const query = {
    '_id': req.query.resource_id
  };

  const resource = await modelApiPermission.findOne(query, [
    '_id',
    'role',
    'role_group',
    'api_resource',
    'api_method'
  ]);

  res.result = {
    'resource': mockResource(resource)
  };

  return next();
}

module.exports = [
  query('resource_id')
    .exists({ checkFalsy: false }).withMessage('api.resource_id_required')
    .isAlphanumeric().withMessage('api.edit_resource_failed'),
  handlerResource
];
