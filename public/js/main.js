const socket = io();

//const productList = document.getElementById("products");        

const tableBody = document.getElementById("product-table-body");

socket.on("init", (products) => {    
    //productList.innerHTML = "";    

    tableBody.innerHTML = '';

    products.forEach(product => {        
        /*const li = createProduct(product);
        productList.appendChild(li);*/
        createProduct(product);
    });
})

socket.on("new-product", (product) => {
    /*const li = createProduct(product);
    productList.appendChild(li);*/        

    createProduct(product);
})

function createProduct(product){
    /*const li = document.createElement("li");

    li.innerHTML = `
    <strong>${product.title}</strong>
    -
    <strong>${product.price}</strong>
    `;    */        
        
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.innerHTML = `<strong>${product.id}</strong>`;
    const titleCell = document.createElement("td");
    titleCell.innerHTML = `<strong>${product.title}</strong>`;
    const priceCell = document.createElement("td");
    priceCell.innerHTML = `<strong>${product.price}</strong>`;
    
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(priceCell);

    tableBody.appendChild(row);

   // return li;
}