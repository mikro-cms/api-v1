module.exports = function (theme) {
  if (!theme) return null;

  return {
    'theme_id': theme._id,
    'theme_name': theme.theme_name,
    'theme_version': theme.theme_version,
    'theme_author': theme.theme_author,
    'theme_url': theme.theme_url,
    'theme_components': theme.theme_components
  };
}
