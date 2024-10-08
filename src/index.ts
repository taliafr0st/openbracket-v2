import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import session from 'express-session';
import * as db from "./utils/db";
import cfg from "../config.json";
import * as Tournament from "./Tournament";
import * as Match from "./Match";
import { identifyError, OpenBracketError } from './utils/OpenBracketError';
import cors from 'cors';
import { validateHeaderName } from 'http';

var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
}

const app = express();
app.use(cors(corsOptions),
    bodyParser.json(),
    session({
        name: 'session',
        secret: cfg.cookiesecret,
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 1000 * 60 * 60 * 4} //TODO: resave option?
    })
);

const port = 8888;
const listener = app.listen(port, function () {
    console.log('Listening on port ' + port + '\n');
});

db.startup();

app.get("/", async function (req: Request, res: Response) {
    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send({msg: "hello world"})
});

app.get("/validate", async function (req: Request, res: Response) {
    res.status(200);
    const u = await validateSession(req)
        .catch(err => {
            const e = identifyError(err)
            res.status(e.code);
            return e;
        })
    res.set('Content-Type', 'application/json');
    res.send(u)
});

async function validateSession(req : Request) : Promise<string> {
    if (!req.session.tournament || req.query.id != req.session.tournament) {
        throw new OpenBracketError("Session invalid", 401)
    }
    return "ok";
}

app.post("/tournament", async function (req: Request, res: Response) {
    res.status(200);
    const u = await Tournament.create(req)
        .catch(err => {
            const e = identifyError(err)
            res.status(e.code);
            return e;
        })
    res.set('Content-Type', 'application/json');
    res.send(u);
});

app.post("/tournament/login", async function (req: Request, res: Response) {
    res.status(200);
    const u = await Tournament.login(req)
        .catch(err => {
            const e = identifyError(err)
            res.status(e.code);
            return e;
        })
    res.set('Content-Type', 'application/json');
    res.send(u);
});

app.get("/tournament", async function (req: Request, res: Response) {
    res.status(200);
    const u = await Tournament.read(req)
        .catch(err => {
            const e = identifyError(err)
            res.status(e.code);
            return e;
        })
    res.set('Content-Type', 'application/json');
    res.send(u);
});

app.put("/tournament", async function (req: Request, res: Response) {
    res.status(200);
    const u = await Match.update(req)
        .catch(err => {
            const e = identifyError(err)
            res.status(e.code);
            return e;
        })
    res.set('Content-Type', 'application/json');
    res.send(u);
});

process.on('exit', function () {
    db.shutdown();
});
