import { prisma } from "./../database/prisma.js";
import { uuid, z } from "zod";

export const getCart = async (req, res) => {
  const userId = req.user.id;
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
    include: {
      cartItems: true,
    },
  });

  if (existingCart) {
    return res.json({
      status: "Success",
      message: "Cart retrieved successfully",
      data: existingCart,
    });
  }

  const cart = await prisma.cart.create({
    data: {
      userId: userId,
    },
  });

  res.json({
    status: "Success",
    message: "Cart created successfully",
    data: cart,
  });
};

export const addItemToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, variantId, quantity } = req.body;
  //first check if the request is valid
  const itemSchema = z.object({
    productId: z.uuid(),
    variantId: z.uuid().optional(),
    quantity: z.number().min(1),
  });
  const { success, body, error } = itemSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      status: "Failure",
      message: "Bad request",
      error: z.flattenError(error),
    });
  }

  //does the cart exist
  let cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
  }

  //does the product exist?
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    return res.status(400).json({
      status: "Error",
      message: "Product not found",
    });
  }

  //does the variant exist?
  if(variantId) {
    const variant = await prisma.productVariants.findUnique({
      where: {
        id: variantId,
      },
    });
    if (!variant) {
      return res.status(400).json({
        status: "Error",
        message: "Product variant not found",
      });
    }
  }

  //add item
  const cartId = cart.id;
  const cartItem = await prisma.cartItem.create({
    data:{
      cartId,
      productId,
      variantId,
      quantity
    }
  })
  if(!cartItem){
    return res.status(500).json({
        status: "Error",
        message: "Couldn't create item",
    });
  }

  res.json({
    status: "Success",
    message: "Item added to cart successfully",
    data: cartItem,
  })
};

export const updateCartItem = async (req, res) => {
  //take input
  const userId = req.user.id;
  const itemId = req.params.id;
  const { quantity } = req.body;
  //validate payload
  const updateItemSchema = z.object({
    itemId: z.uuid(),
    quantity: z.number().min(3)
  })
  const {success, data, error} = updateItemSchema.safeParse({itemId: itemId, quantity: quantity});
  if(!success){
    return res.status(400).json({
      status: "Error",
      message: "Bad request",
      data: z.flattenError(error)
    });
  }
  //does item exist
  const cart = await prisma.cart.findFirst({
    where:{userId: userId}
  })
  if(!cart){
    return res.status(404).json({
      status: "Failure",
      message: "Cart not found",
    });
  }
  const item = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      id: itemId
    }
  });
  if (!item) {
    return res.status(404).json({
      status: "Error",
      message: "Cart item not found",
    });
  }

  //update item if it does
  const newItem = await prisma.cartItem.update({
    where:{
      id: itemId
    },
    data: {
      quantity: quantity
    }
  })
  if (!newItem) {
    return res.status(404).json({
      status: "Error",
      message: "Cart item not found",
    });
  }
  return res.status(200).json({
    status: "Success",
    message: "Item updated",
    data: newItem
  });

};

export const removeItemFromCart = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  const idSchema = z.object({ id: z.uuid() });
  const { success, data, error } = idSchema.safeParse({ id: itemId });
  if (!success) {
    return res.status(400).json({
      status: "Failure",
      message: "Not valid Id",
      error: z.flattenError(error),
    });
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: userId },
  });
  if (!cart) {
    return res.status(404).json({
      status: "Failure",
      message: "Couldn't find Cart",
    });
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });
  if (!cartItem) {
    return res.status(404).json({
      status: "Failure",
      message: "Couldn't find that Item",
    });
  }

  const deletedItem = await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });
  if (!deletedItem) {
    return res.status(400).json({
      status: "Failure",
      message: "Couldn't delete Item",
    });
  }
  return res.status(200).json({
    status: "Success",
    message: "Item successfully deleted",
    data: deletedItem,
  });
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findFirst({
    where: { userId: userId },
  });

  if (!cart) {
    return res.status(200).json({
      status: "Success",
      message: "Cart is already empty",
      data: { cart: null },
    });
  }
  const cartId = cart.id;
  const cleanCart = await prisma.cartItem.deleteMany({
    where: { cartId: cartId },
  });
  res.json({
    status: "Success",
    message: "Cart cleared successfully",
    data: { cart: null },
  });
};
