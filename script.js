document.addEventListener('DOMContentLoaded', () => {
  const functionTypes = ['EI', 'EO', 'EQ', 'ILF', 'EIF'];

  const gscQuestions = [
    "Does the system require reliable back-up/recovery?",
    "Are specialized data communications required?",
    "Are there distributed processing functions?",
    "Is performance critical?",
    "Will run in heavily utilized operating environment?",
    "On-line data entry required?",
    "For on-line data entry, will it require multiple screens?",
    "Are ILF’s updated on-line?",
    "Are input, output, files, or inquiries complex?",
    "Is the internal processing complex?",
    "Is the code designed to be reusable?",
    "Are conversion and installation included?",
    "Is the system designed for installation in different organizations?",
    "Is the application designed to facilitate change and ease of use?"
  ];

  // Populate GSC questions section
  const gscContainer = document.getElementById('gscContainer');
  gscQuestions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'gsc-item';
    div.innerHTML = `
      <label for="gsc_${i}">${q}</label>
      <input type="number" id="gsc_${i}" min="0" max="5" value="0" aria-label="${q}" />
    `;
    gscContainer.appendChild(div);
  });

  // Function to get selected weight (now numeric value)
  function getSelectedWeight(type) {
    const radios = document.querySelectorAll(`input[name="${type}_complexity"]`);
    for (const radio of radios) {
      if (radio.checked) return parseFloat(radio.value) || 0;
    }
    return 0;
  }

  // Update weighted totals live for each function type
  function updateTotals() {
    let grandTotal = 0;
    functionTypes.forEach(type => {
      const countInput = document.getElementById(`${type}_count`);
      const count = parseFloat(countInput.value) || 0;
      const weight = getSelectedWeight(type);
      const total = count * weight;
      document.getElementById(`${type}_total`).textContent = total;
      grandTotal += total;
    });
    document.getElementById('grand_total').textContent = grandTotal;
  }

  // Attach event listeners
  functionTypes.forEach(type => {
    const countEl = document.getElementById(`${type}_count`);
    if (countEl) countEl.addEventListener('input', updateTotals);
    const radios = document.querySelectorAll(`input[name="${type}_complexity"]`);
    radios.forEach(radio => {
      radio.addEventListener('change', updateTotals);
    });
  });

  updateTotals(); // Initial totals

  // Handle form submission
  document.getElementById('fpForm').addEventListener('submit', e => {
    e.preventDefault();

    // Validate GSC ratings and sum them
    let sumGSC = 0;
    for (let i = 0; i < gscQuestions.length; i++) {
      const el = document.getElementById(`gsc_${i}`);
      let rating = parseInt(el.value);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        alert(`Please enter a valid 0-5 rating for: "${gscQuestions[i]}"`);
        return;
      }
      sumGSC += rating;
    }

    const countTotal = parseFloat(document.getElementById('grand_total').textContent) || 0;

    // Calculate CAF and FP
    const CAF = 0.65 + 0.01 * sumGSC;
    const FP = countTotal * CAF;

    // Basic COCOMO constants (unchanged)
    const cocomoConstants = {
      Organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
      'Semi-Detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
      Embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
    };

    const mode = document.getElementById('cocomoMode').value;
    const { a, b, c, d } = cocomoConstants[mode];

    // LOC per FP (configurable)
    const locPerFP = parseFloat(document.getElementById('locPerFP').value) || 100;
    const LOC = FP * locPerFP;
    const KLOC = LOC / 1000;

    // Calculate effort, dev time, staff (guard if KLOC is zero or tiny)
    let effort = 0, devTime = 0, staff = 0;
    if (KLOC > 0) {
      effort = a * Math.pow(KLOC, b);
      devTime = c * Math.pow(effort, d);
      staff = devTime > 0 ? (effort / devTime) : 0;
    }

    // Compose detailed result text
    const fmt = (x, d = 2) => Number.isFinite(x) ? x.toFixed(d) : '0.00';

    let resultText = `Function Point Calculation Details:\n\n`;
    functionTypes.forEach(type => {
      const count = parseFloat(document.getElementById(`${type}_count`).value) || 0;
      const weight = getSelectedWeight(type);
      const total = count * weight;
      resultText += `${type}: Count = ${count}, Weight = ${weight}, Total = ${total}\n`;
    });
    resultText += `\nUnadjusted Function Points (UFP) = ${countTotal}\n`;
    resultText += `Summation FI (Sum of 14 GSC ratings) = ${sumGSC}\n`;
    resultText += `Complexity Adjustment Factor (CAF) = 0.65 + 0.01 * ${sumGSC} = ${CAF.toFixed(3)}\n`;
    resultText += `Final Adjusted Function Points (FP) = ${countTotal} * ${CAF.toFixed(3)} = ${FP.toFixed(3)}\n\n`;

    resultText += `Basic COCOMO Estimation Details:\n`;
    resultText += `Project Mode: ${mode}\n`;
    resultText += `LOC per FP used: ${locPerFP} LOC/FP\n`;
    resultText += `Estimated Size: LOC = FP * LOC/FP = ${FP.toFixed(3)} * ${locPerFP} = ${LOC.toFixed(2)} LOC (${KLOC.toFixed(3)} KLOC)\n\n`;

    if (KLOC <= 0) {
      resultText += `NOTE: Estimated size (KLOC) is zero — COCOMO results are not meaningful.\n`;
    } else {
      resultText += `Effort (Person-Months) = a * (KLOC)^b = ${a} * (${KLOC.toFixed(3)})^${b} = ${fmt(effort,2)} PM\n`;
      resultText += `Development Time (Months) = c * (Effort)^d = ${c} * (${fmt(effort,2)})^${d} = ${fmt(devTime,2)} months\n`;
      resultText += `Average Staff Required = Effort / Development Time = ${fmt(staff,2)} persons\n\n`;
    }

    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    const resultsOutput = document.getElementById('resultsOutput');
    resultsOutput.textContent = resultText;
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  });
});
