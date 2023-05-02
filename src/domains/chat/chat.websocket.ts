import { userService } from '@domains/user';
import { io } from 'server';

export const chatSocket = () => {   
     io.on("connection", (socket: any) => {
        
        socket.on("chat_with", async({userId}:{userId: string}) => {
            const chat: {id: string, messages?: [{senderId: string, createdAt: Date, message: string}]} = await userService.verifyChat(socket.user.userId, userId);
            socket.user.chatId = chat.id;            
            socket.join(chat.id);
            io.to(socket.id).emit("message history", {
                messages: chat.messages
            });
        });
    
        socket.on("send_message", async({message, createdAt}:{message:any, createdAt:any}) => {            
            await userService.postMessage(socket.user.userId, socket.user.chatId, {message, createdAt});
            socket.to(socket.user.chatId).emit("new message", {
                message: message,
            });
        });

    });
}