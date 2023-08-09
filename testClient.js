let test = {
    http: 'https://',
    test: 'sdfsdf',
    asdf: "asdfasdf"
}

function ntfCallback(msg) {
    switch (msg.channel) {
        case 'new_trade':
            let payload = JSON.parse(msg.payload);
            longPoll.publish("/trades", payload);
            break;
        default:
            console.log(`Message from unexpected channel: ${msg.channel}`)
    }
}