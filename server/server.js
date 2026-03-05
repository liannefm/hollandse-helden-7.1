import mysql from "mysql2/promise";
import { Server } from "socket.io";
import 'dotenv/config';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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


const connectedClients = {};

function broadcastToStatusScreens(event, data) {
    if (connectedClients["statusOrder"]) {
        connectedClients["statusOrder"].forEach((s) => {
            s.emit(event, data);
        });
    }
}

function broadcastToManagementScreens(event, data) {
    if (connectedClients["orderManagement"]) {
        connectedClients["orderManagement"].forEach((s) => {
            s.emit(event, data);
        });
    }
}

async function getActiveOrders() {
    try {
        const [rows] = await pool.query(
            `SELECT o.order_id, o.pickup_number, o.order_status_id, os.description as status_description, o.price_total, o.datetime
             FROM orders o
             JOIN order_status os ON o.order_status_id = os.order_status_id
             WHERE o.order_status_id IN (1, 2, 3, 4)
             ORDER BY o.datetime ASC`
        );
        return rows;
    } catch (err) {
        console.error("Failed to fetch active orders:", err);
        return [];
    }
}

io.on("connection", async (socket) => {
    const screenType = socket.handshake.auth.screenType;

    if (screenType) {
        if (!connectedClients[screenType]) {
            connectedClients[screenType] = [];
        }
        connectedClients[screenType].push(socket);
    }

    console.log(`Client connected: ${socket.id} (screenType: ${screenType})`);

    if (screenType === "statusOrder") {
        const activeOrders = await getActiveOrders();
        socket.emit("active_orders", activeOrders);
    }

    if (screenType === "board") {
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

        socket.on("get_product_languages", async (language) => {
            console.log(`Received request for product languages in: ${language}`);
            try {
                const [rows] = await pool.query(
                    'SELECT product_id, language, name, description FROM product_languages WHERE language = ?',
                    [language]
                );

                const data = {
                    [language]: {}
                };
                
                rows.forEach((row) => {
                    data[language][row.product_id] = {
                        name: row.name,
                        description: row.description,
                    };
                });

                socket.emit("product_languages", data);
            } catch (err) {
                console.error("Failed to fetch product languages:", err);
            }
        });

        socket.on("get_category_languages", async (language) => {
            console.log(`Received request for categorie languages in: ${language}`);
            try {
                const [rows] = await pool.query(
                    'SELECT category_id, language, name FROM category_languages WHERE language = ?',
                    [language]
                );

                const data = {
                    [language]: {}
                };
                
                rows.forEach((row) => {
                    data[language][row.category_id] = {
                        name: row.name
                    };
                });

                socket.emit("category_languages", data);
            } catch (err) {
                console.error("Failed to fetch categorie languages:", err);
            }
        });


        socket.on("create_order", async (orderData) => {
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                const [lastOrder] = await connection.query(
                    'SELECT pickup_number FROM orders ORDER BY order_id DESC LIMIT 1'
                );
                let lastPickupNumber = lastOrder.length > 0 ? lastOrder[0].pickup_number : 0;
                let newPickupNumber = (lastPickupNumber % 99) + 1;

                const [orderResult] = await connection.query(
                    'INSERT INTO orders (order_status_id, pickup_number, price_total) VALUES (?, ?, ?)',
                    [1, newPickupNumber, orderData.totalPrice]
                );
                const orderId = orderResult.insertId;

                if (orderData.items && Array.isArray(orderData.items)) {
                    for (const item of orderData.items) {
                        await connection.query(
                            'INSERT INTO order_product (order_id, product_id) VALUES (?, ?)',
                            [orderId, item.product_id]
                        );
                    }
                }

                await connection.commit();

                console.log(`Order created: ID ${orderId}, Pickup #${newPickupNumber}`);

                socket.emit('order_created', { orderId, pickupNumber: newPickupNumber });

                const newOrder = {
                    order_id: orderId,
                    pickup_number: newPickupNumber,
                    order_status_id: 1,
                    status_description: 'Started',
                    price_total: orderData.totalPrice,
                    datetime: new Date().toISOString(),
                };
                broadcastToStatusScreens('new_order', newOrder);
                broadcastToManagementScreens('new_order', newOrder);
            } catch (err) {
                await connection.rollback();
                console.error("Order creation failed:", err);
                socket.emit('order_error', { message: 'Failed to create order' });
            } finally {
                connection.release();
            }
        });
    }

    if (screenType === "orderManagement") {
        const activeOrders = await getActiveOrders();
        socket.emit("active_orders", activeOrders);

        socket.on("get_order_details", async ({ order_id }) => {
            try {
                const [products] = await pool.query(
                    `SELECT p.product_id, p.name, p.price, p.image, COUNT(*) as quantity
                     FROM order_product op
                     JOIN products p ON op.product_id = p.product_id
                     WHERE op.order_id = ?
                     GROUP BY p.product_id, p.name, p.price, p.image`,
                    [order_id]
                );
                socket.emit("order_details", { order_id, products });
            } catch (err) {
                console.error("Failed to fetch order details:", err);
            }
        });

        socket.on("update_order_status", async ({ order_id, status_id }) => {
            try {
                await pool.query(
                    'UPDATE orders SET order_status_id = ? WHERE order_id = ?',
                    [status_id, order_id]
                );

                const [[updatedOrder]] = await pool.query(
                    `SELECT o.order_id, o.pickup_number, o.order_status_id, os.description as status_description, o.price_total, o.datetime
                     FROM orders o
                     JOIN order_status os ON o.order_status_id = os.order_status_id
                     WHERE o.order_id = ?`,
                    [order_id]
                );

                if (updatedOrder) {
                    broadcastToStatusScreens('order_updated', updatedOrder);
                    broadcastToManagementScreens('order_updated', updatedOrder);
                    console.log(`Order ${order_id} status updated to ${status_id}`);
                }
            } catch (err) {
                console.error("Failed to update order status:", err);
            }
        });
    }

    socket.on("disconnect", () => {
        if (screenType && connectedClients[screenType]) {
            connectedClients[screenType] = connectedClients[screenType].filter((s) => s.id !== socket.id);
        }
        console.log(`Client disconnected: ${socket.id} (screenType: ${screenType})`);
    });
});
