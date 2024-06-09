import express from 'express';
import adminRoutes from './Routes/adminRoutes'; // Assuming adminRoutes.ts is the correct filename
import userRoutes from './Routes/userRoutes'; // Assuming userRoutes.ts is the correct filename

const app = express();
const port = 3000;
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
    console.log('Listening to port ' + port);
});
