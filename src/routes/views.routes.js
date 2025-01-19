import { Router } from "express";
import { productRouter } from "./products.routes.js";
import { productService } from "../services/products.service.js";

export const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
try {
    const products = await productService.getAll();    
    
    res.render("home", {products});   
} catch (error) {    
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al cargar los productos.");
}    
});

viewRouter.get("/products", (req, res) => {    
    res.render("realTimeProducts");
});