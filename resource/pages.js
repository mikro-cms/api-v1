const { query, validationResult } = require('express-validator/check');
const modelPage = require('@mikro-cms/models/page');
const mockPage = require('./mock/page');

async function handlerPages(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const offset = req.query.offset || 0;
  const length = req.query.length || 10;
  const query = {};

  const pages = await modelPage.find(query, [
    '_id',
    'page_url',
    'page_title',
    'variant'
  ])
  .skip(parseInt(offset))
  .limit(parseInt(length));

  if (pages === null) {
    res.json({ pages: [], total: 0 });
  } else {
    for (var pageIndex in pages) {
      let page = pages[pageIndex];

      pages[pageIndex] = mockPage(page);
    }
  }

  const totalPages = await modelPage.countDocuments(query);

  res.json({
    pages: pages,
    total: totalPages
  });
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