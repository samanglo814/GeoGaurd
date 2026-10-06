import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateTransaction } from "./data/sampleTransaction.js";
import supabase from "./supabaseClient.js";

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "GeoGuard API is running" });
});

app.get("/api/transactions", async (req, res) => {
    const { data, error } = await supabase
        .from("transactions")
        .select("*");

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    console.log("Supabase transactions:", data.length);

const transactions = data.map((row) => ({
    transactionId: row.transaction_id,
    amountSpent: row.amount_spent,
    transactionType: row.transaction_type,
    transactionTimestamp: row.transaction_timestamp,
    scenarioType: row.scenario_type,
    simulatedFraudLabel: row.simulated_fraud_label,

    merchantInfo: {
        merchantName: row.merchant_name,
        merchantCity: row.merchant_city,
        merchantCountry: row.merchant_country,
        merchantLatitude: row.merchant_latitude,
        merchantLongitude: row.merchant_longitude
    },

    deviceInfo: {
        deviceCity: row.device_city,
        deviceCountry: row.device_country,
        deviceLatitude: row.device_latitude,
        deviceLongitude: row.device_longitude,
        accuracyMeters: row.accuracy_meters,
        deviceTimestamp: row.device_timestamp
    }
}));

res.json(transactions);});

app.listen(PORT, () => {
    console.log(`GeoGuard API running on port ${PORT}`);
});