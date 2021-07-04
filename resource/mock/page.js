module.exports = function (page) {
  if (!page) return null;

  return {
    'page_id': page.page._id,
    'page_url': page.page.page_url,
    'page_title': page.page.page_title,
    'theme_id': page.page.theme,
    'variant': page.page.variant,
    'role_id': page.role,
    'role_group': page.role_group
  };
}
