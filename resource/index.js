module.exports = {
  '/login': {
    method: 'post',
    permission: {
      role_group: 'guest'
    },
    handler: require('./login')
  },
  '/register': {
    method: 'post',
    permission: {
      role_group: 'guest'
    },
    handler: require('./register')
  },
  '/user': {
    method: 'get',
    permission: {
      role_group: 'member'
    },
    handler: require('./user')
  }
};
