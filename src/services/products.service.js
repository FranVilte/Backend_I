import fs from "node:fs";
import {v4 as uuid} from "uuid";
import { io } from "../server.js";
import { productModel } from "../models/product.model.js";

const mongoURI = "mongodb+srv://francovilte:a5fDKqz0dzjKEqB6@cluster0.8q454.mongodb.net/"

/**
 * @param { path } path - Path del archivo donde se guardan los productos
 */

class ProductService {

    constructor(page = 1, limit = 5) {
        this.products = [];  
        this.docs = {};
        this.getPaginatedProducts(page, limit); 
      }

    async getPaginatedProducts(page = 1, limit = 5) {
    try {
        const result = await productModel.paginate({}, { page, limit });

        this.docs = result;
        this.products = result.docs; 

    } catch (error) {
        console.error('Error al obtener productos paginados:', error);
        }
    }

    /*path;
    products = [];

    constructor(path) {
        this.path = path;

        if(fs.existsSync(path)){
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"))
            } catch (error) {
                this.products = []
            }
        } else {
            this.products = []
        }         
    }*/

    /**
     * 
     * @returns {Object} - Devuelve todos los productos
     */
    async getAll(page = 1, limit = 5){
        
        await this.getPaginatedProducts(page, limit);

        return this.docs;
    }

    /**
     * 
     * @param {id} - id del producto
     * @returns {Object} - Devuelve el producto seleccionado
     */
    async getByID({ id }){;
        
        const product = this.products.find((product) => product.id === id)
        
        return product;
    }

    async create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }){
        //const id = uuid();

        price = Number(price);
        stock = Number(stock);

        const product = {
            //id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }       

        //this.products.push(product)

        try {
            //io.emit("new-product", product);
            //await this.saveOnFile();                         
            
            const newProduct = new productModel(product);

            const savedProduct = await newProduct.save();

            return savedProduct;

        } catch (error) {
            console.error("Error al guardar el archivo")
        }        
    }

    async update({
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }){
        const product = this.products.find((product) => product.id === id);

        if(!product){
            return null;
        }

        price = price ? Number(price) : price;
        stock = stock ? Number(stock) : stock;

        product.title = title ??  product.title;
        product.description = description ??  product.description;
        product.code = code ??  product.code;
        product.price = price ??  product.price;
        product.status = status ??  product.status;
        product.stock = stock ??  product.stock;
        product.category = category ??  product.category;
        product.thumbnails = thumbnails ??  product.thumbnails;

        //const index = this.products.findIndex((product) => product.id === id );

        //this.products[index] = product;

        try {
            /*io.emit("new-product", product);
            await this.saveOnFile();*/

            const result = await productModel.findOneAndUpdate(
                { _id: product.id },  
                product,  
                { new: true } 
              );

            return result;    

        } catch (error) {
            console.error("Error al eliminar el archivo");
        } 

    }

    async delete(id){
        const product = this.products.find((product) => product.id === id );
        
        if(!product){
            return null;
        }

        //const index = this.products.findIndex((product) => product.id === id );

        //this.products.splice(index, 1);

        try {           
            /*await this.saveOnFile();

            io.emit("new-product", product);*/

            const deletedProduct = await productModel.findOneAndDelete({ _id: product.id });
            
            return deletedProduct;    

        } catch (error) {            
            console.error("Error al eliminar el archivo");
        }
    }

    async saveOnFile(){
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } catch (error) {
            console.log(error);
            
            console.error("Error al guardar el archivo")
        }
    }

}

/* export const productService = new ProductService({
    path: "../BACKEND_I/src/db/products.json",
}); */

export const productService = new ProductService();
/*
const initialize = async () => {
    console.log("inicializa");
    
    await productService.getProducts();       // Obtener los productos
};

initialize();
*/
//export const productService = new ProductService("../BACKEND_I/src/db/products.json")