module.exports = {
  '/login': {
    'post': {
      permission: {
        role_group: '(guest)'
      },
      handler: require('./login')
    }
  },
  '/register': {
    'post': {
      permission: {
        role_group: '(guest)'
      },
      handler: require('./register')
    }
  },
  '/user': {
    'get': {
      permission: {
        role_group: '(admin)&(member)'
      },
      handler: require('./user')
    }
  }
};
