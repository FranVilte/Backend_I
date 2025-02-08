import { Router } from "express";
import { cartService } from "../services/carts.service.js";

export const cartRouter = Router();

cartRouter.get("/:id", async (req, res) => {

    const {id} = req.params;

    const cart = await cartService.getByID(id);

    if(!cart) return res.status(404).json({error: "El carrito no existe"});

    res.status(200).json(cart);
});

cartRouter.post("/", async (req, res) => {

    try {

        const cart = await cartService.create();

        res.status(201).json(cart);

    } catch (error) {

        console.error("Error al crear el carrito");
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {

    const {cid, pid} = req.params;

    try {

        const cart = await cartService.insertProduct(cid, pid);

        res.status(201).json(cart);

    } catch (error) {

        console.error("Error al crear el carrito");
    }
});

/*
cartRouter.put("/:id", async (req, res) => {

    const {id} = req.params;

    const products = req.body;

    try {                

        if(!products.id) return res.status(400).json({ error: "El ID es requerido" });        

        if(isNaN(Number(products.quantity))) return res.status(400).json({ error: "La cantidad es requerida en formato numerico" });    

        const cart = await cartService.update({id, products});

        if(!cart) res.status(404).json({ message: "El carrito no se encuentra" });

        res.status(200).json(cart)

    } catch (error) {        
        
        console.error("Error de Servidor");
        
    }

});
*/
cartRouter.put("/:cid/products/:pid", async (req, res) => {

    const {cid, pid} = req.params;

    const quantity = req.body;

    try {                

        const cart = await cartService.update(cid, pid, quantity);

        if(!cart) return res.status(404).json({ message: "El carrito no se encuentra" });

        res.status(200).json(cart)

    } catch (error) {        
        
        console.error("Error de Servidor");
        
    }

});


cartRouter.delete("/:cid/products/:pid", async (req, res) => {

    const {cid, pid} = req.params;

    try {                

        const cart = await cartService.deleteProductById(cid, pid);

        if(!cart) return res.status(404).json({ message: "El carrito no se encuentra" });

        res.status(200).json(cart)

    } catch (error) {        
        console.log(error);
        
        console.error("Error de Servidor");
        
    }

});

cartRouter.delete("/:cid", async (req, res) => {

    const {cid} = req.params;

    try {                

        const cart = await cartService.deleteProducts(cid);

        if(!cart) return res.status(404).json({ message: "El carrito no se encuentra" });

        res.status(200).json(cart)

    } catch (error) {        
        console.log(error);
        
        console.error("Error de Servidor");
        
    }

});