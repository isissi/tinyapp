const generateRandomString = () => {
  let result = '';
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 6; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const emailExist = (emailInput, users) => {
  for (const user in users) {
    if (emailInput === users[user].email) {
      return true;
    }
  }
  return false;
}

const passwordMatch = (email, password, users) => {
  for (const user in users) {
    if (
      email === users[user]["email"] &&
      password === users[user]["password"]
    ) {
      return true;
    }
  }
  return false;
}

const findId = (email, users) => {
  for (const user in users) {
    if (users[user]['email'] === email) {
      return users[user]['id'];
    }
  }
}

const urlsForUser = (id, database) => {
  let result = {};
  for (const url in database) {
    if (database[url].userID === id) {
      result[url] = {};
      result[url].longURL = database[url]["longURL"];
      result[url].userID = id;
    }
  }
  return result;
}

const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (email === database[user].email) {
      return user;
    }
  }
  return undefined;
}


module.exports = { generateRandomString, emailExist, findId, passwordMatch, urlsForUser, getUserByEmail };