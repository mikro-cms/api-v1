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
  }
};
