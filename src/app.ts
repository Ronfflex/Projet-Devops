import {config} from "dotenv";
config({
    path: ".env"
});

import * as express from 'express';
import { connect } from 'mongoose';
import { EnclosureController, ExpressController, UserController, MaintenanceController, AnimalController } from "./controllers";

async function launchAPI(): Promise<void> {
  console.log("Connecting to database...");
  await connect(process.env.MONGO_URI as string, {
      auth: {
          username: process.env.MONGO_USER,
          password: process.env.MONGO_PASSWORD,
      },
      authSource: "admin",
  });


  const app = express();
  
  const controllers: ExpressController[] = [
    new EnclosureController(),
    new UserController(),
    new MaintenanceController(),
    new AnimalController()
  ];
  for (let controller of controllers) {
    const router = controller.buildRoutes();
    app.use(controller.path, router);
  }


  app.listen(process.env.PORT, function() {
      console.log(`API Listening on port ${process.env.PORT}...`);
  });
}

launchAPI().catch(console.error);