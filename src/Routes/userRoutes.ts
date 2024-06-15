import express, { Request, Response } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const routerU = express.Router();
const prismaU = new PrismaClient();
dotenv.config();

const userSchema = z.object({
  username: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

async function insertUser(
  username: string,
  firstName: string,
  lastName: string
): Promise<void> {
  try {
    const res = await prismaU.user.create({
      data: {
        username,
        firstName,
        lastName,
      },
    });
    console.log(res);
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}

async function getAllUsers(): Promise<any[]> {
  try {
    const users = await prismaU.user.findMany();
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}

async function getProductsByCategory(category: string): Promise<any[]> {
  try {
    const data = await prismaU.product.findMany({
      where: { category },
    });
    return data;
  } catch (error) {
    console.error(`Error getting ${category} products:`, error);
    throw error;
  }
}

const insertItem = async (userId: number, productId: number) => {
  try {
    let cart = await prismaU.cart.findFirst({
      where: { ownerId: userId },
      include: { cartProducts: true },
    });

    if (!cart) {
      cart = await prismaU.cart.create({
        data: {
          ownerId: userId,
          cartProducts: {
            create: [{ productId }],
          },
        },
        include: { cartProducts: true },
      });
    } else {
      const existingCartProduct = cart.cartProducts.find(
        (cp) => cp.productId === productId
      );

      if (!existingCartProduct) {
        cart = await prismaU.cart.update({
          where: { id: cart.id },
          data: {
            cartProducts: {
              create: [{ productId }],
            },
          },
          include: { cartProducts: { include: { product: true } } },
        });
      }
    }

    const updatedCart = await prismaU.cart.findUnique({
      where: { id: cart.id },
      include: { cartProducts: { include: { product: true } } },
    });

    return updatedCart;
  } catch (error) {
    throw error;
  }
};


const getItems = async (userId: number) => {
  try {
    let cart = await prismaU.cart.findFirst({
      where: { ownerId: userId },
      include: { cartProducts: true },
    });
    if (!cart) {
      cart = await prismaU.cart.create({
        data: {
          ownerId: userId,
          cartProducts: {
            create: [],
          },
        },
        include: { cartProducts: { include: { product: true } } },
      });
    }
    return cart.cartProducts;
  } catch (error) {
    throw error;
  }
};
const deleteItems = async (userId: number, productId: number) => {
  try {
    let cart = await prismaU.cart.findFirst({
      where: { ownerId: userId },
      include: { cartProducts: true },
    });
    if (!cart) {
      console.log("Cart not found");
      return;
    }
    const cartProduct = cart.cartProducts.find(
      (cp) => cp.productId === productId
    );
    if (cartProduct) {
      await prismaU.cartProduct.delete({
        where: {
          id: cartProduct.id,
        },
      });
      console.log("Product removed from cart");
    } else {
      console.log("Product not found in cart");
    }
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    throw error;
  }
};

routerU.get("/fetchData", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ msg: "Error fetching data" });
  }
});

routerU.post("/signup", async (req: Request, res: Response) => {
  const { username, firstName, lastName } = req.body;

  const inputValidation = userSchema.safeParse({
    username,
    firstName,
    lastName,
  });
  if (!inputValidation.success) {
    return res.status(400).json({ msg: "Inputs are not valid" });
  }

  try {
    await insertUser(username, firstName, lastName);
    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error creating user" });
  }
});

routerU.get("/products/:category", async (req: Request, res: Response) => {
  const category = req.params.category;
  try {
    const data = await getProductsByCategory(category);
    res.json(data);
  } catch (error) {
    res.status(500).send(`Error fetching ${category} products`);
  }
});

routerU.post("/carts/additem", async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;
    const response = await insertItem(userId, productId);
    res.json(response);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});
routerU.get("/carts/getItems", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const response = await getItems(userId);
    res.json(response);
  } catch (error) {
    console.error("Error getting item from cart:", error);
    res.status(500).json({ error: "Failed to get item from cart" });
  }
});

routerU.delete("/ItemsInCart/delete", async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;
    const response = await deleteItems(userId, productId);
    res.json(response);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

routerU.get("/order/*", (req: Request, res: Response) => {
  // Implement order handling logic here
  res.send("Order details");
});

routerU.get("/trackItems", (req: Request, res: Response) => {
  // Implement item tracking logic here
  res.send("Tracking items");
});

export default routerU;
