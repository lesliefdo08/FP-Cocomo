Function Point Analysis & Basic COCOMO
📌 Project Overview

This project demonstrates two widely used software estimation techniques:

Function Point Analysis (FPA) – for measuring the functional size of a software system based on inputs, outputs, files, and inquiries.

Basic COCOMO (Constructive Cost Model) – for estimating the effort, development time, and staffing needs based on the project size in KLOC (thousand lines of code).

Together, these methods provide a structured way to estimate software size, effort, cost, and productivity.

🧾 Function Point Analysis
Function Types & Complexity Weights
Function Type	Simple	Average	Complex
External Inputs (EI)	3	4	6
External Outputs (EO)	4	5	7
External Inquiries (EQ)	3	4	6
Internal Logical Files (ILF)	7	10	15
External Interface Files (EIF)	5	7	10
Steps Performed

Identified the count of function types.

Multiplied counts with complexity weights → Unadjusted Function Points (UFP).

Applied Value Adjustment Factor (VAF) → Adjusted Function Points (AFP).

Converted FP to estimated Lines of Code (LOC) (based on programming language).

⚙️ Basic COCOMO
COCOMO Categories

Organic: Small, simple projects with small teams.

Semi-Detached: Intermediate-size projects with mixed experience levels.

Embedded: Large, complex projects with tight constraints.

Example Constants
Category	a	b	c	d
Organic	2.4	1.05	2.5	0.38
Semi-Detached	3.0	1.12	2.5	0.35
Embedded	3.6	1.20	2.5	0.32
📂 Project Structure
📦 Software-Estimation
 ┣ 📜 Complexity_Table.png   # Function type complexity weights
 ┣ 📜 FPA_Calculations.docx  # Stepwise Function Point Analysis
 ┣ 📜 COCOMO_Calculations.docx # Stepwise Basic COCOMO Estimation
 ┣ 📜 README.md              # Project documentation

🚀 How to Use

Use the FPA method to calculate Function Points (FP).

Convert FP into KLOC depending on the programming language.

Apply the Basic COCOMO equations to estimate effort and development time.

Use the results for project planning, staffing, and cost estimation.

🎯 Applications

Early-stage software project estimation

Effort, cost, and schedule prediction

Comparison of different project development models

Productivity benchmarking

👨‍💻 Author

Developed as part of a Software Engineering Lab Experiment on Software Project Estimation using FPA & Basic COCOMO.
