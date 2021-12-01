const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com",
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  const templateVars = {   
    urls: urlsForUser(req.cookies.user_id),
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {   
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  console.log(req.params.shortURL);

  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    userId: urlDatabase[req.params.shortURL]['userId'],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
})

app.get("/register", (req, res) => {
  const templateVars = {   
    user: users[req.cookies.user_id]
  };
  res.render("urls_register", templateVars);
})

app.get("/login", (req, res) => {
  const templateVars = {   
    user: users[req.cookies.user_id]
  };
  res.render("urls_login", templateVars);
})

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: longURL, userId: req.cookies.user_id};

  res.redirect(`/urls/${shortURL}`);
});
 
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const urls = urlsForUser(userId);
  const shortURL = req.params.id;
  if (!userId) {
    res.send("Please register or login.")
  } else if (!Object.keys(urls).includes(shortURL)) {
    res.send("Sorry, you dont't have access to this url.");
  } else {
    const newURL = req.body.newURL;
    urlDatabase[shortURL] = {longURL: newURL, userID: req.cookies.user_id};
    res.redirect("/urls");
  }
})

app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;

  if (!emailExist(loginEmail)) {
    res.status(403).send("Your email is not registered.");
  } else if (!passwordMatch(loginEmail, loginPassword)) {
    res.status(403).send("Your password doesn't match");
  } else {
    res.cookie("user_id", findId(loginEmail));
    res.redirect("/urls");
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.cookies.user_id);
  res.redirect("/urls")
})

app.post("/register", (req, res) => {
  const email = req.body.email; 
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send("Please input a valid email & password. ");
  } else if (emailExist(email)) {
    res.status(400).send("You have already registered. Please log in. ");
  }

  const userId = generateRandomString();
  users[userId] = {
    'id': userId,
    'email': email,
    'password': password
  }
  
  res.cookie("user_id", userId);
  res.redirect("/urls")
})

function generateRandomString() {
  let result = '';
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 6; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function emailExist(emailInput) {
  for (const user in users) {
    if (emailInput === users[user].email) {
      return true;
    }
  }
  return false;
}

function passwordMatch(email, password) {
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

function findId(email) {
  for (const user in users) {
    if (users[user]['email'] === email) {
      return users[user]['id'];
    }
  }
}

function urlsForUser(id) {
  let result = {};
  for(let url in urlDatabase) {
    if (id === urlDatabase[id]) {
      result[url] = urlDatabase[url]["longURL"];
    }
  }
  return result;
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

