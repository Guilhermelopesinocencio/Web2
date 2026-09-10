import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/Users";
import { Situation } from "./entity/Situations";

import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DEALECT ?? "mysql"
export const AppDataSource = new DataSource({
    type: dialect as "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [User, Situation],
    migrations: [__dirname + "/migration/*.js"],
    subscribers: [],
});

AppDataSource.initialize().then(() => {
    console.log("Conexão do banco de dados inicializada!");
}).catch((error) => {
    console.error("Erro na conexão com o banco de dados:", error);
});