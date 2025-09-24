# Function Point & COCOMO Estimation Tool

A modern, mobile-responsive web application for estimating software project size and effort using Function Point Analysis and Basic COCOMO model.

## Features

- **Function Point Calculation**: Calculate Unadjusted Function Points (UFP) using five function types
- **General System Characteristics**: 14 complexity factors for accurate adjustment
- **Basic COCOMO Estimation**: Calculate effort, development time, and required staff
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live calculation of totals as you input data
- **Modern UI**: Clean, professional interface with smooth animations

## Function Types Supported

1. **External Inputs (EI)** - Simple: 3, Average: 4, Complex: 6
2. **External Outputs (EO)** - Simple: 4, Average: 5, Complex: 7
3. **External Inquiries (EQ)** - Simple: 3, Average: 4, Complex: 6
4. **Internal Logical Files (ILF)** - Simple: 7, Average: 10, Complex: 15
5. **External Interface Files (EIF)** - Simple: 5, Average: 7, Complex: 10

## COCOMO Project Types

- **Organic**: Small teams, familiar environment (a=2.4, b=1.05)
- **Semi-Detached**: Medium teams, mixed experience (a=3.0, b=1.12)
- **Embedded**: Large teams, complex systems (a=3.6, b=1.20)

## How to Use

1. **Step 1**: Enter counts for each function type and select complexity level
2. **Step 2**: Rate 14 General System Characteristics (0-5 scale)
3. **Step 3**: Select project type and adjust LOC per Function Point
4. **Calculate**: Get detailed estimation results

## Technical Details

- **Total Lines of Code**: 396 lines (HTML: 115, CSS: 170, JS: 111)
- **Mobile-First Design**: Responsive breakpoints at 900px, 768px, and 480px
- **Modern JavaScript**: ES6+ features, optimized for performance
- **CSS Grid & Flexbox**: Advanced layout techniques for responsive design
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## Live Demo

Access the tool locally by serving the files with any HTTP server:

```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Author

Made by Leslie Fernando

## License

Open source - feel free to use and modify as needed.