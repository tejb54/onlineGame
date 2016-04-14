/**
 * Created by Tobias on 2016-04-13.
 */

function myFunction(){
    socketChat.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
}

socketChat.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});