//const {config} = require('dotenv')
const express = require('express');
const {connectionSocket} = require('./utils/soket.io')
const server = express();
const handlebars = require('express-handlebars');
const productsRouteBd = require('./routes/products.router')
const cartsRouteBd = require('./routes/carts.router')
const viewRoute = require('./routes/views.route')
const chatsRouter = require('./routes/chats.router')
const sessionRoute = require('./routes/session.route');
const  initPassaport  = require('./utils/passaport.config');
const passport = require('passport');
const cookie = require('cookie-parser');
const {PORT, MONGODBURL } = require('./config/config');
const mdwError = require('./utils/middleware/errors');
const {mdwLooger, logger} = require('./config/config.winston')
const loggerTest = require('./controller/logger.controller');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger')


if (MONGODBURL) import('./config/config.db.js');

const PORT_APP = Number(PORT) || 8080;

const httpServer = server.listen(PORT_APP, () => 
    logger.debug(`🔥 Server started on port http://localhost:${PORT_APP}`),
)

//handlerbars
server.engine('handlebars', handlebars.engine());
server.set('views', __dirname + '/views');
server.set('view engine', 'handlebars');

// passport 
initPassaport();
server.use(passport.initialize());
server.use(cookie())
server.use(passport.session())

//Swagger

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

//express
server.use(express.static(__dirname+'/public'));
server.use(express.json())
server.use(express.urlencoded({extended:true}))

//winston looger
server.use(mdwLooger)

//rutas

server.use("/", viewRoute);
server.use("/api/products/", productsRouteBd );
server.use("/api/carts/", cartsRouteBd );
server.use("/api/chats/", chatsRouter );
server.use('/api/session', sessionRoute)
server.use('/loggerTest', loggerTest )

//middlewares
server.use(mdwError)


connectionSocket (httpServer);






