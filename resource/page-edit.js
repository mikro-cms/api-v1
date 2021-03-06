const { plugin } = require('@mikro-cms/core/apis');
const { body, validationResult } = require('express-validator/check');
const mockPage = require('./mock/page');

async function handlerPageEdit(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const pageOptions = {
    'page': {
      'page_id': req.body.page_id,
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

  const editedPage = await plugin.editPage(pageOptions);

  if (!editedPage) {
    res.result = {
      'status': 400,
      'message': res.trans('page.edit_page_failed')
    };
  } else {
    res.result = {
      'message': res.trans('page.edit_page_success'),
      'page': mockPage(editedPage)
    };
  }

  return next();
}

module.exports = [
  body('page_id')
    .exists({ checkFalsy: true }).withMessage('page.page_id_required'),
  body('page_url')
    .optional(),
  body('page_title')
    .optional(),
  body('theme_id')
    .optional(),
  body('role_id')
    .optional(),
  body('role_group')
    .optional(),
  body('variant')
    .optional(),
  handlerPageEdit
];
