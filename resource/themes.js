const { query, validationResult } = require('express-validator/check');
const modelTheme = require('@mikro-cms/models/theme');
const mockTheme = require('./mock/theme');

async function handlerThemes(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      'message': res.transValidator(errors.array({ onlyFirstError: true }))
    });
  }

  const offset = req.query.offset || 0;
  const length = req.query.length || 10;
  const query = {};

  const themes = await modelTheme.find(query, [
    '_id',
    'theme_name',
    'theme_version',
    'theme_author',
    'theme_url',
    'theme_components'
  ])
  .skip(parseInt(offset))
  .limit(parseInt(length));

  if (themes === null) {
    res.json({ themes: [], total: 0 });
  } else {
    for (var themeIndex in themes) {
      let theme = themes[themeIndex];

      themes[themeIndex] = mockTheme(theme);
    }
  }

  const totalThemes = await modelTheme.countDocuments(query);

  res.json({
    themes: themes,
    total: totalThemes
  });
}

module.exports = [
  query('offset')
    .optional()
    .isNumeric(),
  query('length')
    .optional()
    .isNumeric(),
  query('theme_name')
    .optional(),
  query('theme_author')
    .optional(),
  handlerThemes
];
