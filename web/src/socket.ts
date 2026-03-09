import { io } from "socket.io-client";

export const socket = io("https://kiosk-server.tomtiedemann.com/", {
    autoConnect: false,
});
