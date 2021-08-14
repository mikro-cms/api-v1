module.exports = function (user) {
  if (!user) return null;

  return {
    'user_id': user._id,
    'deleted_at': user.deleted_at,
    'user_fullname': user.user_fullname,
    'user_username': user.user_username,
    'user_email': user.user_email,
    'role_id': user.role._id,
    'role_name': user.role.role_name,
    'role_group': user.role.role_group,
    'last_login': user.last_login
  }
}
