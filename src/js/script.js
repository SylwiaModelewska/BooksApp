/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      books: '.books-list',
      bookImg: '.book__image',
      bookList: '.books-list',
      filters: '.filters'
    },
  };

  const classNames = {
    book: {
      favorite: 'favorite',
      hidden: 'hidden',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };
  
  /* --------------------------------------------------------------------------------- */

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.renderBooks();
      thisBooksList.initActions();
    }

    initData() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
      thisBooksList.booksContainer = document.querySelector(select.containerOf.books);
      thisBooksList.bookImgs = document.querySelector(select.containerOf.bookList);
      thisBooksList.filtersForm = document.querySelector(select.containerOf.filters);
    }

    renderBooks(){
      const thisBooksList = this;

      for(let book of thisBooksList.data){
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generatedHTML = templates.book(book);
        thisBooksList.booksContainer.appendChild(utils.createDOMFromHTML(generatedHTML));
      }

    }

    changeBookFavorite(bookImg){
      
      this.bookId = bookImg.getAttribute('data-id');
      
      if(!this.favoriteBooks.includes(this.bookId)){
        this.favoriteBooks.push(this.bookId);
        bookImg.classList.add(classNames.book.favorite);
      }
      else{
        this.favoriteBooks.splice(this.favoriteBooks.indexOf(this.bookId), 1);
        bookImg.classList.remove(classNames.book.favorite);
      }

      //console.log(this.favoriteBooks);
    }

    initActions(){
      const thisBooksList = this;

      thisBooksList.bookImgs.addEventListener('dblclick', function(event){
        event.preventDefault();
        if(event.target.offsetParent.classList.contains('book__image')){
          thisBooksList.changeBookFavorite(event.target.offsetParent);
        }
      });

      thisBooksList.filtersForm.addEventListener('click', function(event){
        if(event.target.name == 'filter'
            && event.target.tagName == 'INPUT'
            && event.target.type == 'checkbox'){
          
          if(event.target.checked){
            thisBooksList.filters.push(event.target.value);
          }
          else{
            thisBooksList.filters.splice(thisBooksList.filters.indexOf(event.target.value), 1);
          }
        }
        thisBooksList.filterBooks();
      });
    }

    filterBooks(){
      
      for(const book of this.data){

        let shouldBeHidden = false;

        for(const filter of this.filters) {
          if(!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }

        const filteredBook = document.querySelector('.book__image[data-id="' + book.id + '"]');

        if(shouldBeHidden){
          filteredBook.classList.add(classNames.book.hidden);
        }
        else{
          filteredBook.classList.remove(classNames.book.hidden); 
        }
      }
    }

    determineRatingBgc(rating){
      if(rating <= 6){
        return 'background: linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      }
      else if(rating <= 8){
        return 'background: linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      }
      else if(rating <= 9){
        return 'background: linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      }
      else{
        return 'background: linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }
    }

  }

  new BooksList();
}