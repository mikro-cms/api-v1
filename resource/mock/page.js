module.exports = function (page) {
  if (!page) return null;

  return {
    'page_id': page._id,
    'page_url': page.page_url,
    'page_title': page.page_title,
    'variant': page.variant
  };
}
