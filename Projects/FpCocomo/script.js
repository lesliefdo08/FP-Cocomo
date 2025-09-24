document.addEventListener('DOMContentLoaded', () => {
  const types = ['EI', 'EO', 'EQ', 'ILF', 'EIF'];
  const questions = [
    "Does the system require reliable back-up/recovery?", "Are specialized data communications required?",
    "Are there distributed processing functions?", "Is performance critical?",
    "Will run in heavily utilized operating environment?", "On-line data entry required?",
    "For on-line data entry, will it require multiple screens?", "Are ILF's updated on-line?",
    "Are input, output, files, or inquiries complex?", "Is the internal processing complex?",
    "Is the code designed to be reusable?", "Are conversion and installation included?",
    "Is the system designed for installation in different organizations?",
    "Is the application designed to facilitate change and ease of use?"
  ];

  // Generate GSC questions
  document.getElementById('gscContainer').innerHTML = questions.map((q, i) => 
    `<div class="gsc-item"><label for="gsc_${i}">${q}</label><input type="number" id="gsc_${i}" min="0" max="5" value="0" aria-label="${q}" /></div>`
  ).join('');

  const getWeight = type => +document.querySelector(`input[name="${type}_complexity"]:checked`).value || 0;
  
  const updateTotals = () => {
    let total = 0;
    types.forEach(type => {
      const count = +document.getElementById(`${type}_count`).value || 0;
      const weight = getWeight(type);
      const subtotal = count * weight;
      document.getElementById(`${type}_total`).textContent = subtotal;
      total += subtotal;
    });
    document.getElementById('grand_total').textContent = total;
  };

  // Add event listeners
  types.forEach(type => {
    document.getElementById(`${type}_count`).addEventListener('input', updateTotals);
    document.querySelectorAll(`input[name="${type}_complexity"]`).forEach(r => r.addEventListener('change', updateTotals));
  });
  updateTotals();

  // Form submission
  document.getElementById('fpForm').addEventListener('submit', e => {
    e.preventDefault();

    // Calculate GSC sum
    let sumGSC = 0;
    for (let i = 0; i < questions.length; i++) {
      const rating = +document.getElementById(`gsc_${i}`).value;
      if (isNaN(rating) || rating < 0 || rating > 5) {
        alert(`Please enter a valid 0-5 rating for: "${questions[i]}"`);
        return;
      }
      sumGSC += rating;
    }

    const countTotal = +document.getElementById('grand_total').textContent || 0;
    const CAF = 0.65 + 0.01 * sumGSC;
    const FP = countTotal * CAF;

    // COCOMO constants
    const cocomo = {
      Organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
      'Semi-Detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
      Embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
    };

    const mode = document.getElementById('cocomoMode').value;
    const { a, b, c, d } = cocomo[mode];
    const locPerFP = +document.getElementById('locPerFP').value || 100;
    const LOC = FP * locPerFP;
    const KLOC = LOC / 1000;

    let effort = 0, devTime = 0, staff = 0;
    if (KLOC > 0) {
      effort = a * Math.pow(KLOC, b);
      devTime = c * Math.pow(effort, d);
      staff = devTime > 0 ? effort / devTime : 0;
    }

    const fmt = (x, d = 2) => Number.isFinite(x) ? x.toFixed(d) : '0.00';

    let result = `Function Point Calculation Details:\n\n`;
    types.forEach(type => {
      const count = +document.getElementById(`${type}_count`).value || 0;
      const weight = getWeight(type);
      result += `${type}: Count = ${count}, Weight = ${weight}, Total = ${count * weight}\n`;
    });
    
    result += `\nUnadjusted Function Points (UFP) = ${countTotal}\n`;
    result += `Summation FI (Sum of 14 GSC ratings) = ${sumGSC}\n`;
    result += `Complexity Adjustment Factor (CAF) = 0.65 + 0.01 * ${sumGSC} = ${CAF.toFixed(3)}\n`;
    result += `Final Adjusted Function Points (FP) = ${countTotal} * ${CAF.toFixed(3)} = ${FP.toFixed(3)}\n\n`;

    result += `Basic COCOMO Estimation Details:\n`;
    result += `Project Mode: ${mode}\n`;
    result += `LOC per FP used: ${locPerFP} LOC/FP\n`;
    result += `Estimated Size: LOC = FP * LOC/FP = ${FP.toFixed(3)} * ${locPerFP} = ${LOC.toFixed(2)} LOC (${KLOC.toFixed(3)} KLOC)\n\n`;

    if (KLOC <= 0) {
      result += `NOTE: Estimated size (KLOC) is zero — COCOMO results are not meaningful.\n`;
    } else {
      result += `Effort (Person-Months) = a * (KLOC)^b = ${a} * (${KLOC.toFixed(3)})^${b} = ${fmt(effort)} PM\n`;
      result += `Development Time (Months) = c * (Effort)^d = ${c} * (${fmt(effort)})^${d} = ${fmt(devTime)} months\n`;
      result += `Average Staff Required = Effort / Development Time = ${fmt(staff)} persons\n\n`;
    }

    const resultsSection = document.getElementById('resultsSection');
    document.getElementById('resultsOutput').textContent = result;
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  });
});