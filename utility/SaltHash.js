const crypto = require('crypto');

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

var saltHashPassword = function(userpassword) {
    var salt = genRandomString(16);
    var passwordData = sha512(userpassword,salt);
    return passwordData;
}

module.exports = {
  genRandomString:genRandomString,
  sha512:sha512,
  saltHashPassword:saltHashPassword
}
