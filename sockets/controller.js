const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();


const emitirPendientes = (socket) => {
    socket.emit('tickets-pendientes', ticketControl.tickets.length);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
}



const socketController = (socket) => { 

    
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    emitirPendientes(socket);




    

    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        emitirPendientes(socket);
        callback( siguiente );
    
    }
    );

    socket.on('atender-ticket', ( {escritorio}, callback ) => {
        //TODO Notidicar cambios en los ultimos 4

        console.log(escritorio);
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });

        }
        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        emitirPendientes(socket);

        if(!ticket){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        }
        else{
            callback({
                ok: true,
                ticket
            });
        }
    });
}



module.exports = {
    socketController
}

