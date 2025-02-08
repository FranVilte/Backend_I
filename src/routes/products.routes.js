import { Router } from "express";
import { productService } from "../services/products.service.js";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {

    const products = await productService.getAll()
    
    res.status(200).json(products);
});

productRouter.get("/:id", async (req, res) => {
    const {id} = req.params;

    const product = await productService.getByID({id});

    if(!product){
        return res.status(404).json({ error: "El producto no existe" });
    }
    
    res.status(200).json(product);
});

productRouter.post("/", async (req, res) => {
    const { 
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails } = req.body;    

    let newStatus;
    let newthumbnails;

    if(!title) return res.status(400).json({ error: "El titulo es requerido" });

    if(!description) return res.status(400).json({ error: "La descripcion es requerida" });

    if(!code) return res.status(400).json({ error: "El code es requerido" });

    if(isNaN(Number(price))) return res.status(400).json({ error: "El precio es requerido en formato numerico" });    

    if (status === undefined || status === null || status === '') {
        newStatus = true;
      }

      newStatus = newStatus ? newStatus : status;
      console.log(newStatus);
      
    if(typeof newStatus !== "boolean") return res.status(400).json({ error: "El campo status debe ser un booleano" });    

    if(isNaN(Number(stock))) return res.status(400).json({ error: "El stock es requerido en formato numerico" });

    if(!category) return res.status(400).json({ error: "La categoria es requerida" });

    if (thumbnails === undefined || thumbnails === null || thumbnails === "") {
        newthumbnails = [];
      }
      
      newthumbnails = newthumbnails ? newthumbnails : thumbnails;
      
    if(!Array.isArray(newthumbnails)) return res.status(400).json({ error: "El campo thumbnails debe ser un array" });                

    try {
        const product = await productService.create({
            title,
            description,
            code,
            price,
            "status": newStatus,
            stock,
            category,
            "thumbnails": newthumbnails});

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({ message: "Error de Servidor"});
    }

});

productRouter.put("/:id", async (req, res) => {
    const { id } = req.params;

    const { 
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails } = req.body;

        let verificaPrecio;
        let verificaStock;
        let verificaStatus;
        let verificathumbnails;

        if (price === undefined || price === null) {
            verificaPrecio = 1;
        }                

        if(!verificaPrecio) if(isNaN(Number(price))) return res.status(400).json({ error: "El precio debe ser en formato numerico" });

        if (stock === undefined || stock === null) {
            verificaStock = 1;
        }       

        if(!verificaStock) if(isNaN(Number(stock))) return res.status(400).json({ error: "El stock debe ser en formato numerico" });

        if (status === undefined || status === null) {
            verificaStatus = 1;
        }

        if(!verificaStatus) if(typeof status !== "boolean") return res.status(400).json({ error: "El campo status debe ser un booleano" });    
        

        if (thumbnails === undefined || thumbnails === null) {
            verificathumbnails = 1;
        }            
        
        if(!verificathumbnails) if(!Array.isArray(thumbnails)) return res.status(400).json({ error: "El campo thumbnails debe ser un array" });

    try {
        const product = await productService.update({
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails});

        if(!product) res.status(404).json({ message: "El producto no se encuenta" });

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ message: "Error de Servidor" });
    }
    
});

productRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productService.delete(id);
        
        if(!product) res.status(404).json({ message: "El producto no se encuenta" });

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ message: "Error de Servidor" });
    }
});