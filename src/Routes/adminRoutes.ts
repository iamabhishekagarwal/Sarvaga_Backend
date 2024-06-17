import express, { Request, Response } from "express";
import { string, z } from "zod";
import adminMiddleware from "../Middlewares/adminMiddleware";
import { PrismaClient, Product } from "@prisma/client";
import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination: "./../uploads/products/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("productImage");
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
const routerA = express.Router();
const prismaA = new PrismaClient();
routerA.use(express.json());
const adminSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  name : z.string()
});

async function insertAdmin(
  username: string,
  email: string,
  name: string
): Promise<{
  id: number;
  username: string;
  email: string;
  name: string;
}> {
  try {
    const res = await prismaA.admin.create({
      data: {
        username,
        email,
        name,
      },
    });
    return res;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}

async function getAllProducts():Promise<Product[] | null> {
  try {
    const product = await prismaA.product.findMany();
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}
async function deleteProductById(id: number): Promise<Product | null> {
  try {
    await prismaA.cartProduct.deleteMany({
      where: {
        productId: id,
      },
    });

    const product = await prismaA.product.delete({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return product;
  } catch (error) {
    console.error("Error deleting product by ID:", error);
    throw error;
  }
}
routerA.post("/upload", async (req, res) => {
  await upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ msg: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ msg: "No file selected" });
      } else {
        res.status(200).json({
          msg: "File uploaded",
          filePath: `/uploads/products/${req.file.filename}`,
        });
      }
    }
  });
});
async function checkAdmin(username: string, email: string, name: string): Promise<{isAdmin:Boolean}> {
  try {
    const res = await prismaA.admin.findFirst({
      where: {
        email,
      },
    });
    if (!res) {
      return { isAdmin: false };
    }
    return { isAdmin: true };
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

async function insertProduct(
  specialCategory:string,
  category: string,
  productName: string,
  description: string,
  fabric: string,
  color: string,
  price: number
) {
  try {
    const res = await prismaA.product.create({
      data: {
        category,
        productName,
        description,
        fabric,
        color,
        price,
      },
    });
    return res;
  } catch (error) {
    console.error("Error inserting product:", error);
    throw error;
  }
}
async function getSarees(): Promise<any[]> {
  try {
    const data = await prismaA.product.findMany({
      where: {
        category: "Saree",
      },
    });
    return data;
  } catch (error) {
    console.error("Error getting the request data: ", error);
    throw error;
  }
}

async function getSalwaars(): Promise<any[]> {
  try {
    const data = await prismaA.product.findMany({
      where: {
        category: "Salwaar",
      },
    });
    return data;
  } catch (error) {
    console.error("Error getting the request data: ", error);
    throw error;
  }
}

async function getLehangas(): Promise<any[]> {
  try {
    const data = await prismaA.product.findMany({
      where: {
        category: "Lehanga",
      },
    });
    return data;
  } catch (error) {
    console.error("Error getting the request data: ", error);
    throw error;
  }
}
routerA.post("/signup", async (req: Request, res: Response) => {
  const { username, email, name } =
    req.body;

  const inputValidation = adminSchema.safeParse({
    username,
    email,
    name,
  });
  if (!inputValidation.success) {
    return res.status(400).json({ msg: "Inputs are not valid" });
  }

  try {
    const response=await insertAdmin(
      username,
      email,
      name,
    );
    res.status(201).json({ msg: "Admin created successfully" ,res : response});
  } catch (error) {
    res.status(500).json({ msg: "Error creating admin" });
  }
});

routerA.post("/signin", async (req: Request, res: Response) => {
  const { username, email, name } = req.body;
  const inputValidation = adminSchema.safeParse({
    username,
    email,
    name,
  });
  if (!inputValidation.success) {
    return res.status(400).json({ msg: "Inputs are not valid" });
  }
  try {
    const response = await checkAdmin(username, email, name);
    if (response.isAdmin) {
      res
        .status(201)
        .json({ msg: "Admin Verified Successfully", res: response });
    } else {
      res
        .status(400)
        .json({ msg: "Admin Access Denied", res: response });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error Verifying admin" });
  }
});
routerA.get("/products/all", async (req: Request, res: Response) => {
  try {
    const productsArr = await getAllProducts();
    if (productsArr) {
      res.json(productsArr);
    } else {
      res.status(400).json({ error: "Invalid product ID" });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});
routerA.post("/products/addProducts", async (req: Request, res: Response) => {
  const {
    specialCategory,
    category,
    productName,
    description,
    fabric,
    color,
    price,
  } = req.body;
  try {
    const newProduct = await insertProduct(
      specialCategory,
      category,
      productName,
      description,
      fabric,
      color,
      price
    );
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error: any) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
});
routerA.delete("/products/delete", async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const deletedProduct = await deleteProductById(parseInt(id));
    if (!deletedProduct) {
      res.status(400).json({ msg: "Invalid ID" });
    }
    res
      .status(200)
      .json({ msg: "product deleted successfully", product: deletedProduct });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});
routerA.put("/orders/*", (req: Request, res: Response) => {
  // Implement orders update logic here
  res.send("Orders update endpoint");
});

routerA.get("/stats/*", (req: Request, res: Response) => {
  // Implement stats retrieval logic here
  res.send("Stats endpoint");
});

export default routerA;
