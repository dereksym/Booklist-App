// Book Class: Represents a Book
class Book {
    constructor(title, author, category, startDate, endDate){
        this.title = title;
        this.author = author;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#booklist');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.startDate}</td>
            <td>${book.endDate}</td>
            <td><button type="button" class="edit-button">Edit</button></td>
        `;

        list.appendChild(row);
    }

    static editBook(e) {
        if (e.classList.contains('edit-button')){
            e.style.display = 'none';
            const booklistElement = e.parentElement.parentElement.querySelectorAll('td');
            document.querySelector('.title').value = booklistElement[0].innerText;
            document.querySelector('.author').value = booklistElement[1].innerText;
            document.querySelector('.category').value = booklistElement[2].innerText;
            document.querySelector('.start-date').value = booklistElement[3].innerText;
            document.querySelector('.end-date').value = booklistElement[4].innerText;
    
            const buttonsTd = e.parentElement;
            const saveButtons = document.createElement('button');
            saveButtons.classList.add('save-button', 'skip');
            saveButtons.innerText = 'Save';
            const deleteButtons = document.createElement('button');
            deleteButtons.classList.add('delete-button', 'skip');
            deleteButtons.innerText = 'Delete';
            buttonsTd.append(saveButtons,deleteButtons);
        }
    }

    static deleteBook(e) {
        e.parentElement.parentElement.remove();
    }

    static saveBook(e) {
        const title = document.querySelector('.title').value;
        const author = document.querySelector('.author').value;
        const category = document.querySelector('.category').value;
        const startDate = document.querySelector('.start-date').value;
        const endDate = document.querySelector('.end-date').value;

        const booklistElement = e.parentElement.parentElement.querySelectorAll('td');
        booklistElement[0].innerText = title;
        booklistElement[1].innerText = author;
        booklistElement[2].innerText = category;
        booklistElement[3].innerText = startDate;
        booklistElement[4].innerText = endDate;

        const buttonsTd = e.parentElement;
        const editButton = document.querySelector('.edit-button');
        editButton.style.display = "";

        const deleteButton = document.querySelector('.delete-button')
        const saveButton = document.querySelector('.save-button')
        buttonsTd.removeChild(deleteButton);
        buttonsTd.removeChild(saveButton);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('.title').value = '';
        document.querySelector('.author').value = '';
        document.querySelector('.category').value = '';
        document.querySelector('.start-date').value = '';
        document.querySelector('.end-date').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(title, author, category) {
        const books =Store.getBooks();

        books.forEach((book, index) => {
            if(book.title === title && book.author === author && book.category === category) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit',(e) => {
    e.preventDefault();

    // Get Form Values
    const title = document.querySelector('.title').value;
    const author = document.querySelector('.author').value;
    const category = document.querySelector('.category').value;
    const startDate = document.querySelector('.start-date').value;
    const endDate = document.querySelector('.end-date').value;

    // Instatiate Book
    const book = new Book(title, author, category, startDate, endDate);

    if (title === '' || author === '' ||category === ''){
        UI.showAlert('Kindly fill in the required information.', 'error')
    } else {
        // Add Book 
        UI.addBookToList(book);
        Store.addBook(book);
        UI.showAlert('Book successfully added.', 'success')
    }

    // Clear Field
    UI.clearFields();
});

// Event: Edit Button
document.querySelector('#booklist').addEventListener('click', (e) => {
    UI.editBook(e.target);
});

// Event: Delete Book
document.querySelector('#booklist').addEventListener('click', (e) => {
    const title = e.target.parentElement.parentElement.children[0].innerText;
    const author = e.target.parentElement.parentElement.children[1].innerText;
    const category = e.target.parentElement.parentElement.children[2].innerText;
    if (e.target.classList.contains('delete-button')){
        UI.deleteBook(e.target);
        Store.removeBook(title, author, category);
        UI.clearFields();
        UI.showAlert('Book successfully deleted.', 'success');
    }
});

// Event: Edit and Save Book
document.querySelector('#booklist').addEventListener('click', (e) => {
    if (e.target.classList.contains('save-button')){
        UI.saveBook(e.target);
        UI.clearFields();
        UI.showAlert('Book saved.', 'success')
    }
});

// Toggle Edit Button when Click Outside
document.getElementsByTagName('body')[0].addEventListener('mousedown' , function(e) {
    const save_buttons = document.getElementsByClassName('save-button')
    if(!e.target.classList.contains('skip')) {
        for (let i = 0; i < save_buttons.length; i++) {
            const buttonsTd = save_buttons.item(i).parentElement;
            const deleteButton = buttonsTd.querySelector('.delete-button')
            const saveButton = buttonsTd.querySelector('.save-button')
            const editButton = buttonsTd.querySelector('.edit-button');
            editButton.style.display = "";
            buttonsTd.removeChild(deleteButton);
            buttonsTd.removeChild(saveButton);
        }
    }
});


