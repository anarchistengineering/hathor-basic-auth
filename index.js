const bcrypt = require('bcryptjs');
const {
  isHtmlPage
} = require('hathor-utils');

const findUser = (username, password, config, callback)=>{
  const userHandler = config.get('userHandler');
  if(userHandler){
    return userHandler(username, password, callback);
  }
  const users = config.get('users', false);
  if(Array.isArray(users)){
    const uname = username.toLowerCase();
    const matches = users.filter((user)=>user.username.toLowerCase()===uname);
    const user = matches.shift();
    if(!user){
      return callback(null, false);
    }
    return bcrypt.compare(password, user.password, (err, isValid)=>{
      if(err){
        return callback(err);
      }
      if((!isValid) && (user.password === password)){
        return callback(null, true, user);
      }
      return callback(err, isValid, user);
    });
  }
  return callback(new Error('Attempt to use basic auth with no users or no userHandler defined!'));
};

module.exports = {
  type: 'basic',
  plugin: require('hapi-auth-basic'),

  postRegister(server, options, next){
    const config = options.get('auth');
    const logger = server.logger;

    const validateFunc = (request, username, password, callback)=>{
      return findUser(username, password, config, (err, isValid, user)=>{
        if(err){
          logger.error(err);
        }
        return callback(err, isValid, user);
      });
    };

    server.auth.strategy('basic', 'basic', Object.assign({
      validateFunc,
    }, config.get('plugin', {})));
    return next();
  }
};
