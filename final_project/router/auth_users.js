const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsameusername = users.filter(
    (user) => user.username === username
  );

  if (userswithsameusername.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign(
        {
          data: {
            password,
          },
        },
        "access",
        { expiresIn: 60 * 60 * 60 }
      );

      req.session.authorization = {
        accessToken,
        username,
      };

      return res.status(200).send("Customer successfully logged in.");
    } else {
      return res
        .status(208)
        .json({ message: "Invalid Login.Check username and password" });
    }
  } else {
    return res.status(400).json({ message: "Empty body" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  const filtered_books = Object.keys(books).filter((key) => key === isbn);

  if (filtered_books.length > 0) {
    const book = books[filtered_books[0]];
    const reviews = book.reviews;

    const review = req.body.review;
    const auth_username = req.session.authorization["username"];

    const auth_reviewed = reviews.filter(
      (review) => review.username === auth_username && review.text === review
    );

    if (auth_reviewed.length > 0) {
      auth_reviewed[0].text = review;
    } else {
      reviews.push({
        text: review,
        username: auth_username,
      });
    }

    return res
      .status(200)
      .send(
        `The review for the book with ISBN ${isbn} has been added/updated.`
      );
  } else {
    return res.status(404).json({ message: "No Reviews Found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
