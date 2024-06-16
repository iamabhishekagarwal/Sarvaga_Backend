import express from 'express';
import adminRoutes from './Routes/adminRoutes'; // Assuming adminRoutes.ts is the correct filename
import userRoutes from './Routes/userRoutes'; 
import cors from 'cors';

const app = express();
const port = 5172;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'application/json'], // Add other headers as needed
};

// Apply CORS options
// app.use(cors(corsOptions));

// Handle preflight requests for all routes
// app.options('*', cors(corsOptions));

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.listen(port, () => {
  console.log('Listening to port ' + port);
});
