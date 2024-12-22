import { log } from "node:console";
import fs from "node:fs";
import {v4 as uuid} from "uuid";

class CartsService{

    path;
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

    }

    async getByID(id){

        const cart = this.carts.find((cart) => cart.id === id );
        
        return cart;
    }

    async create(){

        const id = uuid(); 

        const cart = { id, products: []}

        this.carts.push(cart);

        try {
            await this.saveOnFile();

            return cart;
        } catch (error) {
            
            console.error("Error al crear el carrito");
            
        }

    }

    async update({id, products}){
        
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