import express from "express";
import { generateTransaction } from "./data/sampleTransaction.js";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "GeoGuard API is running" });
});

app.get("/api/transactions", (req, res) => {
    const transactions = [];

    let previousTransaction = null;

    for (let i = 0; i < 10; i++) {
        const transaction = generateTransaction(previousTransaction);
        transactions.push(transaction);
        previousTransaction = transaction;
    }

    res.json(transactions);
});

app.listen(PORT, () => {
    console.log(`GeoGuard API running on port ${PORT}`);
});