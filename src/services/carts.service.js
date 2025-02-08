import { log } from "node:console";
import fs from "node:fs";
import {v4 as uuid} from "uuid";
import { cartModel } from "../models/cart.model.js"; 
import mongoose from "mongoose";

class CartsService{

    constructor(page = 1, limit = 5) {
        this.carts = [];
        this.getPaginatedCarts(page, limit);
    }
    
        async getPaginatedCarts(page = 1, limit = 5) {
        try {
            const result = await cartModel.paginate({}, { page, limit });
        
            this.docs = result;
            this.carts = result.docs;
    
        } catch (error) {
            console.error('Error al obtener los carritos paginados:', error);
            }
        }

    /*path;
    carts = [];

    constructor(path){

        this.path = path;

        if(fs.existsSync(path)){
            try {
                this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"))
                
            } catch (error) {
                this.carts = [];   
            }
        } else{
            this.carts = [];
        }

    }*/

    async getAll(page = 1, limit = 5){
    
        await this.getPaginatedCarts(page, limit);
        
        return this.docs;
    }

    async getByID(id){

        const cart = this.carts.find((cart) => cart.id === id );

        const cartPopulate = await cartModel.findById(cart.id)
        .populate("products.product") 
        .exec();
        console.log('Carrito con productos poblados:', cartPopulate);

        return cartPopulate;
    }

    async create(){

        const id = uuid(); 

        const cart = { products: []}

        this.carts.push(cart);

        try {
            //await this.saveOnFile();

            const newCart = new cartModel(cart);
            
            const savedCart = await newCart.save();

            return savedCart;

        } catch (error) {
            
            console.error("Error al crear el carrito");
            
        }

    }

    async insertProduct(idCart, idProduct){

        try {

            const updatedCart = await cartModel.findOneAndUpdate(
            {_id: idCart}, 
            {
                $push: { 
                    products: { 
                        product: new mongoose.Types.ObjectId(idProduct),
                        quantity: 1 
                    }
                },
            },
            {
                new: true  
            });

            return updatedCart;

        } catch (error) {
            
            console.error("Error al crear el carrito");
            
        }

    }

    /*async update({id, products}){
        
        const cart = this.carts.find((cart) => cart.id === id);

        if(!cart){
            return null;
        }

        products.quantity = Number(products.quantity)

        const index = this.carts.findIndex((cart) => cart.id === id);

        const product = cart.products.find((product) => product.id === products.id);                
        
        if(!product){
            this.carts[index].products.push(products);
        } else {
            product.quantity += products.quantity
        }        

        try {
            await this.saveOnFile();

            return cart;
        } catch (error) {
            console.error("Error al agregar los productos");
        }

    }*/

    async update(idCart, idProduct, quantity){
        const cart = this.carts.find((cart) => cart.id === idCart);
        console.log(cart);
        
        if(!cart){
            return null;
        }

        try {
            
            const quantityValue = quantity.quantity;

            const updatedCart = await cartModel.findOneAndUpdate(
                {_id: idCart,                            
                "products.product": idProduct},  
                {
                $set: {
                    "products.$.quantity": quantityValue
                }
                },
                {
                new: true  
                }
                
              );

            return updatedCart;    

        } catch (error) {            
            console.log(error);
            
            console.error("Error al eliminar el archivo");
        }
    }

    async deleteProductById(idCart, idProduct){
        const cart = this.carts.find((cart) => cart.id === idCart);
        
        if(!cart){
            return null;
        }

        try {
            const updatedCart = await cartModel.findByIdAndUpdate(
                idCart, 
                { 
                  $pull: {                                         
                    products: { 
                        product: new mongoose.Types.ObjectId(idProduct)
                    }
                  }
                },
                { new: true }, 
                
              );

            return updatedCart;    

        } catch (error) {            
            console.log(error);
            
            console.error("Error al eliminar el archivo");
        }
    }

    async deleteProducts(idCart){
        const cart = this.carts.find((cart) => cart.id === idCart);
        
        if(!cart){
            return null;
        }

        try {

            const updatedCart = await cartModel.updateOne(
                { _id: idCart },
                { $set: { products: [] } }
              )

            return updatedCart;    

        } catch (error) {            
            console.log(error);
            
            console.error("Error al eliminar el archivo");
        }
    }

    async saveOnFile(){
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar el archivo");
        }
    }
}

export const cartService = new CartsService("../BACKEND_I/src/db/carts.json")