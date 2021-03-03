const ModelUser = require('../models/user.model');

// => Esse método identifica se o 'user' existe na base de dados
const userExists = async (user) => {
  const userExists = await ModelUser.findOne({ where: { username: user } });
  if (userExists != null) {
    return true;
  } else {
    return false;
  }
};

module.exports = userExists;
