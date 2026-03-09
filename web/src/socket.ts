import { io } from "socket.io-client";

export const socket = io("https://server-kiosk.tom.wdv1.nl", {
    autoConnect: false,
});
