const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({
        message: "Customer successfully registered. Now you can login.",
      });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "username &/ password are not provided" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const filtered_books = Object.keys(books).filter((key) => key === isbn);

  if (filtered_books.length > 0) {
    const book = books[filtered_books[0]];
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "No Books Found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const author_books = Object.values(books).filter(
    (book) => book.author === author
  );

  if (author_books.length > 0) {
    return res.status(200).json({
      booksbyauthor: author_books,
    });
  } else {
    return res.status(404).json({ message: "No Books Found." });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;

  const filtered_books = Object.values(books).filter(
    (book) => book.title === title
  );

  if (filtered_books.length > 0) {
    return res.status(200).json({
      booksbytitle: filtered_books,
    });
  } else {
    return res.status(404).json({ message: "No Books Found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const filtered_books = Object.keys(books).filter((key) => key === isbn);

  if (filtered_books.length > 0) {
    const book = books[filtered_books[0]];
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No Reviews Found" });
  }
});

module.exports.general = public_users;
