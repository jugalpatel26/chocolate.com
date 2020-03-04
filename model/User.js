class User {
  constructor(userId,firstName,lastName,email,salt,password) {
      this.userId = userId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.salt = salt;
      this.password = password;

  }
}
module.exports = User;
