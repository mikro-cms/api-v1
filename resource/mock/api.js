module.exports = function (api) {
  if (!api) return null;

  return {
    'api_id': api._id,
    'api_name': api.api_name,
    'api_version': api.api_version,
    'api_author': api.api_author,
    'api_url': api.api_url,
    'api_path': api.api_path,
    'api_info': api.api_info,
    'api_path_options': api.api_path_options,
    'api_resource': api.api_resource
  }
}
