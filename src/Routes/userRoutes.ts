import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import userMiddleware from '../Middlewares/userMiddleware';

const routerU = express.Router();
const prismaU = new PrismaClient();

const userSchema = z.object({
    username: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1)
});

async function insertUser(username: string, firstName: string, lastName: string): Promise<void> {
    try {
        const res = await prismaU.user.create({
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
async function getAllUsers(): Promise<any[]> {
  try {
      const users = await prismaU.user.findMany();
      return users;
  } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
  }
} 
routerU.post('/fetchData', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ msg: 'Error fetching data' });
  }
});


routerU.post('/signin', (req: Request, res: Response) => {
  // Implement signin logic here
  res.send('User signed in');
});

routerU.post('/signup', async (req: Request, res: Response) => {
  const { username, firstName, lastName } = req.body;

  // Convert username, firstName, and lastName to strings
  const usernameString = username.toString();
  const firstNameString = firstName.toString();
  const lastNameString = lastName.toString();

  // Validate the input
  const inputValidation = userSchema.safeParse({ username: usernameString, firstName: firstNameString, lastName: lastNameString });
  if (!inputValidation.success) {
      return res.status(400).json({ msg: 'Inputs are not valid' });
  }

  try {
      // Insert the user into the database
      await insertUser(usernameString, firstNameString, lastNameString);
      res.status(201).json({ msg: 'Admin created successfully' });
  } catch (error) {
      res.status(500).json({ msg: 'Error creating admin' });
  }
});

routerU.post('/ItemsInCart/create', (req: Request, res: Response) => {
  // Implement create item in cart logic here
  res.send('Item added to cart');
});

routerU.get('/ItemsInCart/read', (req: Request, res: Response) => {
  // Implement read items from cart logic here
  res.send('Read items from cart');
});

routerU.delete('/ItemsInCart/delete', (req: Request, res: Response) => {
  // Implement delete item from cart logic here
  res.send('Item deleted from cart');
});

routerU.get('/order/*', (req: Request, res: Response) => {
  // Implement order handling logic here
  res.send('Order details');
});

routerU.get('/trackItems', (req: Request, res: Response) => {
  // Implement item tracking logic here
  res.send('Tracking items');
});

export default routerU;
