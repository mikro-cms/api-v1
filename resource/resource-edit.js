const { body, validationResult } = require('express-validator/check');
const modelApiPermission = require('@mikro-cms/models/api-permission');
const mockResource = require('./mock/resource');

async function handlerResourceEdit(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.result = {
      'status': 400,
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    };

    return next();
  }

  const resource = await modelApiPermission.findOne({
    _id: req.body.resource_id,
  });

  if (resource === null) {
    res.result = {
      'status': 400,
      'message': res.trans('api.resource_not_found')
    };

    return next();
  }

  if (req.body.role_id) {
    if (req.body.role_id === 'none') {
      resource.role = null;
    } else {
      resource.role = req.body.role_id;
    }
  }

  if (req.body.role_group) {
    resource.role_group = req.body.role_group;
  }

  await resource.save();

  res.result = {
    'resource': mockResource(resource),
    'message': res.trans('api.edit_resource_success')
  };

  return next();
}

module.exports = [
  body('resource_id')
    .exists({ checkFalsy: false }).withMessage('api.resource_id_required')
    .isAlphanumeric().withMessage('api.edit_resource_failed'),
  body('role_id')
    .optional()
    .isAlphanumeric().withMessage('api.edit_resource_failed'),
  body('role_group')
    .optional()
    .matches(/^[a-zA-Z0-9\(\)\&]+$/).withMessage('api.role_group_format'),
  handlerResourceEdit
];
