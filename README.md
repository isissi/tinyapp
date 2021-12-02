# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product
!["Screenshot of URLs page"](https://github.com/isissi/tinyapp/blob/master/docs/:urls.png?raw=true)
!["screenshot of short url page"](https://github.com/isissi/tinyapp/blob/master/docs/shorturl.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Regidter an account, and you will automatically login. 
- Create a new short url by "Create New URL". Submit a url. 
- Once a url is created, visit the webiste by click the link after Short URL, or change the link to a new website by submitting a new url below "Edit". 
- All the urls you created can be found on "My URLs". 
- You can only see the short urls created by you. 
- Click the "Log Out" button on the right side of your email to log out. 

##Helpers.js functions
- generateRandomString(): generate a 6 digit random id
- emailExist(email, users): check if the email is already registered
- findId(email, users): find id by email
- urlsForUser(id, database): list all urls when a user id is provided
- getUserByEmail(email, database): find a user when an email is provided
