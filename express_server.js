const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { generateRandomString, emailExist, findId, passwordMatch, urlsForUser } = require("./helpers");
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}))

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
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {   
    user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    userId: urlDatabase[req.params.shortURL]['userID'],
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
})

app.get("/register", (req, res) => {
  const templateVars = {   
    user: users[req.session.user_id]
  };
  res.render("urls_register", templateVars);
})

app.get("/login", (req, res) => {
  const templateVars = {   
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
})

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});
 
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.id;
  if (!userId) {
    const templateVars = {
      status: "401url",
      user: users[req.session.user_id]
    };
    return res.status(401).render("urls_error", templateVars);
  } else if (urlDatabase[shortURL].userID!==userId) {
    const templateVars = {
      status: "403url",
      user: users[req.session.user_id]
    };
    return res.status(403).render("urls_error", templateVars);
  } 
  const newURL = req.body.newURL;
  urlDatabase[shortURL] = {longURL: newURL, userID: req.session.user_id};
  res.redirect("/urls");
  
})

app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;
  const hashedPassword = users[findId(loginEmail, users)].password;

  if (!emailExist(loginEmail,users)) {
    const templateVars = {
      status: "403email",
      user: users[req.session.user_id]
    };
    return res.status(403).render("urls_error", templateVars);
  } else if (!bcrypt.compareSync(loginPassword, hashedPassword)) {
    const templateVars = {
      status: "403pw",
      user: users[req.session.user_id]
    };
    return res.status(403).render("urls_error", templateVars);
  } else {
    req.session.user_id = findId(loginEmail, users);
    res.redirect("/urls");
  }
})

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls")
})

app.post("/register", (req, res) => {
  const email = req.body.email; 
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    const templateVars = {
      status: "400invalid",
      user: users[req.session.user_id]
    };
    return res.status(400).render("urls_error", templateVars);
  } else if (emailExist(email, users)) {
    const templateVars = {
      status: "400email",
      user: users[req.session.user_id]
    };
    return res.status(400).render("urls_error", templateVars);
  }

  const userId = generateRandomString();
  users[userId] = {
    'id': userId,
    'email': email,
    'password': hashedPassword
  }
  
  req.session.user_id = userId;
  res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

