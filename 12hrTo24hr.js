/**
 * Optimized function to convert a 12-hour time string (HH:MM:SS AM/PM)
 * to a 24-hour time string (HH:MM:SS).
 * * This function uses Regular Expressions for clear parsing and String.prototype.padStart()
 * to ensure the final 24-hour output (HH:MM:SS) is always correctly zero-padded.
 * * @param {string} hr12String - The time string in 'HH:MM:SS AM/PM' format.
 * @returns {string} The time string in 'HH:MM:SS' (24-hour) format.
 * @throws {TypeError} If the input is not a string.
 * @throws {Error} If the format or time values are invalid.
 */
function convert12hrTo24hr(hr12String) {
  // 1. Initial Type Check
  if (typeof hr12String !== "string") {
    throw new TypeError("Input must be a string in 'HH:MM:SS AM/PM' format.");
  }

  // 2. Parsing with Regular Expression
  // Regex captures hours (1), minutes (2), seconds (3), and meridiem (4).
  // It strictly requires a format like XX:XX:XX YM (e.g., 04:00:00 PM).
  const regex = /^(\d{2}):(\d{2}):(\d{2})\s(AM|PM)$/i;
  const match = hr12String.trim().match(regex);

  if (!match) {
    throw new Error("Invalid time format. Expected 'HH:MM:SS AM/PM'.");
  }

  // Destructure the captured groups from the regex match
  // Note: The first element `_` is the full matched string
  let [_, hr, min, sec, meridiem] = match;

  // Convert time strings to numbers and ensure meridiem is uppercase for comparison
  let hour = Number(hr);
  const minute = Number(min);
  const second = Number(sec);
  meridiem = meridiem.toUpperCase();

  // 3. Robust Range Validation
  // This checks if the numerical values conform to a standard 12-hour clock.
  if (
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    throw new Error(
      "Invalid time value: Hours must be 01-12, Minutes/Seconds 00-59."
    );
  }

  // 4. Conversion Logic
  if (meridiem === "AM") {
    // 12 AM (midnight) must be converted to 00
    if (hour === 12) {
      hour = 0;
    }
    // 1 AM to 11 AM remains 1 to 11
  } else {
    // meridiem === "PM"
    // 12 PM (noon) remains 12
    if (hour !== 12) {
      // 1 PM to 11 PM: add 12 to the hour
      hour += 12;
    }
  }

  // 5. Output Formatting with padStart()
  // Ensures all time components (HH, MM, SS) are two digits with leading zeros.
  const hr24String = String(hour).padStart(2, "0");
  const minString = String(minute).padStart(2, "0");
  const secString = String(second).padStart(2, "0");

  return `${hr24String}:${minString}:${secString}`;
}

// --- Example Usage and Edge Case Testing ---

// Test Cases (matching the original requirements):
console.log("12:00:00 AM", "=>", convert12hrTo24hr("12:00:00 AM")); // Expect: 00:00:00
console.log("11:59:59 AM", "=>", convert12hrTo24hr("11:59:59 AM")); // Expect: 11:59:59
console.log("12:00:00 PM", "=>", convert12hrTo24hr("12:00:00 PM")); // Expect: 12:00:00
console.log("04:00:00 PM", "=>", convert12hrTo24hr("04:00:00 PM")); // Expect: 16:00:00
console.log("11:59:59 PM", "=>", convert12hrTo24hr("11:59:59 PM")); // Expect: 23:59:59

// Additional Edge Cases (testing the zero-padding fix):
console.log("01:05:01 AM", "=>", convert12hrTo24hr("01:05:01 AM")); // Expect: 01:05:01

// Invalid Input Testing (Error Handling)
try {
  convert12hrTo24hr("13:00:00 PM");
} catch (e) {
  console.error("Invalid Hour Check (Expected Error):", e.message); // Invalid time value...
}

try {
  convert12hrTo24hr("10:65:00 AM");
} catch (e) {
  console.error("Invalid Minute Check (Expected Error):", e.message); // Invalid time value...
}

try {
  convert12hrTo24hr("10:00 00 AM");
} catch (e) {
  console.error("Invalid Format Check (Expected Error):", e.message); // Invalid time format...
}

try {
  convert12hrTo24hr(12345);
} catch (e) {
  console.error("Invalid Type Check (Expected Error):", e.message); // Input must be a string...
}
