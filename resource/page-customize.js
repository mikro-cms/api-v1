const { query, validationResult } = require('express-validator/check');
const utils = require('@mikro-cms/core/utils');
const modelPage = require('@mikro-cms/models/page');

async function handlerPageCustomize(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const query = {
    '_id': req.query.page_id
  };

  const page = await modelPage.findOne(query, [
    'page_url',
    'page_title',
    'theme',
    'variant'
  ])
  .populate({
    path: 'theme',
    select: "theme_name theme_version theme_url theme_path theme_info theme_options\
             theme_view theme_public_path theme_public_url theme_components"
  });

  // create local outside parent locals
  let pageLocals = {
    session: res.locals.session,
    page: page
  };

  // create utils outside parent utils
  let pageUtils = utils(pageLocals);

  const VarsBind = {
    ...pageUtils,
    ...pageLocals,
    trans: res.trans
  };

  const pathViewCustomize = `${page.theme.theme_view}/customize`;

  res.render(pathViewCustomize, VarsBind);
}

module.exports = [
  query('page_id')
    .exists({ checkFalsy: true }).withMessage('page.page_id_required'),
  handlerPageCustomize
];
