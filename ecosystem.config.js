module.exports = {
  apps: [{
    name: 'PPM',
    script: "app.js",
    instances: "1",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
  }]
}
