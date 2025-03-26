const bcrypt = require("bcryptjs");

exports.getSaltSync = async () => {
  return bcrypt.genSaltSync();
};

exports.getHashSync = async (password) => {
  const salt = await this.getSaltSync();
  return bcrypt.hashSync(password, salt);
};

exports.getCompareSync = async (enteredPassword, password) => {
  return bcrypt.compareSync(enteredPassword, password);
};
