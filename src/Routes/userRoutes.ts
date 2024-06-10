import express, { Request, Response } from 'express';
import { string, z } from 'zod';
import { PrismaClient } from '@prisma/client';
import userMiddleware from '../Middlewares/userMiddleware';
import { OAuth2Client } from 'google-auth-library';
import { url } from 'inspector';

const routerU = express.Router();
const prismaU = new PrismaClient();
const dotenv=require('dotenv');
dotenv.config();
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


routerU.post("/",async(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','http://localhost:5172');

    res.header('Referrer-Policy','no-referrer-when-downgrade');

    const redirectUrl='http://localhost:5172/user'
    const oAuth2Client =new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type:'offline',
      scope:'https://www.googleapis.com/auth/userinfo.profile openid',
      prompt:'consent'
    });
    res.json({url:authorizeUrl})
})

async function getUserdata(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
  const data=await response.json();
  console.log('data',data);
}

routerU.get('/',async (req,res,next)=>{
  const code = req.query.code;
  if (typeof code !== 'string') {
    return res.status(400).send('Invalid code parameter');
  }
  try{
    const redirectUrl = 'http://localhost:5172/user'
    const oAuth2Client= new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const res = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(res.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    await(getUserdata(user.access_token))
  }
  catch(err){
    res.json({"msg":"Error Signing in with google"});
  }
});

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
