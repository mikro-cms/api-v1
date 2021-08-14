const { query, validationResult } = require('express-validator/check');
const modelApi = require('@mikro-cms/models/api');
const mockApi = require('./mock/api');

async function handlerApi(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const query = {
    '_id': req.query.api_id
  };

  const api = await modelApi.findOne(query, [
    '_id',
    'api_name',
    'api_version',
    'api_author',
    'api_url',
    'api_path',
    'api_info',
    'api_options',
    'api_resource'
  ]);

  res.result = {
    'api': mockApi(api)
  };

  return next();
}

module.exports = [
  query('api_id')
    .exists({ checkFalsy: false }).withMessage('api.api_id_required')
    .isAlphanumeric(),
  handlerApi
];
