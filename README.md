# FP-COCOMO Calculator

A professional software estimation tool for Function Point Analysis and COCOMO calculations. Available as both a **desktop application** (100% offline) and **web application**.

## 🚀 Download

### Desktop Application (Recommended)
**[Download for Windows](https://github.com/lesliefdo08/FP-Cocomo/releases)** • No installation required • Works offline

**System Requirements:** Windows 7+ (64-bit) • 100 MB disk space • 512 MB RAM

### Web Application
**[Open Web Version](https://fpcocomo.netlify.app/)** • No download needed • Works in any browser

---

## ✨ Features

- **Function Point Calculation** with 5 function types (EI, EO, EQ, ILF, EIF)
- **14 General System Characteristics** for complexity adjustment
- **Basic COCOMO (COCOMO 81)** - Organic, Semi-Detached, Embedded modes
- **COCOMO II Application Composition Model** - Object Points method for early-stage estimation
- **Real-time Calculations** as you input data
- **Detailed Results** with complete breakdown and formulas
- **Mobile Responsive** interface
- **Dual Estimation Models** - Choose between Basic COCOMO or COCOMO II

## 📊 Function Types

| Type | Simple | Average | Complex |
|------|--------|---------|---------|
| External Inputs (EI) | 3 | 4 | 6 |
| External Outputs (EO) | 4 | 5 | 7 |
| External Inquiries (EQ) | 3 | 4 | 6 |
| Internal Logical Files (ILF) | 7 | 10 | 15 |
| External Interface Files (EIF) | 5 | 7 | 10 |

## 🎯 COCOMO Models

### Basic COCOMO (COCOMO 81)
- **Organic** – Small teams, familiar environment (a=2.4, b=1.05)
- **Semi-Detached** – Medium teams, mixed experience (a=3.0, b=1.12)
- **Embedded** – Large teams, complex systems (a=3.6, b=1.20)

### COCOMO II - Application Composition
- **Object Points Method** – Screens, Reports, 3GL Components
- **Complexity Weights** – Simple, Medium, Difficult classification
- **Reuse Adjustment** – Factor in percentage of reusable components
- **Productivity Rates** – Based on developer experience (Very Low to Very High)

## 📝 Usage

1. **Step 1:** Enter counts for each function type and select complexity level
2. **Step 2:** Rate 14 General System Characteristics (0-5 scale)
3. **Step 3:** Choose between Basic COCOMO or COCOMO II
   - **Basic COCOMO:** Select project mode and LOC per FP
   - **COCOMO II:** Enter object counts (screens, reports, components), complexity levels, reuse %, and developer experience
4. **Calculate:** Get detailed estimation results with complete breakdown

---

## �️ For Developers

### Build From Source

```bash
# Clone repository
git clone https://github.com/lesliefdo08/FP-Cocomo.git
cd FP-Cocomo

# Install dependencies
npm install

# Run desktop app in development
npm start

# Build executable
npm run build:win     # Windows
npm run build:mac     # macOS
npm run build:linux   # Linux
```

### Technology Stack

- **Desktop:** Electron (cross-platform)
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Build:** Electron Builder
- **Deployment:** Netlify (web version)

### Project Structure

```
FP-Cocomo/
├── main.js          # Electron main process
├── index.html       # Application UI
├── script.js        # Business logic
├── style.css        # Styling
├── package.json     # Dependencies & build config
└── README.md        # Documentation
```

---

## 📄 License

MIT License - Free and open source

## 👨‍💻 Author

**Leslie Fernando**  
GitHub: [@lesliefdo08](https://github.com/lesliefdo08)

## � Support

For issues or questions, please open an issue on [GitHub](https://github.com/lesliefdo08/FP-Cocomo/issues)

---

**Made with ❤️ by Leslie Fernando**