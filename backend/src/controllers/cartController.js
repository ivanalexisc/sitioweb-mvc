let { Product, Categorie , Color, Talle, User} = require("../database/models");

const cartController = {

addToCart: async (req,res) => {
    try {
        const { id } = req.params;
    const product = await Product.findByPk(id);
    //si el producto no existe devuelvo un mensaje
    if (!product) return res.status(404).json({message:'Producto no encontrado'});
    if(!req.session.cart) req.session.cart = [];
    const existingProduct = req.session.cart.find(item=> item.id === product.id)

    if (existingProduct){
        existingProduct.quantity++;
    } else {
        req.session.cart.push({id : product.id, name: product.nombre, price: product.precio, quantity:1});
    }
    res.json({ message: 'Producto agregado', cart: req.session.cart });
    } catch (error) {
        console.log(error);
    }
},

viewCart: (req, res) => {
    console.log("Carrito en la sesión:", req.session.cart);
    return res.render("cart", { cart: req.session.cart || [] });
},

removeFromCart : (req,res) => {
    const {id} = req.params;
    req.session.cart = req.session.cart.filter(item => item.id != id);
    res.json({message: 'producto eliminado', cart: req.session.cart});
}, 

clearCart : (req,res) =>{
    req.session.cart = [];
    res.json({ message: 'Carrito Vacio'});
}

};

module.exports = cartController;