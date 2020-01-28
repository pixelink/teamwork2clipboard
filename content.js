var ticketTitle;

setInterval(function () {
    if (window.location.href.indexOf("/desk/tickets/") > 0) {

        ticketTitle = document.title;
        ticketIdContainer = document.getElementsByClassName('ticket-id')[0];
        ticketId = ticketIdContainer.innerText;

        ticketIdContainer.addEventListener('click', function () {
            var titleId = ticketTitle;

            navigator.clipboard.writeText(titleId).then(function () {
                copyStringToClipboard(titleId);
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });


        });
    }
}, 2000);


function copyStringToClipboard(str) {
    // Temporäres Element erzeugen
    var el = document.createElement('textarea');
    // Den zu kopierenden String dem Element zuweisen
    el.value = str;
    // Element nicht editierbar setzen und aus dem Fenster schieben
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Text innerhalb des Elements auswählen
    el.select();
    // Ausgewählten Text in die Zwischenablage kopieren
    document.execCommand('copy');
    // Temporäres Element löschen
    document.body.removeChild(el);
}
