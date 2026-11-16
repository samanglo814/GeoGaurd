import supabase from "./supabaseClient.js";
import { generateTransaction } from "./data/sampleTransaction.js"; 
import { analyzeTransactionTravel } from "./geographicAnalysis.js";

//const transaction = generateTransaction(null);

let previousTransaction = null;

/* Start with no preivous transaction, generate one, format for Supabase, 
insert into Supabse, remember as previous transaction, repeat 20 times, then query for all transactions with simulated_fraud_label = true and log to console */
for (let i = 0; i < 50; i++)
{
    const transaction = generateTransaction(previousTransaction);
    const databaseTransaction = {
    transaction_id: transaction.transactionId,
    amount_spent: transaction.amountSpent,
    transaction_type: transaction.transactionType,
    transaction_timestamp: transaction.transactionTimestamp,
    scenario_type: transaction.scenarioType,
    simulated_fraud_label: transaction.simulatedFraudLabel,

    merchant_name: transaction.merchantInfo.merchantName,
    merchant_city: transaction.merchantInfo.merchantCity,
    merchant_country: transaction.merchantInfo.merchantCountry,
    merchant_latitude: transaction.merchantInfo.merchantLatitude,
    merchant_longitude: transaction.merchantInfo.merchantLongitude,

    device_city: transaction.deviceInfo.deviceCity,
    device_country: transaction.deviceInfo.deviceCountry,
    device_latitude: transaction.deviceInfo.deviceLatitude,
    device_longitude: transaction.deviceInfo.deviceLongitude,
    accuracy_meters: transaction.deviceInfo.accuracyMeters,
    device_timestamp: transaction.deviceInfo.deviceTimestamp 
    };
const { error } = await supabase
    .from("transactions")
    .insert([databaseTransaction]);

if (error) {
    console.error("Insert failed:", error.message);
    break;
}


previousTransaction = transaction;

    console.log(`Inserted transaction ${i + 1}/50`);
}

console.log("Finished generating transactions!");