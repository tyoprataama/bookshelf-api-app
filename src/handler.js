//import module
const {
    nanoid
} = require('nanoid');
const books = require('./books');

//handler 1 'POST'
const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload; //payload used when we have 'POST' or 'PUT' request.
    // set up the unique number and date
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    // if statement for logic in 'POST' request
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }
    const finished = (pageCount === readPage);
    const newBooks = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        updatedAt,
        insertedAt,
    };
    books.push(newBooks); //add the newBooks variable to books.js
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    // if statement for logic when Posting the book
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    //else
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

//handler 2 'GET'
const getAllBooksHandler = (request, h) => {
    const {
        name,
        reading,
        finished
    } = request.query;
    let shelfbook = books;
    // if statenent for get the books
    if (name !== undefined) {
        shelfbook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    } else if (reading !== undefined) {
        shelfbook = shelfbook.filter((book) => book.reading === !!Number(reading));
    } else if (finished !== undefined) {
        shelfbook = shelfbook.filter((book) => book.finished === !!Number(finished));
    }
    //else
    const response = h.response({
        status: 'success',
        data: {
            books: shelfbook.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

//handler 3 'GET'
const getBooksByIdHandler = (request, h) => {
    const {
        id
    } = request.params;
    const book = books.filter((i) => i.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    //else
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

//handler 4 'PUT'
const editBooksByIdHandler = (request, h) => {
    const {
        id
    } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        } else if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }
        const finished = (pageCount === readPage);
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
            finished,
        };
        //else
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    //else
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

//handler 5 'DELETE'
const deleteBooksByIdHandler = (request, h) => {
    const {
        id
    } = request.params;
    const index = books.findIndex((h) => h.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    //else
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

//export all the handler
module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler,
};
