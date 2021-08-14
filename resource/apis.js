const { query, validationResult } = require('express-validator/check');
const modelApi = require('@mikro-cms/models/api');
const mockApi = require('./mock/api');

async function handlerApis(req, res, next) {
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

  const apis = await modelApi.find(query, [
    '_id',
    'api_name',
    'api_version',
    'api_author',
    'api_url',
    'api_path',
    'api_info',
    'api_options',
    'api_resource'
  ])
  .skip(parseInt(offset))
  .limit(parseInt(length));

  if (apis === null) {
    res.result = {
      'apis': [],
      'total': 0
    };
  } else {
    for (var apiIndex in apis) {
      let api = apis[apiIndex];

      apis[apiIndex] = mockApi(api);
    }

    const totalApis = await modelApi.countDocuments(query);

    res.result = {
      'apis': apis,
      'total': totalApis
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
  query('api_name')
    .optional(),
  query('api_author')
    .optional(),
  handlerApis
];
