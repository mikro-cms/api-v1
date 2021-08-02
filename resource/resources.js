const { query, validationResult } = require('express-validator/check');
const modelApiPermission = require('@mikro-cms/models/api-permission');
const mockResource = require('./mock/resource');

async function handlerResources(req, res, next) {
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
  const query = {
    'api': req.query.api_id
  };

  const resources = await modelApiPermission.find(query, [
    '_id',
    'role_group',
    'api_resource',
    'api_method'
  ])
  .skip(parseInt(offset))
  .limit(parseInt(length));

  if (resources === null) {
    res.result = {
      'resources': [],
      'total': 0
    };
  } else {
    for (var resourceIndex in resources) {
      let resource = resources[resourceIndex];

      resources[resourceIndex] = mockResource(resource);
    }

    const totalResources = await modelApiPermission.countDocuments(query);

    res.result = {
      'resources': resources,
      'total': totalResources
    };
  }

  return next();
}

module.exports = [
  query('api_id')
    .exists({ checkFalsy: false }).withMessage('api.api_id_required')
    .isAlphanumeric(),
  query('offset')
    .optional()
    .isNumeric(),
  query('length')
    .optional()
    .isNumeric(),
  handlerResources
];
