var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res) {
  const books = await Book.findAll();
  res.render('index',{title:"Books", books});
});

router.get('/books/new', async (req, res)=>{
  res.render('new-book', {title:"New Book", book:{title:"", author:"", genre:"", year:""}});
});

router.post('/books/new', async (req, res)=>{
  let book;
  try{
    await Book.create(req.body);
    res.redirect('/');
  }catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render(`new-book`, { title: "New book", book, errors: error.errors});
    } else {
      throw error;
    }
  }
});

router.get('/books/:id', async (req, res, next)=>{
  const book = await Book.findByPk(req.params.id)
  if(book)
  {
    res.render('update-book', {title:"Update book", id:req.params.id, book});
  }else{
    const error = new Error(`Oh no! Your request to the path: ${req.url} could not be fulfilled. Something may have been misspelled, or the path may not exist. Please try again or return to the home menue`);
    error.status = 404;
    error.url = req.url;
    next(error);
  }
});

router.post('/books/:id', async (req, res)=>{
  let book;
  try{
    book = await Book.findByPk(req.params.id);
    console.log(req.body)
    await book.update(req.body);
    res.redirect('/');
  }catch (error) {
    if(error.name === "SequelizeValidationError") {
      // book = await Book.build(req.body);
      res.render(`update-book`, { title: "Update book",id:req.params.id, book, errors: error.errors});
    } else {
      throw error;
    }
  }

});

router.get('/books/:id/delete', async (req, res)=>{
  const book = await Book.findByPk(req.params.id);
  res.render('delete', {title:"Delete", id:req.params.id, book})
});

router.post('/books/:id/delete', async (req, res, next)=>{
  const book = await Book.findByPk(req.params.id)
  if(book){
    await book.destroy();
    res.redirect('/');
  }else{
    const error = new Error(`Oh no! Your request to the path: ${req.url} could not be fulfilled. Something may have been misspelled, or the path may not exist. Please try again or return to the home menue`);
    error.status = 404;
    error.url = req.url;
    next(error);
  }
  
});




module.exports = router;
