// const dotenv = require('dotenv');
// dotenv.config();
const db = require('./models');

db.sequelize.sync({ alter: true })
  .then(() => console.log('Migration success'))
  .catch(error => console.log(error))
  .finally(() => process.exit(0));