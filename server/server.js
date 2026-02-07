import { Server } from "socket.io";

const io = new Server(3000, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("new-order", (order) => {
        io.emit("order-update", order);
    });
});