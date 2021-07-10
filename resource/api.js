const { query, validationResult } = require('express-validator/check');
const modelApi = require('@mikro-cms/models/api');
const mockApi = require('./mock/api');

async function handlerApi(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
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

  res.json({
    api: mockApi(api)
  });
}

module.exports = [
  query('api_id')
    .exists({ checkFalsy: false }).withMessage('api.api_id_required')
    .isAlphanumeric(),
  handlerApi
];
