const mockTheme = require('./theme');

module.exports = function (page) {
  if (!page) return null;

  let mockedPage = {
    'page_id': page.page._id,
    'page_url': page.page.page_url,
    'page_title': page.page.page_title,
    'variant': page.page.variant,
    'role_id': page.role,
    'role_group': page.role_group
  };

  if (typeof page.page.theme === 'object') {
    let mockedTheme = mockTheme(page.page.theme);

    mockedPage = {
      ...mockedPage,
      ...mockedTheme
    };
  } else {
    mockedPage = {
      ...mockedPage,
      'theme_id': page.theme
    };
  }

  return mockedPage;
}
