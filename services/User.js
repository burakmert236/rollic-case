const UserModel = require('../models/User');
const MongoBase = require('./MongoBase');

class User extends MongoBase {
    constructor() {
      super(UserModel);
    }
}

module.exports = new User();