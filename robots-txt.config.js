let robotsConfig

if (process.env.CONTEXT !== 'production') {
  robotsConfig = {
    policy: [
      {
        userAgent: '*',
        disallow: '/'
      }
    ]
  }
} else {
  robotsConfig = {
    policy: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile',
          '/library',
          '/album-editor',
          '/settings'
        ]
      }
    ]
  }
}

module.exports = robotsConfig
