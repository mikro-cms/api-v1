module.exports = function (role) {
  if (!role) return null;

  return {
    'role_id': role._id,
    'role_name': role.role_name,
    'role_group': role.role_group
  };
}
