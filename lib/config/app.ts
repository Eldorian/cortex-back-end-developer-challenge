import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import environment from "../environment";
import { CharacterRoutes } from "../routes/character_routes";
import { UserRoutes } from "../routes/user_routes";
import { TestRoutes } from "../routes/test_routes";
import { CommonRoutes } from "../routes/common_routes";

class App {

   public app: express.Application;
   public mongoUrl: string = 'mongodb://mongo:27017/' + environment.getDBName();

   private character_routes: CharacterRoutes = new CharacterRoutes();
   private user_routes: UserRoutes = new UserRoutes();
   private test_routes: TestRoutes = new TestRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();

   constructor() {
      this.app = express();
      this.config();
      this.mongoSetup();

      this.character_routes.route(this.app);
      this.user_routes.route(this.app);
      this.test_routes.route(this.app);
      this.common_routes.route(this.app);
   }
   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));
   }

   private mongoSetup(): void {
      mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
   }
}
export default new App().app;