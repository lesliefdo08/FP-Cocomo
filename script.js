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

  // Toggle COCOMO model configuration
  const modelRadios = document.querySelectorAll('input[name="cocomoModel"]');
  const basicConfig = document.getElementById('basicCocomoConfig');
  const cocomo2Config = document.getElementById('cocomo2Config');

  modelRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'basic') {
        basicConfig.classList.remove('hidden');
        cocomo2Config.classList.add('hidden');
      } else {
        basicConfig.classList.add('hidden');
        cocomo2Config.classList.remove('hidden');
      }
    });
  });

  // Handle form submission
  document.getElementById('fpForm').addEventListener('submit', e => {
    e.preventDefault();

    // Determine which COCOMO model to use
    const selectedModel = document.querySelector('input[name="cocomoModel"]:checked').value;
    
    if (selectedModel === 'cocomo2') {
      calculateCOCOMO2();
      return;
    }

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

  // COCOMO II Calculation Function
  function calculateCOCOMO2() {
    // Validate GSC ratings first
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
    const CAF = 0.65 + 0.01 * sumGSC;
    const FP = countTotal * CAF;

    // Get COCOMO II inputs
    const numScreens = +document.getElementById('numScreens').value || 0;
    const numReports = +document.getElementById('numReports').value || 0;
    const num3GL = +document.getElementById('num3GLComponents').value || 0;
    
    const screenWeight = +document.getElementById('screenComplexity').value;
    const reportWeight = +document.getElementById('reportComplexity').value;
    const componentWeight = +document.getElementById('componentComplexity').value;
    
    const reusePercent = +document.getElementById('reusePercent').value || 0;
    const prodRate = +document.getElementById('devExperience').value;

    // Step 1: Calculate Object Points
    const objectPoints = (numScreens * screenWeight) + (numReports * reportWeight) + (num3GL * componentWeight);

    // Step 2: Calculate New Object Points (NOP)
    const NOP = (objectPoints * (100 - reusePercent)) / 100;

    // Step 3: Calculate Effort
    const effort = NOP / prodRate;

    // Format results
    let result = `COCOMO II - Application Composition Model Results:\n\n`;
    result += `=== Function Point Analysis ===\n`;
    functionTypes.forEach(type => {
      const count = +document.getElementById(`${type}_count`).value || 0;
      const weight = getSelectedWeight(type);
      result += `${type}: Count = ${count}, Weight = ${weight}, Total = ${count * weight}\n`;
    });
    result += `\nUnadjusted Function Points (UFP) = ${countTotal}\n`;
    result += `Summation FI (Sum of 14 GSC ratings) = ${sumGSC}\n`;
    result += `Complexity Adjustment Factor (CAF) = 0.65 + 0.01 * ${sumGSC} = ${CAF.toFixed(3)}\n`;
    result += `Final Adjusted Function Points (FP) = ${countTotal} * ${CAF.toFixed(3)} = ${FP.toFixed(3)}\n\n`;

    result += `=== COCOMO II Object Point Analysis ===\n\n`;
    result += `Step 1: Object Counts\n`;
    result += `  Screens: ${numScreens} × Weight ${screenWeight} = ${numScreens * screenWeight}\n`;
    result += `  Reports: ${numReports} × Weight ${reportWeight} = ${numReports * reportWeight}\n`;
    result += `  3GL Components: ${num3GL} × Weight ${componentWeight} = ${num3GL * componentWeight}\n`;
    result += `  Total Object Points = ${objectPoints}\n\n`;

    result += `Step 2: Adjust for Reuse\n`;
    result += `  Reuse Percentage = ${reusePercent}%\n`;
    result += `  New Object Points (NOP) = ${objectPoints} × (100 - ${reusePercent}) / 100\n`;
    result += `  NOP = ${NOP.toFixed(2)}\n\n`;

    result += `Step 3: Calculate Effort\n`;
    result += `  Productivity Rate (PROD) = ${prodRate}\n`;
    result += `  Effort = NOP / PROD\n`;
    result += `  Effort = ${NOP.toFixed(2)} / ${prodRate}\n`;
    result += `  Effort = ${effort.toFixed(3)} person-months\n\n`;

    const devExperienceText = {
      4: 'Very Low',
      7: 'Low',
      13: 'Nominal',
      25: 'High',
      50: 'Very High'
    }[prodRate] || 'Unknown';

    result += `=== Summary ===\n`;
    result += `Developer Experience: ${devExperienceText}\n`;
    result += `Total Object Points: ${objectPoints}\n`;
    result += `New Object Points (after reuse): ${NOP.toFixed(2)}\n`;
    result += `Estimated Effort: ${effort.toFixed(3)} person-months\n`;
    result += `Estimated Duration: ${(effort * 0.4).toFixed(2)} months (approx.)\n`;
    result += `Estimated Team Size: ${(effort / (effort * 0.4)).toFixed(2)} persons (avg.)\n\n`;

    result += `Note: COCOMO II Application Composition Model is best suited for\n`;
    result += `early-stage estimation when building GUI-intensive applications.\n`;

    const resultsSection = document.getElementById('resultsSection');
    const resultsOutput = document.getElementById('resultsOutput');
    resultsOutput.textContent = result;
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }
});
