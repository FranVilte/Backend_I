import express from "express";
import path from "path";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import morgan from "morgan";
import mongoose from "mongoose";

import { productRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/carts.routes.js";
import { viewRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

import { productService } from "./services/products.service.js";

import { __dirname } from "./dirname.js";

import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access"


const app = express();
const PORT = 8080;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
)

app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

app.use("/", viewRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

mongoose
    .connect("")
    .then(() => {
        console.log("Conectado con MongoDB");
    }).catch((error) => {
        console.log("Error en la conexion con MongoDB", error);
        
    })

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export const io = new Server(server)

io.on("connection", (socket) => {
    console.log("New Client Connected:", socket.id);    

    socket.emit("init", productService.products)    
    
})