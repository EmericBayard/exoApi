import express from "express";
import config from "config";
import log from "./api/v1/helpers/logger";
import connect  from "./config/MongoDatabase";
import routes from "./api/v1/routes/open/routes";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, host, () => {
    log.info(`🚀 Server listening at http://${host}:${port} !`)

    connect();

    routes(app);
})