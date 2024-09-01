import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import configJson from '../config/config.json' assert { type: 'json' };  // Add assertion

const config = configJson['development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

fs.readdirSync(path.resolve('./models'))
  .filter(file => file !== 'index.js')
  .forEach(async file => {
    const model = (await import(`./${file}`)).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
