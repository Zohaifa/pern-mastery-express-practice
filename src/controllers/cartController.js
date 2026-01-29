export const getCart = async (req, res) =>{
    res.send("get cart items");
}

export const addItemToCart = async (req, res) =>{
    res.send("add items to cart");
}

export const updateCartItem = async (req, res) =>{
    res.send("update cart");
}

export const removeItemFromCart = async (req, res) => {
    res.send("delete items from cart");
}

export const clearCart = async (req, res) =>{
    res.send("clear cart");
}