const { query, validationResult } = require('express-validator/check');
const modelPagePermission = require('@mikro-cms/models/page-permission');
const mockPage = require('./mock/page');

async function handlerPage(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
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

  res.json({
    page: mockPage(page)
  });
}

module.exports = [
  query('page_id')
    .exists({ checkFalsy: false }).withMessage('page.page_id_required')
    .isAlphanumeric(),
  handlerPage
];
