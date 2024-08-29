// const { log } = require("async");
// const users = require("../../../models/users");

$(document).ready(function ()
{
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();

    // listening to a connected socket event
    socket.on('connect', function ()
    {
        console.log("WOW! user connected");

        var params = { room, name: sender };
        socket.emit('join', params, function ()
        {
            console.log("User Joined the room");
        });
    });

    socket.on('usersList', function (user)
    {
        var ol = $('<ol></ol>');
        for (let i = 0; i < user.length; i++)
        {
            ol.append('<p><a id= "val" data-toggle= "modal" data-target="#myModal">' + user[i] + '</a></p>');
        };
        console.log({ length: user.length })
        $('#numValue').text('(' + user.length + ')')

        $('#users').html(ol);
    });

    socket.on('newMessage', function (data)
    {
        var template = $("#message-template").html();
        var messages = Mustache.render(template, {
            text: data.text,
            sender: data.from
        });
        $("#messages").append(messages)
    });

    $('#message-form').on('submit', function (e)
    {
        e.preventDefault();

        // Getting data from input field
        var msg = $('#msg').val();

        socket.emit('createMessage', {
            text: msg,
            room,
            from: sender
        }, function ()
        {
            $('#msg').val('');
        });
    });
});