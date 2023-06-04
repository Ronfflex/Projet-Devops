import {config} from "dotenv";
config({
    path: ".env"
});

import * as express from 'express';
import { connect } from 'mongoose';

async function launchAPI(): Promise<void> {
  await connect(process.env.MONGO_URI as string, {
      auth: {
          username: process.env.MONGO_USER,
          password: process.env.MONGO_PASSWORD,
      },
      authSource: "admin",
  });

  const app = express();

  app.listen(process.env.PORT, function() {
      console.log(`API Listening on port ${process.env.PORT}...`);
  });
}

launchAPI().catch(console.error);