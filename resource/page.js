const { query, validationResult } = require('express-validator/check');
const modelPagePermission = require('@mikro-cms/models/page-permission');
const mockPage = require('./mock/page');

async function handlerPage(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const query = {
    'page': req.query.page_id
  };

  const page = await modelPagePermission.findOne(query, [
    '_id',
    'role',
    'role_group'
  ])
  .populate({
    path: 'page',
    select: '_id page_url page_title theme variant'
  });

  res.result = {
    'page': mockPage(page)
  };

  return next();
}

module.exports = [
  query('page_id')
    .exists({ checkFalsy: false }).withMessage('page.page_id_required')
    .isAlphanumeric(),
  handlerPage
];
