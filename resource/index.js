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
  },
  '/page': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./page')
    },
    'post': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./page-add')
    },
    'put': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./page-edit')
    }
  },
  '/pages': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./pages')
    }
  },
  '/apis': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./apis')
    }
  },
  '/api': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./api')
    }
  },
  '/resources': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./resources')
    }
  },
  '/resource': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./resource')
    },
    'put': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./resource-edit')
    }
  },
  '/roles': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./roles')
    }
  },
  '/themes': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./themes')
    }
  },
  '/customize': {
    'get': {
      permission: {
        role_group: '(admin)'
      },
      handler: require('./page-customize')
    }
  }
};
