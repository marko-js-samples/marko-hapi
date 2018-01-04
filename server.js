'use strict';
const Hapi = require('hapi');
const Marko = require('marko')
const Vision = require('vision')
require('marko/node-require');

const port = 3050

const server = Hapi.server({
  port: port
})

const start = async() => {
  await server.register(Vision)
  server.views({
    relativeTo: __dirname,
    engines: {
      marko: {
        compile: (src, options) => {
          const opts = {
            preserveWhitespace: true,
            writeToDisk: false
          };
          const template = Marko.load(options.filename, opts);
          return (context) => {
            return template.renderToString(context);
          };
        }
      }
    },
    path: 'views'
  }) //end views

  server.route({
    path: '/',
    method: 'GET',
    handler: (req, h) => {
      return h.view('index', {
        name: 'Frank',
        count: 30,
        colors: ['red', 'green', 'blue']
      })
    }
  })
  await server.start()
  console.log("Hapi server running on %s", server.info.uri)
}
start()