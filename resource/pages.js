const { query, validationResult } = require('express-validator/check');
const modelPagePermission = require('@mikro-cms/models/page-permission');
const mockPage = require('./mock/page');

async function handlerPages(req, res, next) {
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

  const pages = await modelPagePermission.find(query, [
    '_id',
    'role',
    'role_group'
  ])
  .populate({
    path: 'page',
    select: '_id page_url page_title theme variant',
    populate: {
      path: 'theme',
      model: 'theme',
      select: 'theme_customize'
    }
  })
  .skip(parseInt(offset))
  .limit(parseInt(length));

  if (pages === null) {
    res.result = {
      'pages': [],
      'total': 0
    };
  } else {
    for (var pageIndex in pages) {
      let page = pages[pageIndex];

      pages[pageIndex] = mockPage(page);
    }

    const totalPages = await modelPagePermission.countDocuments(query);

    res.result = {
      'pages': pages,
      'total': totalPages
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
  query('page_url')
    .optional(),
  query('page_title')
    .optional(),
  handlerPages
];
