var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res) {
  const books = await Book.findAll();
  const page = {title:"Books", books};
  res.render('index',{page});
});

router.get('/books/new', async (req, res)=>{
  const page = {title:"New Book"};
  res.render('new-book', {page});
});

router.post('/books/new', async (req, res)=>{
  await Book.create(req.body);
  res.redirect('/');
});

router.get('/books/:id', async (req, res, next)=>{
  const book = await Book.findByPk(req.params.id)
  if(book)
  {
    const page = {title:"Update book", id:req.params.id, book}
    res.render('update-book', {page})
  }else{
    const error = new Error(`Oh no! Your request to the path: ${req.url} could not be fulfilled. Something may have been misspelled, or the path may not exist. Please try again or return to the home menue`);
    error.status = 404;
    error.url = req.url;
    next(error);
  }
});

router.post('/books/:id', async (req, res)=>{
  const book = await Book.findByPk(req.params.id);
  console.log(req.body)
  await book.update(req.body);
  res.redirect('/');
});

router.get('/books/:id/delete', async (req, res)=>{
  const book = await Book.findByPk(req.params.id);
  const page = {title:"Delete", id:req.params.id, book}
  res.render('delete', {page})
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
