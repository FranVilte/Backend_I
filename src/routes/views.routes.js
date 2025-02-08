import { Router } from "express";
import { productRouter } from "./products.routes.js";
import { productService } from "../services/products.service.js";
import { cartService } from "../services/carts.service.js";

export const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
    const { page = 1, limit = 5 } = req.query;

    try {
    const products = await productService.getAll(page, limit);    
    
    res.render("home", {products});   

} catch (error) {    
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al cargar los productos.");
}    
});

viewRouter.get("/carts", async (req, res) => {
    const { page = 1, limit = 5 } = req.query;

    try {
    const carts = await cartService.getAll(page, limit);    
    
    res.render("carts", {carts});   
    
} catch (error) {    
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al cargar los productos.");
}    
});

viewRouter.get("/carts/:id", async (req, res) => {

    const {id} = req.params;

    try {
    const cart = await cartService.getByID(id);   
    
    res.render("cartDetail", {cart});   
    
} catch (error) {    
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al cargar los productos.");
}    
});

viewRouter.get("/products", (req, res) => {    
    res.render("realTimeProducts");
});