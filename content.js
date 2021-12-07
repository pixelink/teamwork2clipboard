{
    const ticketIdClassName = 'ticket-id';
    const ticketTitleClassName = 'title__subject';
    const customerClassName = 'customer-fullname';
    const miteClassName = 'mite';

    const titlePrefix = 'Ihre Anfrage: ';
    const ticketIdPrefix = 'Ticket Nummer: ';
    const invoicePrefix = 'Anfrage von: ';


    // helper function to throttle the mutiple successive execution of callback
    // to only occur every wait milliseconds
    const throttle = (callback, wait) => {
        var timeout
        return function(...args) {
          if (timeout) return;
          timeout = setTimeout(() => (callback.apply(this, args), timeout=undefined), wait)
        }
    }

    // helper function to write the text to the computers clipboard
    const writeToClipboard = (text) => {
        navigator
            .permissions
            .query({ name: "clipboard-write" })
            .then(result => {
                if (["granted", "prompt"].includes(result.state)) {
                    navigator
                    .clipboard
                        .writeText(text)
                        .then(
                            () => {}, 
                            () => {
                                alert('Could not access clipboard')
                            }
                        )
                    ;
                }
            })
        ;
    }

    // return the ticket id element
    const getTicketId = () => {
        return document.querySelector(`.${ticketIdClassName}`);
    }
    // return the ticket title element
    const getTicketTitle = () => {
        return document.querySelector(`.${ticketTitleClassName}`);
    }
    // return the customer (ticket owner) element
    const getCustomer = () => {
        return document.querySelector(`.${customerClassName}`);
    }
    // return the mite element
    const getMite = () => {
        return document.querySelector(`.${miteClassName}`);
    }


    // Copy the contents of ticket title, ticket id and ticket owner
    // when clicked on the 'mite' button
    const onClick = (e) => {
        const mite = e.target.closest(`.${miteClassName}`)
        if (!mite) {
            return
        }
        const ticketId = getTicketId().innerText;
        const ticketTitle = getTicketTitle().innerText;
        const customer = getCustomer().innerText;
        writeToClipboard(
            `${titlePrefix}${ticketTitle}\n` + 
            `${ticketIdPrefix}${ticketId}\n` +
            `${invoicePrefix}${customer}\n`
        );
    }


    // Add the mite button, if not existing already
    const addMite = () => {
        if (!getMite()) {
            const div = document.createElement('button')
            div.attributes.type = "button"
            div.classList.add(miteClassName)
            div.innerText = 'mite';
            getTicketId().insertAdjacentElement('beforeBegin', div)
        }
    }

    // Add stylesheet to head
    document.head.insertAdjacentHTML("beforeend", 
`<style>
.${miteClassName} {
    color: #999;
    background-color: #f5f7fa;
    font-size: 18px;
    line-height: 25px;
    cursor: pointer;
    display: block;
    align-self: center;
    padding: 5px 10px;
    margin: -10px 15px -15px -15px;
    border: 1px rgba(0,0,0,.1) solid;
    border-radius: 3px;
    transition: all .1s ease-in-out;
}
.${miteClassName}:hover {
    box-shadow: inset 2px 2px 2px rgba(255,255,255,.3),inset -2px -2px 2px rgba(0,0,0,.2);
    background-color: rgba(245,247,250,.2);
}
.${miteClassName}:active {
    box-shadow: inset 2px 2px 2px rgba(0,0,0,.2),inset -2px -2px 2px rgba(255,255,255,.3);
    background-color: #3b93f7;
    color: white;
}
</style>`)


    // Observe every change in document
    const checkTicketId = (e) => {
        e.forEach(el => {
            // If the ticket id element is existing, add the mite element
            if (getTicketId()) {
                addMite();
            }
        })
    }

    const observer = new MutationObserver(throttle(checkTicketId, 500));
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(document.documentElement, config);

    document.documentElement.addEventListener('click', onClick);
}
