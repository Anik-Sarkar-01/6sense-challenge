// 1. Extract the **longest strictly increasing substring** (consecutive letters in alphabetical order and lowercase).
// 2. If multiple substrings of equal length exist, concatenate them.
// 3. Append the starting and ending index of the substring in the product name.
// 4. Add the **hashed value** of the product name at the beginning as a prefix with a dash (-).
// 5. **Format**: The final product code should follow this structure:

// **<hashed product name>-<start_index><substring><end_index>**

// **Example**:

// For a product named **"Alpha Sorter"**:

// - Longest increasing substrings: **"alp"** and **"ort"**.
// - Starting and ending indices: 0 and 8.
// - Generated code: **"p48asd4-0alport8"**.

// **Note**: Ensure product codes are unique.

const crypto = require('crypto');

function generateCodeFromName(name) {
  const compact = name.toLowerCase().split(' ').join('');
  const letters = compact.split('');

  let result = [];
  let maxLen = 0;
  let start = 0;

  for (let i = 1; i <= letters.length; i++) {
    if (i === letters.length || letters[i] <= letters[i - 1]) {
      const len = i - start;
      const substring = compact.slice(start, i);

      if (len > maxLen) {
        maxLen = len;
        result = [{ value: substring, start, end: i - 1 }];
      } else if (len === maxLen) {
        result.push({ value: substring, start, end: i - 1 });
      }
      start = i;
    }
  }

  const merged = result.map(r => r.value).join('');
  const firstStart = result[0].start;
  const lastEnd = result[result.length - 1].end;

  const hash = crypto.createHash('sha256').update(name).digest("hex").slice(0, 7);

  return `${hash}-${firstStart}${merged}${lastEnd}`;
}


