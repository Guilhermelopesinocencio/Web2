import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/Users";
import { Situation } from "./entity/Situations";
import { ProductCategory } from "./entity/ProductCategories";
import { ProductSituation } from "./entity/ProductSituations";
import { Product } from "./entity/Products";

// Configuração do DataSource do TypeORM
import dotenv from "dotenv";
dotenv.config();

// Configuração do DataSource do TypeORM
const dialect = process.env.DB_DEALECT ?? "mysql"

// Criação do DataSource do TypeORM
export const AppDataSource = new DataSource({
    type: dialect as "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [User, Situation, ProductCategory, ProductSituation, Product],
    migrations: [__dirname + "/migration/*.js"],
    subscribers: [],
});

// Inicialização do DataSource do TypeORM
AppDataSource.initialize().then(() => {
    console.log("Conexão do banco de dados inicializada!");
}).catch((error) => {
    console.error("Erro na conexão com o banco de dados:", error);
});