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

    // @ToDo clipboard-write wird in FF nicht unterstützt
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1560373
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write

    const writeToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            console.info('Copied the text to the clipboard')
        } catch(err) {
            console.error('Async: Could not copy text to clipboard: ', err);
        }
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
