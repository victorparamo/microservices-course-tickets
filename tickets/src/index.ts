import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY doesn't exist")
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI doesn't exist")
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected with mongo DB')
  } catch (err) {
    console.log(err);
  }
  
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

start();