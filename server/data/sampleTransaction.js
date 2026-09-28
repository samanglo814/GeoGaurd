import { locations } from './locations.js';
import { faker } from '@faker-js/faker';

/* A single transaction needs:
Transaction ID
Amount spent
Transaction type (chip, tap, online, etc.)
Transaction timestamp
Merchant information (name, city/country, latitude and longitude)
Device information (location of phone)
Scenario type (normal, normal travel, impossible travel)
Simulated fraud label (T/F)
*/

// Transaction object consists of an id, amount spent, and transaction type
const transaction = {
    transactionId: "1234567890",
    amountSpent: 100.00,
    transactionType: "chip",
    transactionTimestamp: "2023-03-15T10:30:00Z",

    merchantInfo: {
        merchantName: "ABC Store",
        merchantCity: "New York",
        merchantCountry: "USA",
        merchantLatitude: 40.7128,
        merchantLongitude: -74.0060
    },

    deviceInfo: {
        deviceLocation: {
            timestamp: "2023-03-15T10:30:00Z",
            latitude: 40.7128,
            longitude: -74.0060,
            accuracyMeters: 5

        }
    },

    scenarioType: "normal",
    simulatedFraudLabel: false
}

// Function to generate a random transaction
function getRandomLocation()
{
    const randomInt = Math.floor(Math.random() * locations.length);
    const randomLocation = locations[randomInt];
    return randomLocation;
}

// Randomly generate merchant and device locations, transaction type, and amount spent
function generateTransaction(previousTransaction = null) 
{
    // Randomly generate merchant and device locations
    let merchantLocation = getRandomLocation();
    let deviceLocation = getRandomLocation();

    // Transaction type variables, randomly generate a transaction type 
    const transactionTypes = ["chip", "tap", "online", "swipe", "atm", "subscription"];
    const inPersonTransactionTypes = ["chip", "tap", "swipe", "atm"];
    let randomTransactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

    // Randomly generate an amount spent between 1 and 1500, rounded to 2 decimal places
    const randomAmount = Number((Math.random() * (1500-1)+1).toFixed(2));

    // Transaction ID and merchant name generated using faker library
    const transactionId = faker.string.uuid();
    const merchantName = faker.company.name();

    // Randomly generate a GPS accuracy between 5 and 100 meters
    let gpsAccuracy = Math.floor(Math.random() * (100-5 + 1)) + 5; // (meters)

    // Randomly select a scenario type from the list of possible types
    const scenarioTypes = ["normal", "normal travel", "impossible travel", "poor gps", "online"];
    let randomScenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];

    // If there isn't a first transaction, we can only have a normal scenario type for the first transaction
    if (previousTransaction === null)
    {
        randomScenarioType = "normal"; // For the first transaction, we can only have a normal scenario
    }

    let simulatedFraudLabel = false; // Placeholder for now, can be updated based on scenario type

    // Randomly generate a number of minutes before the transaction timestamp, between 1 and 60
    let randomMinutesBeforeTransaction = Math.floor((Math.random() * 60) + 1);

    let transactionTimestamp;

    // If there is a previous transaction, set the transaction timestamp to be after the previous transaction timestamp
    if (previousTransaction !== null)
    {
        const previousTime = new Date(previousTransaction.transactionTimestamp);

        const randomMinutesAfterPrevious = Math.floor((Math.random() * 120) + 1); 

        previousTime.setMinutes(previousTime.getMinutes() + randomMinutesAfterPrevious);
        transactionTimestamp = previousTime.toISOString();
    }
    else
    {
        transactionTimestamp = faker.date.recent().toISOString();
    }

    /****************** Scenario Logic ******************/

    // If the scenario type is "normal", set the device location to be the same as the merchant location
    if (randomScenarioType === "normal")
    {
        deviceLocation = merchantLocation;

        // Only allow in-person transaction types for normal scenarios
        randomTransactionType = inPersonTransactionTypes[Math.floor(Math.random() * inPersonTransactionTypes.length)];
    }
    // Impossible travel: choose a different city from the previous transaction    
    else if (randomScenarioType === "impossible travel" && previousTransaction !== null)
    {
        // Ensure that the merchant location is different from the previous transaction's merchant location
        while (merchantLocation.city === previousTransaction.merchantInfo.merchantCity)
        {
            merchantLocation = getRandomLocation();
        }

        deviceLocation = merchantLocation; // Set the device location to be the same as the merchant location for impossible travel
        randomMinutesBeforeTransaction = Math.floor((Math.random() * 10) + 1); // Shorter gap between times

        const previousTime = new Date(previousTransaction.transactionTimestamp);
        previousTime.setMinutes(previousTime.getMinutes() + randomMinutesBeforeTransaction);
        transactionTimestamp = previousTime.toISOString();

        randomTransactionType = inPersonTransactionTypes[Math.floor(Math.random() * inPersonTransactionTypes.length)];
        simulatedFraudLabel = true; // Mark as fraud for impossible travel
    }
    // Poor gps, set the accuracy to be very poor 
    else if (randomScenarioType === "poor gps" && previousTransaction !== null)
    {
        // Keep the transaction in the same location as the previous transaction
        merchantLocation = {
            city: previousTransaction.merchantInfo.merchantCity,
            country: previousTransaction.merchantInfo.merchantCountry,
            latitude: previousTransaction.merchantInfo.merchantLatitude,
            longitude: previousTransaction.merchantInfo.merchantLongitude
        };

        deviceLocation = merchantLocation;

        // Simulate poor GPS accuracy
        gpsAccuracy = 3000;

        randomTransactionType = inPersonTransactionTypes[
            Math.floor(Math.random() * inPersonTransactionTypes.length)
        ];
    }
    // Online scenario 
    else if (randomScenarioType === "online")
    {
        randomTransactionType = "online";
        deviceLocation = merchantLocation; // For online transactions, we can assume the device is at the merchant location
    }
    // Normal travel
    else if (randomScenarioType === "normal travel" && previousTransaction !== null)
    {
        // Ensure that the merchant location is different from the previous transaction's merchant location
        while (merchantLocation.city === previousTransaction.merchantInfo.merchantCity)
        {
            merchantLocation = getRandomLocation();
        }
    
        deviceLocation = merchantLocation;
      
        // Randomly generate a number of minutes before the transaction timestamp, between 360 and 2880 (6 hours to 48 hours) (Reasonable)
        randomMinutesBeforeTransaction = Math.floor((Math.random() * (2880-360)) + 360); 

        const previousTime = new Date(previousTransaction.transactionTimestamp);

        previousTime.setMinutes(previousTime.getMinutes() + randomMinutesBeforeTransaction);

        transactionTimestamp = previousTime.toISOString();

        randomTransactionType = inPersonTransactionTypes[Math.floor(Math.random() * inPersonTransactionTypes.length)];

    }

    const deviceTimestamp = new Date(transactionTimestamp);
    const deviceMinutesBeforeTransaction = Math.floor((Math.random() * 10) + 1); // Randomly choose a number of minutes before the transaction timestamp
    deviceTimestamp.setMinutes(deviceTimestamp.getMinutes() - deviceMinutesBeforeTransaction); // Subtract the random number of minutes from the transaction timestamp


    const transaction = 
    {
        transactionId: transactionId,
        amountSpent: randomAmount,
        transactionType: randomTransactionType,
        transactionTimestamp: transactionTimestamp,
        scenarioType: randomScenarioType,
        simulatedFraudLabel: simulatedFraudLabel,

        merchantInfo: {
            merchantName: merchantName,
            merchantCity: merchantLocation.city,
            merchantCountry: merchantLocation.country,
            merchantLatitude: merchantLocation.latitude,
            merchantLongitude: merchantLocation.longitude,
        },

        deviceInfo: {
            deviceCity: deviceLocation.city,
            deviceCountry: deviceLocation.country,
            deviceLatitude: deviceLocation.latitude,
            deviceLongitude: deviceLocation.longitude,
            accuracyMeters: gpsAccuracy,
            deviceTimestamp: deviceTimestamp.toISOString()
        },
    }
    return transaction;

}

export { generateTransaction };

let previousTransaction = null;

// Generating many random transactions for testing
/*
for (let i = 0; i < 20; i++) 
{
    const newTransaction = generateTransaction(previousTransaction);
    console.log(newTransaction);
    previousTransaction = newTransaction;



}*/