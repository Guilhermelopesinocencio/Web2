import express from "express";
import dotenv from "dotenv";
dotenv.config();

// Importando o DataSource do TypeORM
const app = express();

//Middleware para receber requisições no formato JSON
app.use(express.json());

//Importando os controladores das rotas
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import ProductCategoriesController from "./controllers/ProductCategoriesController";
import ProductSituationsController from "./controllers/ProductSituationsController";
import ProductsController from "./controllers/ProductsController";

//Rota para autenticação de usuários
app.use("/", AuthController)
app.use("/", SituationsController);
app.use("/", ProductCategoriesController);
app.use("/", ProductSituationsController);
app.use("/", ProductsController);

//Iniciando o servidor na porta definida no arquivo .env
app.listen(process.env.PORT, () => {
    console.log(`iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});