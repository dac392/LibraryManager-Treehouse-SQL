var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const {Op} = require('../models/index').Sequelize; 

/**
 * used to decide if the search query is properly formatted. 
 * */
function scan(str){
  const regex = /^(title|author|genre|year): ".+"( \^ (title|author|genre|year): ".+")?$/gi;
  console.log();
  if(!regex.test(str)){
    error = new Error(`Oh no! your search "${str}" is not properly formatted. Remember, you can use " ^ " to represent AND, and to use the format:\t <key> "<value>"`);
    throw error;
  }
}
/**
 * parses the query string for its components.
 * @param {String} str 
 * @returns json
 */
function parse(str){
  const arr = str.split(" ^ ");
  let title = "%";
  let author = "%";
  let genre = "%";
  let year = "%";
  for( let i = 0; i < arr.length; i++){
    let query = arr[i].split(":");
    let key = query[0];
    let value = query[1].replace(/\s+/g, ' ').trim();
    switch(key){
      case "title":
        title = (value.replace(/"+/g, ''));
        break;
      case "author":
        author = (value.replace(/"+/g, ''));
        break;
      case "genre":
        genre = (value.replace(/"+/g, ''));
        break;
      case "year":
        year = (value.replace(/"+/g, ''));
        break;
    }
  }
  return {title, author, genre, year};
}
/**
 * gets the subset of books to display
 * @param {json list} books 
 * @param {int} page 
 * @returns list of books
 */
function get_results(books, page){
  const perPage = 10;
  const start = (page*perPage)-perPage;
  const end = page*perPage;
  list = [];
  for(let i = 0; i < books.length; i++){
    if(i>=start && i<end){
      list.push(books[i]);
    }
  }
  return list;
}

/**
 * helper function to make a list of range of numbers
 * @param {int} start 
 * @param {int} end 
 * @returns int list
 */
function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}


/* GET home page. */
router.get('/', async function(req, res) {
  res.redirect('/1');
});

/**
 * GET route used for pagination
 */
router.get('/:id', async (req, res)=>{
  const list = await Book.findAll();
  const page = req.params.id;
  const books = get_results(list, page);
  const numbers = range(1, Math.ceil(list.length/10));
  res.render('index', {title:"Books", books, numbers, selected:page});
});

/** Search route*/
router.post('/search', async function(req, res){
  try{
    const str = req.body.search.toLowerCase();
    scan(str);
    const search = parse(str);
    const books =  await Book.findAll({
      where: {
        [Op.and]:[
          {
            title:{[Op.like]: `%${search.title}%`},
            author:{[Op.like]: `%${search.author}%`},
            genre:{[Op.like]: search.genre},
            year:{[Op.like]: search.year},
          }
        ]
      }
    });
    res.render('index',{title:"Search results", books, home: true});
  }catch(error){
    const books = await Book.findAll();
    res.render(`index`, { title: "Books", books, errors: [error]});
    
  }

});

/* GET new book page */
router.get('/books/new', async (req, res)=>{
  res.render('new-book', {title:"New Book", book:{title:"", author:"", genre:"", year:""}});
});

/* POST new book and send you back to / */
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

/* GET book/:id for update */
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

/* POST update */
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

/* GET delete confirmation page */
router.get('/books/:id/delete', async (req, res)=>{
  const book = await Book.findByPk(req.params.id);
  res.render('delete', {title:"Delete", id:req.params.id, book})
});

/* POST delete and redirect to / */
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
