import app from "./app.ts";
import { initSocket } from "./utils/socket.ts";

const server = app.listen(3000);
const io = initSocket(server);
io.on('connection', (socket) => {
  console.log('User connected:');
});