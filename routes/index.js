var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const books = await Book.findAll();
  const page = {title:"Books", books};
  res.render('index',{page});
});

router.get('/books', async (req, res)=>{

});

router.get('/books/new', async (req, res)=>{
  const page = {title:"New Book"};
  res.render('new-book', {page});
});

router.post('/books/new', async (req, res)=>{
  await Book.create(req.body);
  res.redirect('/');
});

router.get('/books/:id', async (req, res)=>{
  const book = await Book.findByPk(req.params.id)
  console.log(req.params.id);
  const page = {title:"Update book", id:req.params.id, book}
  res.render('update-book', {page})
});

router.post('/books/:id', async (req, res)=>{
  const book = await Book.findByPk(req.params.id);
  console.log(req.body)
  await book.update(req.body);
  res.redirect('/');
});

router.post('/books/:id/delete', async (req, res)=>{
  
});




module.exports = router;
