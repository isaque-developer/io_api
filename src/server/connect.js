export default ( WebSocketServer, ws, createHash, { checkOrigin, key, port }) => {

    const
        server = new WebSocketServer({ port }),
        credential = createHash( 'sha1' ).update( key ).digest( 'hex' )

    server.on('connection', client => {

        if( client._socket.closed ) return

        client.on('message', ({ byteLength }) => {

            if( !byteLength ){

                client.lastPing = new Date().getTime()
                return
            }
            return client.close( 1008 )
        })
        client.send(ws.v.send)
    })

    server.on('headers', ( headersResponse, { client, headers: {
                origin, 'sec-websocket-protocol': protocol
    }}) => {

        if( protocol != credential || origin != checkOrigin ){

            client.write('HTTP/1.1 401 Unauthorized')
            client.destroy()
        }
    })

    return server
}