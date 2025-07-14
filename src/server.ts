import 'dotenv/config'
import { Server } from 'http';
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const port = process.env.PORT || 5000;

async function main() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bkijc.mongodb.net/6sense-challenge?retryWrites=true&w=majority&appName=Cluster0`)

        server = app.listen(port, () => {
            console.log(`6sense challenge app listening on port ${port}`)
        })

    } catch (error) {
        console.log(error);
    }
}

main()