const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');

}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';


const socket = io();



socket.on('connect', () => {
 
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
     
        btnAtender.disabled = true;
    
});

socket.on('ultimo-ticket', (ultimo) => {
    //lblNuevoTicket.innerText = 'Ticket ' + ultimo;
});

socket.on('tickets-pendientes', (ticketsPendientes) => {
    if (ticketsPendientes === 0) {
        lblPendientes.innerText = 0;
        divAlerta.style.display = '';
    }
    else{
        lblPendientes.innerText = ticketsPendientes;
        divAlerta.style.display = 'none';
    }
});



btnAtender.addEventListener( 'click', () => {

    const payload = {escritorio};

    socket.emit( 'atender-ticket', payload, ( {ok, ticket, msg} ) => {
            
            if (!ok) {
                lblTicket.innerText = 'Nadie';
                divAlerta.style.display = '';
                return;
            }
    
            lblTicket.innerText = 'Ticket ' + ticket.numero;
            
        });


});