# BIT GPA Calculator Web

A React web application for calculating GPA and degree eligibility for the UCSC Bachelor of Information Technology (BIT) program data included in this project.

The app lets users select grades year by year, view year GPA values, track earned credits, check progression criteria, and view final overall GPA and BIT degree eligibility.

## Project Features

- Welcome screen with direct entry points for Year 1, Year 2, and Year 3.
- GPA calculation screens for:
  - Year 1: Semester 1 and Semester 2
  - Year 2: Semester 3 and Semester 4
  - Year 3: Semester 5 and Semester 6
- Grade dropdowns for GPA subjects.
- Pass/Fail dropdowns for enhancement/non-GPA subjects.
- Year GPA calculation using the grade point value table in `src/App.js`.
- Overall GPA calculation across all selected GPA subjects.
- Earned credit and earned GPA credit summaries for each year.
- Year progression warnings based on the criteria implemented in the app.
- Degree eligibility summary for the full BIT degree.
- Repeat-subject listing for subjects below the required grade threshold.
- Year 3 optional-subject handling.
- Final year project eligibility check.
- Reset button for clearing all selected grades in the current year.
- Light and dark theme toggle.
- Responsive layout using Tailwind utility classes and CSS variables.
- Web app manifest and icon assets in `public`.
- SPA redirect rule in `public/netlify.toml`.

## Tech Stack

- React `19.1.0`
- React DOM `19.1.0`
- React Scripts `5.0.1`
- Lucide React `0.522.0`
- Tailwind CSS utility classes
- CSS variables for light and dark theme styling
- Testing Library packages
- Web Vitals

## Project Structure

```text
BIT-GPA-Cal-Web/
|-- public/
|   |-- 44.ico
|   |-- 77.ico
|   |-- favicon.ico
|   |-- index.html
|   |-- logo192.png
|   |-- logo512.png
|   |-- manifest.json
|   |-- netlify.toml
|   |-- preview-image.png
|   `-- robots.txt
|-- src/
|   |-- App.css
|   |-- App.js
|   |-- App.test.js
|   |-- index.css
|   |-- index.js
|   |-- logo.svg
|   |-- reportWebVitals.js
|   `-- setupTests.js
|-- .gitignore
|-- package-lock.json
|-- package.json
|-- README.md
`-- tailwind.config.js
```

## Main Files

| File | Purpose |
| --- | --- |
| `src/App.js` | Main application component, subject data, grade table, GPA calculations, eligibility logic, navigation, and UI rendering. |
| `src/index.js` | React entry point that renders `App`. |
| `src/index.css` | Tailwind directives, theme CSS variables, global styles, scrollbar styles, and utility overrides. |
| `src/App.css` | Default Create React App styles. |
| `src/reportWebVitals.js` | Web Vitals helper. |
| `src/setupTests.js` | Jest DOM test setup. |
| `public/index.html` | HTML template, metadata, Tailwind CDN script, Google font, Open Graph metadata, and Google Analytics tag. |
| `public/manifest.json` | Web app manifest for the BIT GPA app. |
| `public/netlify.toml` | Redirects all routes to `index.html` with status `200`. |
| `tailwind.config.js` | Tailwind configuration with class-based dark mode and `src` content paths. |
| `package.json` | Project metadata, dependencies, and npm scripts. |

## Available Scripts

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

Runs the app with `react-scripts start`.

### Build Production Files

```bash
npm run build
```

Creates the production build with `react-scripts build`.

### Run Tests

```bash
npm test
```

Runs tests with `react-scripts test`.

### Eject

```bash
npm run eject
```

Runs `react-scripts eject`.

## Grade Point Values

The GPA grade point values are defined in `src/App.js`.

| Grade | GPV |
| --- | ---: |
| A+ | 4.0 |
| A | 4.0 |
| A- | 3.7 |
| B+ | 3.3 |
| B | 3.0 |
| B- | 2.7 |
| C+ | 2.3 |
| C | 2.0 |
| C- | 1.7 |
| D+ | 1.3 |
| D | 1.0 |
| E | 0.0 |
| AB(absent) | 0.0 |

GPA subject dropdowns also include `Not Sit`.

Enhancement/non-GPA subjects use:

- `Pass`
- `Fail`

## GPA Calculation

Year GPA and overall GPA are calculated from GPA subjects only.

For each selected GPA subject with a valid GPV:

```text
grade point value * subject GPA credits
```

The GPA is calculated as:

```text
total weighted GPA value / total GPA credits
```

The result is shown with two decimal places.

## Credit Counting

The app counts earned credits as implemented in `src/App.js`:

- GPA subjects count as earned credits when the selected grade has GPV `2.0` or above.
- Non-GPA subjects count as earned credits when the selected value is `Pass`.
- Year summaries show total credits earned and total GPA credits earned for the selected year.
- The Year 3 degree credit panel shows total credits earned across all levels and per-level credit totals.

## Progression Criteria

The app checks year progression using the logic in `getYearCalculationStatus`.

For each year, the app checks:

- GPA is at least `2.00`.
- At least `20` GPA credits have grade point `2.00` or above.
- All enhancement/non-GPA courses are `Pass`.
- No required GPA subject has grade point below `1.00`.
- All required GPA subjects have a selected grade.

For Year 3, the app also checks:

- At least one optional Level III subject is selected and passed with grade `C` or better.
- The final year project subject `IT5106*` has grade `C` or better.

## Degree Eligibility Criteria

The overall degree eligibility page uses the logic in `getDegreeEligibility`.

The app checks:

- Total earned credits are at least `90`.
- Overall GPA is at least `2.00`.
- Level I has at least `20` credits with grade `C` or better.
- Level II has at least `20` credits with grade `C` or better.
- Level III has at least `20` credits with grade `C` or better.
- Final Year Project `IT5106*` has grade `C` or better.
- All enhancement/non-GPA subjects are `Pass`.
- No GPA subject has grade point below `D`.
- At least one Level III optional subject is passed with grade `C` or better.

The app also lists repeat subjects when GPA subjects are below `C`, `Not Sit`, `AB(absent)`, or not selected where required.

## Subject Data

All subject data is defined inside `src/App.js`.

### Year 1

#### Semester 1

| Code | Subject | Credits | GPA Credits | Type |
| --- | --- | ---: | ---: | --- |
| IT1106 | Information Systems | 4 | 4 | GPA |
| IT1206 | Computer Systems | 4 | 4 | GPA |
| IT1306 | Free and Open Source Software for Personal Computing | 3 | 3 | GPA |
| IT1406 | Introduction to Programming | 4 | 4 | GPA |
| IT1506 | Fundamentals of Mathematics | 1 | 1 | GPA |

#### Semester 2

| Code | Subject | Credits | GPA Credits | Type |
| --- | --- | ---: | ---: | --- |
| EN2106 | Communication Skills I | 2 | 0 | Enhancement |
| IT2106 | Mathematics for Computing I | 3 | 3 | GPA |
| IT2206 | Fundamentals of Software Engineering | 4 | 4 | GPA |
| IT2306 | Database Systems | 4 | 4 | GPA |
| IT2406 | Web Application Development I | 4 | 4 | GPA |

### Year 2

#### Semester 3

| Code | Subject | Credits | GPA Credits | Type |
| --- | --- | ---: | ---: | --- |
| EN3106 | Communication Skills II | 2 | 0 | Enhancement |
| IT3106 | Object Oriented Analysis & Design | 3 | 3 | GPA |
| IT3206 | Data Structures and Algorithms | 3 | 3 | GPA |
| IT3306 | Data Management Systems | 3 | 3 | GPA |
| IT3406 | Web Application Development II | 4 | 4 | GPA |

#### Semester 4

| Code | Subject | Credits | GPA Credits | Type |
| --- | --- | ---: | ---: | --- |
| IT4106 | User Experience Design | 3 | 3 | GPA |
| IT4206 | Enterprise Application Development | 4 | 4 | GPA |
| IT4306 | Information Technology Project Management | 3 | 3 | GPA |
| IT4406 | Agile Software Development | 4 | 4 | GPA |
| IT4506 | Computer Networks | 3 | 3 | GPA |

### Year 3

#### Semester 5

| Code | Subject | Credits | GPA Credits | Type |
| --- | --- | ---: | ---: | --- |
| EN5106 | Fundamentals of Management & Entrepreneurship (EN) | 2 | 0 | Enhancement |
| IT5206 | Professional Practice | 3 | 3 | GPA |
| IT5306 | Principles of Information Security | 3 | 3 | GPA |
| IT5406 | Systems & Network Administration | 3 | 3 | GPA |
| IT5506 | Mathematics for Computing II | 3 | 3 | Optional GPA |

#### Semester 6

| Code | Subject | Credits | GPA Credits | Type |
| --- | --- | ---: | ---: | --- |
| EN6106 | Emerging Topics in Information Technology (EN) | 2 | 0 | Enhancement |
| IT6206 | Software Quality Assurance | 3 | 3 | GPA |
| IT6306 | Mobile Application Development | 4 | 4 | GPA |
| IT6406 | Network Security and Audit | 3 | 3 | GPA |
| IT6506 | e-Business Technologies | 3 | 3 | Optional GPA |
| IT5106* | Final Year Project | 8 | 8 | GPA |

## Theme Styling

The app supports light and dark themes.

- Theme state is stored in `App.js`.
- The theme toggle adds or removes the `dark` class on the `html` element.
- Theme colors are controlled through CSS variables in `src/index.css`.
- The theme toggle uses `Moon` and `Sun` icons from `lucide-react`.

## Public Metadata and Assets

The HTML template includes:

- Page title: `BIT GPA Calculator | UCSC`
- Description metadata for the BIT GPA calculator.
- Keyword metadata for BIT, UCSC, GPA calculator, University of Colombo, and Sri Lanka terms.
- Author metadata.
- Google site verification metadata.
- Open Graph metadata.
- Google Analytics tag.
- Tailwind CDN script.
- Inter font import.

The manifest defines:

- Short name: `BIT GPA`
- App name: `BIT GPA Calculator | UCSC`
- Standalone display mode.
- Icon assets from `public`.

