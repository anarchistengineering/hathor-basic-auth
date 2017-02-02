Hathor Basic Auth
===

**NOTE:** Using basic auth is an **ALL IN** or **ALL OUT** option.  You can not whitelist or blacklist assets or routes when you use basic auth.

Installation
---

```
npm install --save hathor-basic-auth
```

Configuration
---

```js
auth: {
  static: false, // it's better to not protect your static assets by default
  key: String, // Key/password for authentication

  // What module to utilize for authentication
  module: `hathor-basic-auth`,

  // One option to provide username's and passwords
  users: [
    {
      username: 'test',
      password: 'person' // This value can be bcrypt'd so plain text isn't ever shown
    }
  ],

  // The "more appropriate" way
  userHandler(username, password, callback){},

  plugin: {} // Any values you want to override or push down into the hapi-auth-basic module
}
```

Usage
---

### Using the "users" array

The users array is provided for development mode testing, it should never be used in a live environment.  Adding, editing, deleting users requires that you restart the application.

### Using a custom "userHandler"

If you setup and configure the userHandler method within the configuration it will take precedence over the users array.  This means that none of the user accounts specified within the users array will work if there is a userHandler defined.  If, for example you want to utilize the users array for local development and userHandler when running within a specified environment, it is recommended that you setup the userHandler in code when you load your configuration.  An example of this is given below.

The callback takes three parameters; error, isValid, and credentials

```js
const userHandler = (username, password, callback){
  myUserProvider.get(username, password, (err, user)=>{
    if(err){
      return callback(err);
    }
    return callback(null, !!user, user);
  });
}
```
