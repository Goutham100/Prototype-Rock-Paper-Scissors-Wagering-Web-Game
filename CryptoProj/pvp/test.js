
let users = {};

// Initialize the arrays for each user ID
users["1"] = [];
users["2"] = [];

// Now you can safely push elements to the arrays
users["1"].push("steve");
users["1"].push("steve2");
users["2"].push("jeff");
users["2"].push("jeff2");

// Access and log the first element of the array at key "1"
console.log(users["1"][1]); // Outputs: steve
