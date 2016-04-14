module.exports = function (io) {

    
    
    io.on('connection',function (socket) {
        console.log('Connected to chat');

        socket.on('chat message',function (message){
            io.emit('chat message',message + ' from: ' + socket.id);
        });

        socket.on('disconnect',function(){

        });

    });
};