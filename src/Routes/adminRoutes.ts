import express, { Request, Response } from 'express';
import { z } from 'zod';
import adminMiddleware from '../Middlewares/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const routerA = express.Router();
const prismaA = new PrismaClient();

const adminSchema = z.object({
    username: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1)
});

async function insertAdmin(username: string, firstName: string, lastName: string): Promise<void> {
    try {
        const res = await prismaA.user.create({
            data: {
                username,
                firstName,
                lastName
            }
        });
        console.log(res);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}
async function insertProduct(category: string, productName: string, description: string, fabric: string, color: string, price: number) {
    try {
      const res = await prismaA.product.create({
        data: {
          category,
          productName,
          description,
          fabric,
          color,
          price
        }
      });
      return res;
    } catch (error) {
      console.error('Error inserting product:', error);
      throw error;
    }
  }
  async function getSarees():Promise<any[]>{
    try{
      const data=await prismaA.product.findMany({
        where: {
          category: 'Saree'
      }
      });
      return data;
    }
    catch(error){
      console.error('Error getting the request data: ',error);
      throw error;
    }
  }
  
  async function getSalwaars():Promise<any[]>{
    try{
      const data=await prismaA.product.findMany({
        where: {
          category: 'Salwaar'
      }
      });
      return data;
    }
    catch(error){
      console.error('Error getting the request data: ',error);
      throw error;
    }
  }
  
  async function getLehangas():Promise<any[]>{
    try{
      const data=await prismaA.product.findMany({
        where: {
          category: 'Lehanga'
      }
      });
      return data;
    }
    catch(error){
      console.error('Error getting the request data: ',error);
      throw error;
    }
  }
routerA.post('/signup', async (req: Request, res: Response) => {
    const { username, firstName, lastName } = req.body;

    const inputValidation = adminSchema.safeParse({ username, firstName, lastName });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: 'Inputs are not valid' });
    }

    try {
        await insertAdmin(username, firstName, lastName);
        res.status(201).json({ msg: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error creating admin' });
    }
});

routerA.post('/signin', (req: Request, res: Response) => {
    // Implement signin logic here
    res.send('Signin endpoint');
});

routerA.post('/products/addProducts',async (req: Request, res: Response) => {
    const { category, productName, description, fabric, color, price } = req.body;
    try {
        const newProduct = await insertProduct(category, productName, description, fabric, color, price);
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
      } catch (error : any) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
      }
});

routerA.put('/orders/*', (req: Request, res: Response) => {
    // Implement orders update logic here
    res.send('Orders update endpoint');
});

routerA.get('/stats/*', (req: Request, res: Response) => {
    // Implement stats retrieval logic here
    res.send('Stats endpoint');
});

export default routerA;
