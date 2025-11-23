function isPangram(input) {
  const ALPHABET_SIZE = 26;
  // Edge Case Handling: Coerce the input to a string.
  // e.g., String(123) -> "123", String(null) -> "null", String({}) -> "[object Object]"
  const str = String(input);

  // 1. Initialize a Set to store unique letters. Sets automatically handle duplicates.
  const uniqueLetters = new Set();

  // 2. Iterate through the string.
  for (let i = 0; i < str.length; i++) {
    // Convert the character to lowercase to make the check case-insensitive.
    const char = str[i].toLowerCase();

    // 3. Check if the character is a lowercase English letter ('a' to 'z').
    // This step efficiently ignores spaces, punctuation, and numbers.
    if (char >= "a" && char <= "z") {
      uniqueLetters.add(char);
    }

    // Optimization: If the Set size reaches 26, we've found all letters and can stop early.
    if (uniqueLetters.size === ALPHABET_SIZE) {
      return true;
    }
  }

  // 4. After iterating through the whole string, check the final size of the Set.
  return uniqueLetters.size === ALPHABET_SIZE;
}

console.log(isPangram("The quick brown fox jumps over the lazy dog."));
