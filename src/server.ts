import { Server } from 'http';
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const port = 5000;

async function main() {
    try {
        await mongoose.connect('mongodb+srv://6sense-challenge-user:NNDDwOfnOEdcHPjK@cluster0.bkijc.mongodb.net/6sense-challenge?retryWrites=true&w=majority&appName=Cluster0')


        server = app.listen(port, () => {
            console.log(`6sense challenge app listening on port ${port}`)
        })

    } catch (error) {
        console.log(error);
    }
}

main()