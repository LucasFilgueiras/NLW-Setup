import Fastify from "fastify"
import cors from "@fastify/cors"
import { AppRoutes } from "./lib/routes"

const app = Fastify()

app.register(cors)
app.register(AppRoutes)


app.listen({port: 3333}, () => console.log("rodando"))