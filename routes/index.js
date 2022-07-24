var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const {Op} = require('../models/index').Sequelize; 

function scan(str){
  const regex = /^(title|author|genre|year): ".+"( \^ (title|author|genre|year): ".+")?$/gi;
  console.log();
  if(!regex.test(str)){
    error = new Error(`Oh no! your search "${str}" is not properly formatted. Remember, you can use " ^ " to represent AND, and to use the format:\t <key> "<value>"`);
    throw error;
  }
}
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


/* GET home page. */
router.get('/', async function(req, res) {
  const books = await Book.findAll();
  res.render('index',{title:"Books", books});
});

/* Search */
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
    // console.dir(books);
    res.render('index',{title:"Search results", books, home: true});
  }catch(error){
    // console.dir(error.name);
    // console.dir(error.message);
    const books = await Book.findAll();
    res.render(`index`, { title: "Books", books, errors: [error]});
    
  }

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
