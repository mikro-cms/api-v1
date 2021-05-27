module.exports = {
  '/login': {
    'post': {
      permission: {
        role_group: '(guest)'
      },
      handler: require('./login')
    }
  },
  '/logout': {
    'get': {
      permission: {
        'role_group': '(member)'
      },
      handler: require('./logout')
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
    },
    'post': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./user-add')
    },
    'put': {
      permission: {
        role_group: '(admin)',
      },
      handler: require('./user-edit')
    },
    'delete': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./user-delete')
    }
  },
  '/users': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./users')
    }
  }
};
