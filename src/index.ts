import express from 'express';
import adminRoutes from './Routes/adminRoutes'; // Assuming adminRoutes.ts is the correct filename
import userRoutes from './Routes/userRoutes'; // Assuming userRoutes.ts is the correct filename
import cors from 'cors'

const app = express();
const port = 5172;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
  }));
  
  app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
    console.log('Listening to port ' + port);
});


