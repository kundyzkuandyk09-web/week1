const myLibrary = [];

function Book(title, author, pages, read) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  return book;
}

const libraryEl = document.querySelector("#library");

function displayBooks() {
  libraryEl.innerHTML = "";

  if (myLibrary.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No books yet. Click “New Book” to add one.";
    libraryEl.appendChild(empty);
    return;
  }

  myLibrary.forEach((book) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = book.id; 

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `by ${book.author}`;

    const pages = document.createElement("p");
    pages.textContent = `${book.pages} pages`;

    const status = document.createElement("p");
    status.className = `status ${book.read ? "read" : "unread"}`;
    status.textContent = book.read ? "Read" : "Not read yet";

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-btn";
    toggleBtn.textContent = "Toggle read";

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";

    actions.append(toggleBtn, removeBtn);
    card.append(title, author, pages, status, actions);
    libraryEl.appendChild(card);
  });
}


libraryEl.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;

  const id = card.dataset.id;

  if (event.target.classList.contains("remove-btn")) {
    const index = myLibrary.findIndex((book) => book.id === id);
    if (index !== -1) myLibrary.splice(index, 1);
    displayBooks();
  }

  if (event.target.classList.contains("toggle-btn")) {
    const book = myLibrary.find((book) => book.id === id);
    if (book) book.toggleRead();
    displayBooks();
  }
});


const dialog = document.querySelector("#book-dialog");
const form = document.querySelector("#book-form");
const newBookBtn = document.querySelector("#new-book-btn");
const cancelBtn = document.querySelector("#cancel-btn");

newBookBtn.addEventListener("click", () => dialog.showModal());

cancelBtn.addEventListener("click", () => {
  form.reset();
  dialog.close();
});

form.addEventListener("submit", (event) => {

  const data = new FormData(form);
  addBookToLibrary(
    data.get("title").trim(),
    data.get("author").trim(),
    Number(data.get("pages")),
    data.get("read") === "on"
  );

  displayBooks();
  form.reset();
  dialog.close();
});

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);
addBookToLibrary("Atomic Habits", "James Clear", 320, false);
addBookToLibrary("Dune", "Frank Herbert", 412, false);

displayBooks();
