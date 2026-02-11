import mysql from "mysql2/promise";
import { Server } from "socket.io";

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kiosk',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const io = new Server(3000, {
    cors: { origin: "*" },
});

let categories = [];
let products = [];

async function getCategories() {
    try {
        const [rows] = await pool.query("SELECT * FROM categories");
        categories = rows;
    } catch (err) {
        console.error("Database fout:", err);
    }
}

async function getProducts() {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        products = rows;
    } catch (err) {
        console.error("Database fout:", err);
    }
}

getCategories();
getProducts();

io.on("connection", (socket) => {
    console.log("Client connected");

    const sendProducts = products.map((product) => {
        return {
            product_id: product.product_id,
            category_id: product.category_id,
            image: product.image,
            name: product.name,
            description: product.description,
            price: product.price,
            kcal: product.kcal,
            diet_type: product.diet_type,
        };
    });

    socket.emit("products", sendProducts);
    socket.emit("categories", categories);
});