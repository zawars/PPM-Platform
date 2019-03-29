module.exports = {
  apps: [{
    name: 'PPM',
    script: "app.js",
    instances: "4",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
  }]
}
