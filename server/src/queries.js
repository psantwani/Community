/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-async-promise-executor */
const { Pool } = require("pg");
const { InvalidRequest } = require("base-api-io");
const rp = require("request-promise");
const convert = require("xml-js");
const isUUID = require('is-uuid');
const getUuid = require('uuid-by-string')

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "community",
  password: "postgres",
  port: 5432
});

async function createUser(params) {
  return new Promise((resolve, reject) => {
    console.log("Create new user - ", JSON.stringify(params));
    const { id, name, email, password, phone } = params;

    pool.query("INSERT INTO users VALUES ($1, $2, $3, $4, $5) RETURNING id", [id, name, email, password, phone], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result.rows[0].id);
    });
  });
}

async function getBook(bookId) {
  return new Promise(async (resolve, reject) => {
    console.log("Getting book - ", JSON.stringify(bookId));
    pool.query(`SELECT id FROM books WHERE id = '${bookId}'`, (error, results) => {
      if (error) {
        return reject(error);
      }
      console.log("Books: ", results.rows);
      if (results.rows.length > 0) {
        return resolve(results.rows[0].id);
      }
      return resolve(null);
    });
  });
}

async function createBook(params) {
  return new Promise((resolve, reject) => {
    console.log("Create new book - ", JSON.stringify(params));
    const { id, name, description, price, author } = params;
    const bookId = getUuid(id);

    const picture = "https://loremflickr.com/300/300/book";

    pool.query(
      "INSERT INTO books (id, name, description, picture, price, author) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [bookId, name, description, picture, price, author],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(result.rows[0].id);
      }
    );
  });
}

async function createBookIfNotExists(bookId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Create book if not exists: " + bookId);
      const bookUuid = getUuid(bookId);
      const bookExistsWithId = await getBook(bookUuid);
        if (bookExistsWithId) {
          return resolve(bookExistsWithId);
      }
      const book = await getBookDetailsFromThirdParty(bookId);
      if (book == null) {
        return reject("Book not found");
      }
      const savedBookId = await createBook(book);
      return resolve(savedBookId);
    } catch (err) {
      return reject(err);
    }
  });
}

async function createLocation(params) {
  return new Promise((resolve, reject) => {
    console.log("Create new location - ", JSON.stringify(params));
    const { title, description, latitude, longitude, posted_by: postedBy } = params;

    pool.query(
      "INSERT INTO locations (title, description, latitude, longitude, posted_by) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [title, description, latitude, longitude, postedBy],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result.rows[0].id);
      }
    );
  });
}

async function createItem(params) {
  return new Promise(async (resolve, reject) => {
    console.log("Create new item - ", JSON.stringify(params));
    const { book_id: bookId, location_id: locationId, user_id: userId } = params;
    pool.query(
      "INSERT INTO items (book_id, location_id, user_id) VALUES ($1, $2, $3) RETURNING id",
      [bookId, locationId, userId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result.rows[0].id);
      }
    );
  });
}

async function getFeed(params) {
  return new Promise(async (resolve, reject) => {
    console.log("Getting Feed - ", JSON.stringify(params));
    const { latitude, longitude } = params;

    if (!(latitude && longitude)) {
      return reject(
        new InvalidRequest({
          error: "Fields latitude and longitude are required"
        })
      );
    }

    pool.query(
      `SELECT items.id, books.name, books.author, books.description, books.picture, books.price FROM items 
    INNER JOIN books
    ON books.id = items.book_id
    INNER JOIN locations
    ON locations.id = items.location_id
    WHERE ST_DWithin(locations.geom::geography, ST_SetSRID(ST_MakePoint($1, $2),4326)::geography, 5 * 1000)
    AND items.available = true`,
      [longitude, latitude],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results.rows);
      }
    );
  });
}

async function createOrder(params) {
  return new Promise(async (resolve, reject) => {
    console.log("Create new order - ", JSON.stringify(params));
    const { item_id: itemId, user_id: userId, payment_link: paymentLink } = params;
    pool.query(
      "INSERT INTO orders (item_id, user_id, payment_link) VALUES ($1, $2, $3) RETURNING id",
      [itemId, userId, paymentLink],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result.rows[0].id);
      }
    );
  });
}

async function getOrders(id) {
  return new Promise(async (resolve, reject) => {
    console.log("Getting orders - ", JSON.stringify(id));
    let query;
    if (id) {
      query = `SELECT * FROM orders WHERE id = '${id}'`;
    } else {
      query = "SELECT * FROM orders";
    }
    pool.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results.rows);
    });
  });
}

async function getUserOrders(userId) {
  return new Promise(async (resolve, reject) => {
    console.log("Getting user orders - ", JSON.stringify(userId));
    pool.query(
      `SELECT orders.id, books.name, books.price, orders.status, orders.timestamp FROM orders 
    INNER JOIN items ON orders.item_id = items.id
    INNER JOIN books ON items.book_id = books.id
    WHERE orders.user_id = '${userId}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results.rows);
      }
    );
  });
}

async function getItems(id) {
  return new Promise(async (resolve, reject) => {
    console.log("Getting items - ", JSON.stringify(id));
    let query;
    if (id) {
      query = `SELECT * FROM items WHERE id = '${id}'`;
    } else {
      query = "SELECT * FROM items";
    }
    pool.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results.rows);
    });
  });
}

async function updateOrderStatus(params) {
  return new Promise(async (resolve, reject) => {
    console.log("Updating order status - ", JSON.stringify(params));
    const { id, status } = params;
    pool.query("UPDATE orders SET status = $2 WHERE id = $1", [id, status], error => {
      if (error) {
        return reject(error);
      }
      return resolve("OK");
    });
  });
}

async function updateItemAvailability(params) {
  return new Promise(async (resolve, reject) => {
    console.log("Updating item availability - ", JSON.stringify(params));
    const { id, available } = params;
    pool.query("UPDATE items SET available = $2 WHERE id = $1", [id, available], error => {
      if (error) {
        return reject(error);
      }
      return resolve("OK");
    });
  });
}

// PE - PENDING
// BO - BOOKED
// DV - DELIVERED
// RN - RETURNED
async function updateOrder(params) {
  return new Promise(async (resolve, reject) => {
    console.log("Updating order - ", JSON.stringify(params));
    const { id, status } = params;
    const orders = await getOrders(id);
    if (orders.length) {
      await updateOrderStatus(params);
      const order = orders[0];
      const availability = {
        PE: true,
        BO: false,
        DV: false,
        RN: true
      };
      await updateItemAvailability({ id: order.item_id, available: availability[status] });
      return resolve("OK");
    }
    return reject(new Error(`Order ${id} not found`));
  });
}

async function booksSearchUsingThirdParty(query) {
  return new Promise(async (resolve, reject) => {
    console.log("Searching books for query:", query);
    if (query == null) {
      return resolve(null);
    }
    rp(`https://www.goodreads.com/search/index.xml?key=VnkFH6vFUBYWJJOJpr76A&q=${encodeURIComponent(query)}`)
      .then(results => {
        console.log("Got results");
        let json = convert.xml2json(results, { compact: true, spaces: 2 });
        json = JSON.parse(json);
        if (json.GoodreadsResponse && json.GoodreadsResponse.search && json.GoodreadsResponse.search.results) {
          let { work } = json.GoodreadsResponse.search.results;
          if (!Array.isArray(work)) {
            work = {
              id: work.best_book.id._text,
              name: work.best_book.title._text || work.best_book.title._cdata,
              author: work.best_book.author.name._text,
              thumbnail: work.best_book.small_image_url._text,
              image: work.best_book.image_url._text
            };
          } else {
            work = work.map(item => ({
              id: item.best_book.id._text,
              name: item.best_book.title._text || item.best_book.title._cdata,
              author: item.best_book.author.name._text,
              thumbnail: item.best_book.small_image_url._text,
              image: item.best_book.image_url._text
            }));
          }
          return resolve(work);
        }
        return resolve(null);
      })
      .catch(err => reject(err));
  });
}

//id, name, description, picture, price, author

async function getBookDetailsFromThirdParty(bookId) {
  return new Promise(async (resolve, reject) => {
    console.log("Searching book details for:", bookId);
    if (bookId == null) {
      return resolve(null);
    }
    console.log(`https://www.goodreads.com/book/show/${bookId}.xml?key=VnkFH6vFUBYWJJOJpr76A`);
    rp(`https://www.goodreads.com/book/show/${bookId}.xml?key=VnkFH6vFUBYWJJOJpr76A`)
      .then(results => {
        console.log("Got results");
        let json = convert.xml2json(results, { compact: true, spaces: 2 });
        json = JSON.parse(json);
        if (json.GoodreadsResponse && json.GoodreadsResponse.book) {
          const { book } = json.GoodreadsResponse;
          let { id, title, isbn, image_url, small_image_url, description, authors } = book;
          authors = authors.author;
          let authorStr = "";       
          if (!Array.isArray(authors)) {
            authorStr = authors.name._text;
          } else{
            authors.forEach(author => {
              authorStr += author.name._text + ", ";
            });
            authorStr = authorStr.slice(0, -2);
          }          
          return resolve({
            id: id._text,
            name: title._text || title._cdata,
            description: description._cdata,
            picture: small_image_url._text,
            author: authorStr,
            price: Math.floor(1000 * Math.random(2)*100)/100
          });
        }
        return resolve(null);
      })
      .catch(err => {
        console.log(err);
        reject(err)}
      );
  });
}

async function getUserLocations(userId) {
  return new Promise(async (resolve, reject) => {
    console.log("Getting user locations - ", JSON.stringify(userId));
    pool.query(`SELECT id, title FROM locations WHERE posted_by = '${userId}'`, (error, results) => {
      if (error) {
        return reject(error);
      }
      console.log(results.rows);
      return resolve(results.rows);
    });
  });
}


module.exports = {
  createUser,
  createBook,
  createBookIfNotExists,
  createLocation,
  createItem,
  getFeed,
  createOrder,
  getOrders,
  getItems,
  updateOrderStatus,
  updateItemAvailability,
  updateOrder,
  getUserOrders,
  booksSearchUsingThirdParty,
  getUserLocations,
  getBookDetailsFromThirdParty,
  getBook
};
