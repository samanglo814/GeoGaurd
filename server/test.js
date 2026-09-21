import supabase from "./supabaseClient.js";
import { generateTransaction } from "./data/sampleTransaction.js";

const transaction = generateTransaction(null);
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

const { data, error } = await supabase
    .from("transactions")
    .select("*") // retrieve all columns
    .eq("simulated_fraud_label", true); // filter data 

console.log(data);
console.log(error);

