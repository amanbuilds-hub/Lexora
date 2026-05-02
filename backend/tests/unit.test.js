const crypto = require('crypto');

// 1. Earning Split Logic Test
const calculateSplits = (amount) => ({
  family: amount * 0.6,
  prison: amount * 0.2,
  rehab: amount * 0.2
});

describe('Earning System Logic', () => {
  test('should split 1000 INR into 600, 200, 200', () => {
    const splits = calculateSplits(1000);
    expect(splits.family).toBe(600);
    expect(splits.prison).toBe(200);
    expect(splits.rehab).toBe(200);
  });
});

// 2. Blockchain Hash Chaining Test
const createHash = (data, prevHash) => {
  return crypto.createHash('sha256').update(JSON.stringify({ data, prevHash })).digest('hex');
};

describe('Blockchain Integrity', () => {
  test('should create valid chain where hash depends on previous hash', () => {
    const h1 = createHash('tx1', '0');
    const h2 = createHash('tx2', h1);
    const h3 = createHash('tx3', h2);
    
    expect(h2).not.toBe(h1);
    expect(h3).not.toBe(h2);
    // If we change tx2, h2 and h3 must change
    const h2_alt = createHash('tx2_tampered', h1);
    const h3_alt = createHash('tx3', h2_alt);
    expect(h3_alt).not.toBe(h3);
  });
});

// 3. Grievance Urgency Logic
const detectUrgency = (description) => {
  const urgentKeywords = ['abuse', 'blood', 'beating'];
  return urgentKeywords.some(word => description.toLowerCase().includes(word)) ? 'Urgent' : 'Standard';
};

describe('Grievance AI Logic', () => {
  test('should flag "physical abuse" as Urgent', () => {
    expect(detectUrgency('I saw some abuse in the cell')).toBe('Urgent');
  });
  test('should flag "food quality" as Standard', () => {
    expect(detectUrgency('The food is cold')).toBe('Standard');
  });
});
