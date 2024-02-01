import express, { json } from "express";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import {__dirname} from "./dirname.js"
import viewsRouter from "./routes/views.js"
import messageDao from "./daos/dbManager/message.dao.js"

import passport from "passport";
import sessionrouter from "./routes/session.router.js";
import userviews from "./routes/users.views.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./Config/passport.config.js";
import githubloginrouter from "./routes/github-login.views.router.js"

const app = express();
const port = 8080;

mongoose.connect('mongodb+srv://Lu0:Lu0@ecomerce.zb53nge.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('Connection success');
})
.catch(error => {
    console.error('Connection fail', error);
});


const httpServer = app.listen(port, () => console.log(`Server listening on port ${port}`));
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//handlbars config
app.engine("hbs",handlebars.engine({
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
}));

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`); 
app.use(express.static(`${__dirname}/public`));

app.use(session({

  store: MongoStore.create({
    mongoUrl:"mongodb+srv://Lu0:Lu0@ecomerce.zb53nge.mongodb.net/?retryWrites=true&w=majority", 
    ttl:10 * 60
  }),

  secret: "Th1s1sA5ecret",
  resave:false,
  saveUninitialized:true

}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/", viewsRouter); 
app.use("/api/products",productRouter);
app.use("/api/carts",cartRouter);
app.use("/users",userviews);
app.use("/api/sessions",sessionrouter);
app.use("/github", githubloginrouter);


// io.on('connection', (socket) => {
//   console.log('Nuevo cliente conectado');

//   socket.on('chat message', async (msg) => {
//     // Guardar el mensaje en la base de datos
//     try {
//       await messageDao.createMessage({ user: msg.user, message: msg.content });
//     } catch (error) {
//       console.log(error);
//     }

//     // Emitir el mensaje a todos los clientes conectados
//     io.emit('chat message', msg);
//   });
// });


io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("post_send", async (data) => {
    console.log(data);
    try {
      await manager.addProduct(data);
      io.emit("products", manager.getProducts()); 
    } catch (error) {
      console.log(error);
    }
  });

  socket.emit("products",manager.getProducts())
});