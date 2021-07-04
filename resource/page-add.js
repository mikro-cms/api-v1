const { plugin } = require('@mikro-cms/core/apis');
const { body, validationResult } = require('express-validator/check');
const mockPage = require('./mock/page');

async function handlerPageAdd(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const pageOptions = {
    'page': {
      'page_url': req.body.page_url,
      'page_title': req.body.page_title,
      'theme': {
        'theme_id': req.body.theme_id
      }
    },
    'permission': {
      'role': req.body.role_id,
      'role_group': req.body.role_group
    },
    'variant': req.body.variant,
    'components': {}
  };

  if (pageOptions.permission.role === 'none') {
    pageOptions.permission.role = null;
  }

  const createdPage = await plugin.createPage(pageOptions);

  if (!createdPage) {
    return res.status(400).json({
      'message': res.trans('page.add_new_page_failed')
    });
  }

  res.json({
    message: res.trans('page.add_new_page_success'),
    page: mockPage(createdPage)
  });
}

module.exports = [
  body('page_url')
    .exists({ checkFalsy: true }).withMessage('page.page_url_required')
    .isLength({ min: 1, max: 256 }).withMessage('page.page_url_limit'),
  body('page_title')
    .exists({ checkFalsy: true }).withMessage('page.page_title_required')
    .isLength({ min: 1, max: 256 }).withMessage('page.page_title_limit'),
  body('theme_id')
    .exists({ checkFalsy: true }).withMessage('page.theme_id_required'),
  body('role_group')
    .exists({ checkFalsy: true }).withMessage('page.role_group_required')
    .matches(/^[a-zA-Z0-9\(\)\&]+$/).withMessage('page.role_group_format'),
  body('variant')
    .exists({ checkFalsy: true }).withMessage('page.variant_required'),
  handlerPageAdd
];
