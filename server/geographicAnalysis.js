// Use Haversine formula to calculate the shortest distance along Earth's surface
// between two latitude/longitude coordinates
// Geographic, not realistic

// Haversine vs API
// Haversine: "How far apart are they geographically"
// API: "How long would it take to actually drive these distances"

import "dotenv/config";

const ORS_API_KEY = process.env.ORS_API_KEY;


// HAVERSINE DISTANCE

function calculateDistance(lat1, lon1, lat2, lon2)
{
    const earthRadius = 6371; // Kilometers

    // Convert degrees to radians
    const lat1Rad = lat1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);

    const latDifference = (lat2 - lat1) * (Math.PI / 180);
    const lonDifference = (lon2 - lon1) * (Math.PI / 180);

    // Haversine formula
    const a =
        Math.sin(latDifference / 2) ** 2 +
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(lonDifference / 2) ** 2;

    // Central angle between two locations on Earth (radians)
    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    // Distance in kilometers
    const distance = earthRadius * c;

    return distance;
}


// OPENROUTESERVICE API

// Return the driving distance and estimated driving time between two locations
async function getRouteInfo(startLon, startLat, endLon, endLat)
{
    const url = "https://api.heigit.org/openrouteservice/v2/directions/driving-car";

    const response = await fetch(url, {
        method: "POST",

        headers: {
            "Authorization": ORS_API_KEY,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            coordinates: [
                [startLon, startLat],
                [endLon, endLat]
            ]
        })
    });

const data = await response.json();

// If OpenRouteService cannot find a driving route
    if (!response.ok || !data.routes || data.routes.length === 0)
    {
        return null;
    }

    const routeSummary = data.routes[0].summary;

    // Convert meters to kilometers
    const distanceKm = routeSummary.distance / 1000;

    // Convert seconds to minutes
    const durationMinutes = routeSummary.duration / 60;

    return {
        distanceKm,
        durationMinutes
    };
}


// TIME DIFFERENCE

// Calculate available travel time between two transaction timestamps
function calculateTimeDifference(previousTimestamp, currentTimestamp)
{
    const previousTime = new Date(previousTimestamp);
    const currentTime = new Date(currentTimestamp);

    const differenceMilliseconds = currentTime - previousTime;

    // Convert milliseconds to minutes
    const differenceMinutes = differenceMilliseconds / (1000 * 60);

    return differenceMinutes;
}


// TRAVEL FEASIBILITY

function isTravelPossible(availableMinutes, requiredMinutes)
{
    return availableMinutes >= requiredMinutes;
}

// Estimate travel feasibility when a driving route is unavailable
function estimateTravelPossible(geographicDistance, availableMinutes)
{
    // Convert available time to hours
    const availableHours = availableMinutes / 60;

    // Avoid dividing by zero
    if (availableHours <= 0)
    {
        return false;
    }

    // Calculate average speed required to travel the geographic distance
    const requiredSpeed = geographicDistance / availableHours;

    // Assume travel requiring more than 1000 km/h is unrealistic
    return requiredSpeed <= 1000;
}

// TRANSACTION TRAVEL ANALYSIS

async function analyzeTransactionTravel(previousTransaction, currentTransaction)
{
    // Calculate how much time passed between transactions
    const availableMinutes = calculateTimeDifference(
        previousTransaction.transactionTimestamp,
        currentTransaction.transactionTimestamp
    );

    // Calculate straight-line distance using Haversine
    const geographicDistance = calculateDistance(
        previousTransaction.merchantInfo.merchantLatitude,
        previousTransaction.merchantInfo.merchantLongitude,
        currentTransaction.merchantInfo.merchantLatitude,
        currentTransaction.merchantInfo.merchantLongitude
    );

    // Online transactions do not require physical travel to the merchant
    if (currentTransaction.transactionType === "online")
    {
        return {
            availableMinutes,
            geographicDistance,
            drivingDistance: null,
            requiredTravelMinutes: null,
            travelPossible: null
        };
    }

    // Get realistic driving distance and travel time
    const route = await getRouteInfo(
        previousTransaction.merchantInfo.merchantLongitude,
        previousTransaction.merchantInfo.merchantLatitude,
        currentTransaction.merchantInfo.merchantLongitude,
        currentTransaction.merchantInfo.merchantLatitude
    );

    // If no driving route exists, estimate feasibility using geographic distance
    if (route === null)
    {
        const travelPossible = estimateTravelPossible(
            geographicDistance,
            availableMinutes
        );

        return {
            availableMinutes,
            geographicDistance,
            drivingDistance: null,
            requiredTravelMinutes: null,
            travelPossible
        };
    }

    // Compare available time with required driving time
    const travelPossible = isTravelPossible(
        availableMinutes,
        route.durationMinutes
    );

    return {
        availableMinutes,
        geographicDistance,
        drivingDistance: route.distanceKm,
        requiredTravelMinutes: route.durationMinutes,
        travelPossible
    };
}


// EXPORTS

export {
    calculateDistance,
    getRouteInfo,
    calculateTimeDifference,
    isTravelPossible,
    estimateTravelPossible,
    analyzeTransactionTravel
};