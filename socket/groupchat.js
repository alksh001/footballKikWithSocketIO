module.exports = function (io, Users)
{
    const users = new Users();
    // to listen events use io.on. 
    io.on('connection', (socket) =>
    {

        console.log("user Connected");

        socket.on('join', (params, callback) =>
        {
            // connecting socket to a particular channel
            socket.join(params.room);

            users.AddUserData(socket.id, params.name, params.room);

            io.to(params.room).emit('usersList', users.GetUsersList(params.room));
            console.log(users);

            callback();
        })

        // getting emmitted message from the client side
        socket.on('createMessage', (message, callback) =>
        {
            console.log({ message });

            // emit a message/event to all clients and sender connected to a particular channel
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.from
            });
            callback();
        });

        socket.on('disconnect', () =>
        {
            var user = users.RemoveUser(socket.id);
            console.log('in disconnect', user);

            if (user)
            {
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        })
    });
};