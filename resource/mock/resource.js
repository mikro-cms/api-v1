module.exports = function (resource) {
  if (!resource) return null;

  return {
    'resource_id': resource._id,
    'role_id': resource.role,
    'role_group': resource.role_group,
    'api_resource': resource.api_resource,
    'api_method': resource.api_method
  }
}
