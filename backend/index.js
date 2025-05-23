import { Console, log } from 'console';
import path from 'path';
import { fileURLToPath } from 'url';
import { app } from './app.js';
import { connectDB } from './db/config.js';
import { configDotenv } from 'dotenv';
configDotenv();
import UserRouter from './routes/user.router.js';
import DonorRouter from './routes/donor.router.js';
import { PORT } from './constants.js';
import donationRoutes from './routes/donation.router.js';
import ReceiverRoutes from './routes/receiver.router.js';
import SupportRouter from './routes/support.router.js';
import RiderRouter from './routes/rider.router.js';
import RequestRoutes from './routes/request.router.js';
import OrderRoutes from './routes/order.router.js';
import RiderRoutes from './routes/rider.router.js';
app.use("/request",RequestRoutes);
app.use('/api/donation', donationRoutes);
app.use("/receiver",ReceiverRoutes)
app.use("/user", UserRouter);
app.use("/donor", DonorRouter);
app.use("/support", SupportRouter);
app.use("/volunteer", RiderRouter);
app.use ("/order",OrderRoutes);
app.use ("/api/riders",RiderRoutes);
// "immediately invoked function expression" (IIFE)
//check info about IIFE in ./db/config.js
//; is used in start of IIFE to command the translator that last command is ended , as now , usually people dont place semi-colon after commands in Javascript.
;(async() => {
    try{
        await connectDB(); // first we wait for our server to connect with mongoDB database server.
        app.listen(PORT,'0.0.0.0', () => {
          console.log(`Server is running on port : ${PORT}`);
      })
    } catch(error){
      console.log("MONGO db Connection Failed in index.js !!! ", err)
    }
  
  }
)();
