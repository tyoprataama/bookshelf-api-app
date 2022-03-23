const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`The server has been run on ${server.info.uri}`);
}
init();

//NOTE!!
// When I run this code i'm using the 127.0.0.1:5000 instead of using the localhost:5000.
// That's because i'm using mac and when im using localhost: 5000 i got some error message which is access was denied.
// And that's why, when i testing in up in postman i changed the localhost to 127.0.0.1 and that's allready good.
// I make this note for just in case when you mr / mrs run my code in postman and got some failed test,
// I suggest you to change the localhost to 127.0 .0 .1, IF there 's some failed test, because i had 34 pass and 0 fail in my desk.
// Thankyou, ^ 0 ^