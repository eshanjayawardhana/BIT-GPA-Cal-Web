import React, { useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react"; // Importing icons for the theme toggle button

// The main App component where all the logic and UI reside.
const App = () => {
  // State to manage the current screen displayed to the user.
  // 'entry' for the welcome page, 'year1', 'year2', 'year3' for GPA calculation, and 'overall' for final results.
  const [currentScreen, setCurrentScreen] = useState("entry");
  // State to store the grades entered by the user. It's initialized with an empty structure for each semester.
  const [grades, setGrades] = useState({
    year1: { semester1: {}, semester2: {} },
    year2: { semester3: {}, semester4: {} },
    year3: { semester5: {}, semester6: {} },
  });
  // State to display warning messages to the user, particularly when they cannot proceed to the next year.
  const [warningMessage, setWarningMessage] = useState("");
  // New state for managing the current theme: 'light' or 'dark'.
  const [theme, setTheme] = useState("light"); // Default to light theme

  // This useEffect hook will handle adding/removing the 'dark' class to the <html> tag.
  // This is crucial for applying CSS Variables based on the theme.
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // No cleanup needed here as classList operations are idempotent.
  }, [theme]); // This effect runs whenever the 'theme' state changes.

  // gpvTable: Grade Point Value table mapping letter grades to their numerical GPA equivalents.
  const gpvTable = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    E: 0.0,
  };

  // subjects: A comprehensive object detailing all subjects across different years and semesters.
  // Each subject includes its code, name, total credits, GPA credits, and a flag indicating if it's a non-GPA subject.
  const subjects = {
    year1: {
      semester1: [
        {
          code: "IT1106",
          name: "Information Systems",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT1206",
          name: "Computer Systems",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT1306",
          name: "Free and Open Source Software for Personal Computing",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT1406",
          name: "Introduction to Programming",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT1506",
          name: "Fundamentals of Mathematics",
          credits: 1,
          gpaCredits: 1,
          isNonGpa: false,
        },
      ],
      semester2: [
        {
          code: "EN2106",
          name: "Communication Skills I (EN)",
          credits: 2,
          gpaCredits: 0,
          isNonGpa: true,
        },
        {
          code: "IT2106",
          name: "Mathematics for Computing I",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT2206",
          name: "Fundamentals of Software Engineering",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT2306",
          name: "Database Systems",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT2406",
          name: "Web Application Development I",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
      ],
    },
    year2: {
      semester3: [
        {
          code: "EN3106",
          name: "Communication Skills II (EN)",
          credits: 2,
          gpaCredits: 0,
          isNonGpa: true,
        },
        {
          code: "IT3106",
          name: "Object Oriented Analysis & Design",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT3206",
          name: "Data Structures and Algorithms",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT3306",
          name: "Data Management Systems",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT3406",
          name: "Web Application Development II",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
      ],
      semester4: [
        {
          code: "IT4106",
          name: "User Experience Design",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT4206",
          name: "Enterprise Application Development",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT4306",
          name: "Information Technology Project Management",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT4406",
          name: "Agile Software Development",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT4506",
          name: "Computer Networks",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
      ],
    },
    year3: {
      semester5: [
        {
          code: "EN5106",
          name: "Fundamentals of Management & Entrepreneurship (EN)",
          credits: 2,
          gpaCredits: 0,
          isNonGpa: true,
        },

        {
          code: "IT5206",
          name: "Professional Practice",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT5306",
          name: "Principles of Information Security",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT5406",
          name: "Systems & Network Administration",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT5506",
          name: "Mathematics for Computing II",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
          isOptional: true,
        },
      ],
      semester6: [
        {
          code: "EN6106",
          name: "Emerging Topics in Information Technology (EN)",
          credits: 2,
          gpaCredits: 0,
          isNonGpa: true,
        },
        {
          code: "IT6206",
          name: "Software Quality Assurance",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },
        {
          code: "IT6306",
          name: "Mobile Application Development",
          credits: 4,
          gpaCredits: 4,
          isNonGpa: false,
        },
        {
          code: "IT6406",
          name: "Network Security and Audit",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
        },

        {
          code: "IT6506",
          name: "e-Business Technologies",
          credits: 3,
          gpaCredits: 3,
          isNonGpa: false,
          isOptional: true,
        },
        {
          code: "IT5106*",
          name: "Final Year Project",
          credits: 8,
          gpaCredits: 8,
          isNonGpa: false,
        },
      ],
    },
  };

  // Grade options for GPA subjects, including the "Not Sit" option.
  const gradeOptions = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "E",
    "Not Sit",
  ];
  // Grade options for non-GPA subjects.
  const nonGpaGradeOptions = ["Pass", "Fail"];

  /**
   * Calculates the GPA for a specific year and determines if the user can proceed to the next year
   * based on specific progression rules. This function is memoized using useCallback for performance.
   * @param {string} year - The year key (e.g., 'year1', 'year2', 'year3').
   * @returns {object} An object containing the calculated GPA, a boolean indicating if progression is allowed,
   * and a warning message if progression is not allowed.
   */
  const getYearCalculationStatus = useCallback(
    (year) => {
      let totalGPAValue = 0;
      let totalCredits = 0;
      // cPassCount for specific rule (originally less than 3 C-, D+, D, E, F grades)
      let cPassCount = 0;
      let failedNonGpaSubject = null;
      let notSitCount = 0;

      // New variables for Level I, II, and III progression rules
      let min20CreditsWith2 = 0; // Tracks GPA credits with grade point >= 2.00
      let allEnhancementPass = true; // True if all non-GPA subjects are 'Pass'
      let hasGradeBelow1 = false; // True if any GPA subject has grade point < 1.00 (E, F, Not Sit, or empty)

      // Loop through semesters and subjects within the specified year to calculate GPA and check conditions.
      for (const semesterKey in subjects[year]) {
        subjects[year][semesterKey].forEach((subject) => {
          const grade = grades[year][semesterKey][subject.code];

          // Count "Not Sit" grades.
          if (grade === "Not Sit") {
            notSitCount++;
          }

          // Handle non-GPA subjects (e.g., Communication Skills).
          if (subject.isNonGpa) {
            if (grade === "Fail") {
              failedNonGpaSubject = subject.name;
            }
            if (grade !== "Pass") {
              allEnhancementPass = false; // Rule for enhancement subjects
            }
          }
          // Handle GPA subjects.
          else {
            if (grade && grade !== "Not Sit" && gpvTable[grade] !== undefined) {
              totalGPAValue += gpvTable[grade] * subject.gpaCredits;
              totalCredits += subject.gpaCredits;
            }
            // Original rule: Count grades C, C-, D+, D, E for cPassCount.
            if (["C", "C-", "D+", "D", "E"].includes(grade)) {
              cPassCount++;
            }

            // Rule 2: Count GPA credits with grade point >= 2.00 (C or better).
            if (
              grade &&
              gpvTable[grade] !== undefined &&
              gpvTable[grade] >= 2.0
            ) {
              min20CreditsWith2 += subject.gpaCredits;
            }

            // Rule 4: Check for any course with grade point < 1.00 (E, F, Not Sit, or empty).
            if (
              grade === "E" ||
              grade === "F" || // 'F' is not in gradeOptions but included for completeness if it were
              grade === "Not Sit" ||
              grade === "" || // Empty grade means not selected
              (grade && gpvTable[grade] !== undefined && gpvTable[grade] < 1.0)
            ) {
              hasGradeBelow1 = true;
            }
          }
        });
      }

      // Initial check for progression based on original rules.
      let canProceed =
        !failedNonGpaSubject && cPassCount < 3 && notSitCount < 3;
      const gpa =
        totalCredits > 0 ? (totalGPAValue / totalCredits).toFixed(2) : "0.00";
      let msg = "";

      // Check Level I & II progression rules (for year1 and year2).
      if (year === "year1" || year === "year2") {
        const currentYearGpa = parseFloat(gpa);
        if (currentYearGpa < 2.0) {
          canProceed = false;
          msg = "❗You cannot proceed: GPA must be at least 2.00.";
        } else if (min20CreditsWith2 < 20) {
          canProceed = false;
          msg =
            "❗You cannot proceed: You need at least 20 GPA credits with grade point 2.00 or above.";
        } else if (!allEnhancementPass) {
          canProceed = false;
          msg =
            "❗You cannot proceed: All enhancement (non-GPA) courses must be PASS.";
        } else if (hasGradeBelow1) {
          canProceed = false;
          msg =
            "❗You cannot proceed: You have a course with grade point less than 1.00 (E, F, Not Sit, or empty).";
        }
      }

      // Check Level III progression rules (for year3).
      if (year === "year3") {
        const currentYearGpa = parseFloat(gpa);
        if (currentYearGpa < 2.0) {
          canProceed = false;
          msg = "❗You cannot proceed: GPA must be at least 2.00.";
        } else if (min20CreditsWith2 < 20) {
          canProceed = false;
          msg =
            "❗You cannot proceed: You need at least 20 GPA credits with grade point 2.00 or above.";
        } else if (!allEnhancementPass) {
          canProceed = false;
          msg =
            "❗You cannot proceed: All enhancement (non-GPA) courses must be PASS.";
        } else if (hasGradeBelow1) {
          canProceed = false;
          msg =
            "❗You cannot proceed: You have a course with grade point less than 1.00 (E, F, Not Sit, or empty).";
        }
      }

      return { gpa, canProceed, warningMsg: msg };
    },
    [grades, subjects, gpvTable]
  ); // Dependencies: grades, subjects, gpvTable to re-calculate when they change.

  // Effect hook to update the warning message based on the current screen and grades.
  useEffect(() => {
    if (currentScreen.startsWith("year")) {
      const { warningMsg } = getYearCalculationStatus(currentScreen);
      setWarningMessage(warningMsg);
    } else {
      setWarningMessage(""); // Clear warning message on other screens.
    }
  }, [grades, currentScreen, getYearCalculationStatus]); // Dependencies for useEffect.

  /**
   * Handles changes in a subject's selected grade.
   * Updates the 'grades' state immutably.
   * @param {string} year - The year of the subject.
   * @param {string} sem - The semester of the subject.
   * @param {string} code - The subject code.
   * @param {string} grade - The new grade selected.
   */
  const handleGradeChange = (year, sem, code, grade) => {
    setGrades((prev) => ({
      ...prev,
      [year]: { ...prev[year], [sem]: { ...prev[year][sem], [code]: grade } },
    }));
  };

  /**
   * Navigates to the next year's GPA calculation screen or the overall GPA screen.
   * Checks if the user is eligible to proceed based on the current year's status.
   * If not eligible, displays a warning.
   * @param {string} year - The current year.
   */
  const goToNextYear = (year) => {
    const { canProceed, warningMsg } = getYearCalculationStatus(year); // Get warning message here too
    if (canProceed) {
      // Determine the next screen based on the current year.
      setCurrentScreen(
        year === "year1" ? "year2" : year === "year2" ? "year3" : "overall"
      );
    } else {
      // Display the warning message set by useEffect (or directly here if preferred for immediate feedback)
      setWarningMessage(warningMsg); // Set the warning message to display on the current screen
    }
  };

  /**
   * Calculates the overall GPA across all years and subjects.
   * Only GPA subjects with valid grades are included.
   * @returns {string} The calculated overall GPA, formatted to two decimal places.
   */
  const calculateOverallGPA = () => {
    let overallGPAValue = 0;
    let overallCredits = 0;

    // Iterate through all years, semesters, and subjects to sum up GPA values and credits.
    Object.keys(subjects).forEach((yearKey) => {
      Object.keys(subjects[yearKey]).forEach((semKey) => {
        subjects[yearKey][semKey].forEach((subject) => {
          const grade = grades[yearKey][semKey][subject.code];
          // Only include non-nonGPA subjects with valid grades that have a GPV.
          if (!subject.isNonGpa && grade && gpvTable[grade] != null) {
            overallGPAValue += gpvTable[grade] * subject.gpaCredits;
            overallCredits += subject.gpaCredits;
          }
        });
      });
    });
    // Return the calculated GPA, or "0.00" if no GPA credits were accumulated.
    return overallCredits
      ? (overallGPAValue / overallCredits).toFixed(2)
      : "0.00";
  };

  /**
   * Determines the degree eligibility based on various criteria across all levels (years).
   * @param {object} subjects - The subjects data structure.
   * @param {object} grades - The grades entered by the user.
   * @param {object} gpvTable - The grade point value table.
   * @param {function} calculateOverallGPA - Function to calculate overall GPA.
   * @returns {object} An object containing eligibility status, reasons for failure,
   * total GPA credits, credits per level, overall GPA, and a list of subjects to repeat.
   */
  function getDegreeEligibility(
    subjects,
    grades,
    gpvTable,
    calculateOverallGPA
  ) {
    // Define the levels (years) and their labels for clear display.
    const levels = [
      { key: "year1", label: "Level I" },
      { key: "year2", label: "Level II" },
      { key: "year3", label: "Level III" },
    ];

    let totalGpaCredits = 0; // Total GPA credits earned across all years.
    let levelCredits = { year1: 0, year2: 0, year3: 0 }; // GPA credits earned per level.
    let levelCcredits = { year1: 0, year2: 0, year3: 0 }; // Credits with a grade of C or better per level.
    let allEnhancementPass = true; // Flag for all non-GPA subjects being 'Pass'.
    let noGradeBelowD = true; // Flag for no GPA subject having a grade point less than D (1.0).
    let softwareProjectC = false; // Flag for the final year project having C or better.
    let hasSubjectBelowC = false; // Flag if any GPA subject has grade below C.
    const repeatSubjects = []; // List of subjects that need to be repeated.

    // Iterate through each level (year) to check various eligibility criteria.
    levels.forEach(({ key, label }) => {
      for (const semesterKey in subjects[key]) {
        subjects[key][semesterKey].forEach((subject) => {
          const grade = grades[key][semesterKey][subject.code];

          // Process GPA subjects.
          if (
            !subject.isNonGpa &&
            grade &&
            grade !== "" &&
            grade !== "Not Sit" &&
            gpvTable[grade] !== undefined
          ) {
            totalGpaCredits += subject.gpaCredits;
            levelCredits[key] += subject.gpaCredits;

            // Check for credits with grade C or better (GPV >= 2.0).
            if (gpvTable[grade] >= 2.0) {
              levelCcredits[key] += subject.gpaCredits;
            }

            // Specific check for the Final Year Project (IT5106*) in Level III.
            if (
              key === "year3" &&
              subject.code.startsWith("IT5106") &&
              gpvTable[grade] >= 2.0 // Grade C or better
            ) {
              softwareProjectC = true;
            }

            // Check if any GPA subject has a grade point less than D (1.0).
            if (gpvTable[grade] < 1.0) {
              noGradeBelowD = false;
            }
          }

          // Process non-GPA subjects (enhancement courses).
          if (subject.isNonGpa && grade !== "Pass") {
            allEnhancementPass = false;
          }
          // Also check non-GPA subjects for "Fail" which would mean grade below D.
          if (subject.isNonGpa && grade === "Fail") {
            noGradeBelowD = false;
          }

          // Identify subjects that need to be repeated (grades below C for GPA subjects, or "Not Sit").
          if (
            !subject.isNonGpa &&
            (grade === "C-" ||
              grade === "D+" ||
              grade === "D" ||
              grade === "E" ||
              grade === "F" ||
              grade === "Not Sit" ||
              grade === "") // Empty string means not selected
          ) {
            hasSubjectBelowC = true;
            repeatSubjects.push(
              `${label} - ${subject.name} (${subject.code}) [${
                grade ? grade : "Not Selected"
              }]`
            );
          }
        });
      }
    });

    // Calculate the overall GPA using the provided function.
    const overallGpa = parseFloat(calculateOverallGPA());

    // Determine overall eligibility based on all accumulated conditions.
    const eligible =
      totalGpaCredits >= 90 &&
      levelCredits.year1 >= 30 &&
      levelCredits.year2 >= 30 &&
      levelCredits.year3 >= 30 &&
      overallGpa >= 2.0 &&
      levelCcredits.year1 >= 20 &&
      levelCcredits.year2 >= 20 &&
      levelCcredits.year3 >= 20 &&
      softwareProjectC &&
      allEnhancementPass &&
      noGradeBelowD &&
      !hasSubjectBelowC; // Crucial: No subjects with grade below C.

    // Collect all reasons why the user is not eligible.
    const failed = [];
    if (totalGpaCredits < 90) failed.push("Minimum 90 GPA credits not earned.");
    if (levelCredits.year1 < 30)
      failed.push("Less than 30 GPA credits in Level I.");
    if (levelCredits.year2 < 30)
      failed.push("Less than 30 GPA credits in Level II.");
    if (levelCredits.year3 < 30)
      failed.push("Less than 30 GPA credits in Level III.");
    if (overallGpa < 2.0) failed.push("Overall GPA is less than 2.00.");
    if (levelCcredits.year1 < 20)
      failed.push("Less than 20 credits with grade C or better in Level I.");
    if (levelCcredits.year2 < 20)
      failed.push("Less than 20 credits with grade C or better in Level II.");
    if (levelCcredits.year3 < 20)
      failed.push("Less than 20 credits with grade C or better in Level III.");
    if (!softwareProjectC)
      failed.push(
        "Software Development Project in Level III is not at least a C grade."
      );
    if (!allEnhancementPass)
      failed.push("Not all enhancement (non-GPA) courses are PASS.");
    if (!noGradeBelowD)
      failed.push("There is a grade below D in at least one course.");
    if (hasSubjectBelowC)
      failed.push(
        "You have at least one subject with a grade below C (C-, D+, D, E, F, Not Sit, or not selected). You must repeat and pass that subject with at least a C grade to be eligible for the degree."
      );

    return {
      eligible,
      failed,
      totalGpaCredits,
      levelCredits,
      overallGpa,
      repeatSubjects, // Return the list of subjects to repeat
    };
  }

  /**
   * Renders the entry (welcome) page of the application.
   */
  const renderEntryPage = () => (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-5 font-inter transition-colors duration-500"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {" "}
      {/* Apply bg using CSS variable */}
      <div
        className="rounded-2xl p-8 flex flex-col items-center shadow-lg mb-10 w-full max-w-md transition-colors duration-500"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow:
            "0 10px 15px -3px var(--shadow-card-lg), 0 4px 6px -4px var(--shadow-card-lg)",
        }}
      >
        {" "}
        {/* Use CSS variables for bg and shadow */}
        <p className="text-5xl mb-2">🎓</p>
        <p
          className="text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome to
        </p>{" "}
        {/* Use CSS variable for text color */}
        <p
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: "var(--text-title)" }}
        >
          {" "}
          {/* Use CSS variable for text color */}
          Colombo BIT GPA Calculator
        </p>
        <p
          className="text-base text-center mb-7 mt-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {" "}
          {/* Use CSS variable for text color */}
          Easily calculate your GPA for each year and semester. Start by tapping
          the button below!
        </p>
        <div className="flex flex-row gap-4 w-full mt-4">
    <button
      className="flex-1 py-4 px-2 rounded-lg flex items-center justify-center text-white text-lg font-bold tracking-wide transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      style={{
        backgroundColor: "var(--text-title)",
        boxShadow: "0 2px 4px var(--shadow-blue-btn)",
      }}
      onClick={() => setCurrentScreen("year1")}
    >
      Year 1
    </button>
    <button
      className="flex-1 py-4 px-2 rounded-lg flex items-center justify-center text-white text-lg font-bold tracking-wide transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      style={{
        backgroundColor: "var(--text-title)",
        boxShadow: "0 2px 4px var(--shadow-blue-btn)",
      }}
      onClick={() => setCurrentScreen("year2")}
    >
      Year 2
    </button>
    <button
      className="flex-1 py-4 px-2 rounded-lg flex items-center justify-center text-white text-lg font-bold tracking-wide transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      style={{
        backgroundColor: "var(--text-title)",
        boxShadow: "0 2px 4px var(--shadow-blue-btn)",
      }}
      onClick={() => setCurrentScreen("year3")}
    >
      Year 3
    </button>
  </div>
      </div>
      {/* Footer Section */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center justify-center">
        <p
          className="text-sm font-medium tracking-tight mb-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {" "}
          {/* Use CSS variable for text color */}© {new Date().getFullYear()}{" "}
          Eshan Jayawardana. All rights reserved.
        </p>
        <p
          className="text-sm font-medium tracking-tight"
          style={{ color: "var(--text-secondary)" }}
        >
          {" "}
          {/* Use CSS variable for text color */}
          DevoPlus™
        </p>
      </div>
    </div>
  );

  /**
   * Renders the overall GPA calculation page, showing eligibility for the degree.
   */
  const renderOverallGPA = () => {
    // Get eligibility details by calling the helper function.
    const {
      eligible,
      failed,
      totalGpaCredits,
      levelCredits,
      overallGpa,
      repeatSubjects,
    } = getDegreeEligibility(subjects, grades, gpvTable, calculateOverallGPA);

    // Collect per-year warnings
    const yearWarnings = [
      { label: "Year 1", ...getYearCalculationStatus("year1") },
      { label: "Year 2", ...getYearCalculationStatus("year2") },
      { label: "Year 3", ...getYearCalculationStatus("year3") },
    ].filter((y) => y.warningMsg);

    return (
      <div
        className="min-h-screen flex flex-col items-center p-4 font-inter relative transition-colors duration-500"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {" "}
        {/* Apply bg using CSS variable */}
        <div
          className="rounded-3xl flex flex-col items-center p-8 mt-16 mb-8 shadow-md w-full max-w-md transition-colors duration-500"
          style={{
            backgroundColor: "var(--bg-gpa-overall)",
            boxShadow: "0 4px 12px var(--shadow-yellow)",
          }}
        >
          {" "}
          {/* Use CSS variables for bg and shadow */}
          <p className="text-5xl mb-2">🏆</p>
          <p
            className="text-2xl font-bold mb-1.5"
            style={{ color: "var(--text-gpa-overall)" }}
          >
            {" "}
            {/* Use CSS variable for text color */}
            Your Overall GPA
          </p>
          <p
            className="text-5xl font-bold mt-0.5"
            style={{ color: "var(--text-gpa-overall)" }}
          >
            {" "}
            {/* Use CSS variable for text color */}
            {overallGpa.toFixed(2)}
          </p>
        </div>
        {/* Display eligibility or reasons for not being eligible */}
        {eligible ? (
          <div
            className="rounded-2xl flex flex-col items-center p-6 mt-4 mb-6 border-2 w-full max-w-md transition-colors duration-500"
            style={{
              backgroundColor: "var(--bg-alert-success)",
              borderColor: "var(--border-alert-success)",
            }}
          >
            {" "}
            {/* Use CSS variables for bg and border */}
            <p className="text-4xl mb-2">🎉</p>
            <p
              className="text-lg font-bold text-center"
              style={{ color: "var(--text-alert-success)" }}
            >
              {" "}
              {/* Use CSS variable for text color */}
              Congratulations! You are eligible to be awarded the BIT Degree.
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl flex flex-col items-start p-5 mt-4 mb-6 border-2 w-full max-w-md transition-colors duration-500"
            style={{
              backgroundColor: "var(--bg-alert-danger)",
              borderColor: "var(--border-alert-danger)",
            }}
          >
            {" "}
            {/* Use CSS variables for bg and border */}
            <p
              className="text-lg font-bold mb-2"
              style={{ color: "var(--text-alert-danger-main)" }}
            >
              {" "}
              {/* Use CSS variable for text color */}
              You are not eligible for the BIT Degree because:
            </p>
            {failed.map((reason, idx) => (
              <p
                key={idx}
                className="text-base mb-1"
                style={{ color: "var(--text-alert-danger-dark)" }}
              >
                {" "}
                {/* Use CSS variable for text color */}• {reason}
              </p>
            ))}
          </div>
        )}
        {/* Show repeat subjects if not eligible and there are subjects to repeat */}
        {!eligible && repeatSubjects.length > 0 && (
          <div
            className="rounded-2xl flex flex-col items-start p-5 mt-4 mb-6 border-2 w-full max-w-md transition-colors duration-500"
            style={{
              backgroundColor: "var(--bg-alert-danger)",
              borderColor: "var(--border-alert-danger)",
            }}
          >
            {" "}
            {/* Use CSS variables for bg and border */}
            <p
              className="text-lg font-bold mb-2"
              style={{ color: "var(--text-alert-danger-main)" }}
            >
              {" "}
              {/* Use CSS variable for text color */}
              You must repeat the following subjects:
            </p>
            {repeatSubjects.map((subj, idx) => (
              <p
                key={idx}
                className="text-base mb-1"
                style={{ color: "var(--text-alert-danger-dark)" }}
              >
                {" "}
                {/* Use CSS variable for text color */}• {subj}
              </p>
            ))}
          </div>
        )}
        {/* Show per-year warnings if any */}
        {yearWarnings.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch w-full max-w-4xl mx-auto mt-4 mb-6">
            {yearWarnings.map((y, idx) => (
              <div
                key={idx}
                className="rounded-2xl flex flex-col items-start p-5 border-2 flex-1 min-w-0 transition-colors duration-500"
                style={{
                  backgroundColor: "var(--bg-alert-danger)",
                  borderColor: "var(--border-alert-danger)",
                }}
              >
                <p
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--text-alert-danger-main)" }}
                >
                  {y.label} Warning
                </p>
                <p
                  className="text-base"
                  style={{ color: "var(--text-alert-danger-dark)" }}
                >
                  {y.warningMsg}
                </p>
              </div>
            ))}
          </div>
        )}
        {!eligible && (
  <button
    className="w-full py-3 rounded-xl flex items-center justify-center mt-1 mb-3 shadow-md text-slate-800 dark:text-white text-base font-bold tracking-wide transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 max-w-sm mx-auto bg-slate-200 dark:bg-slate-700"
    style={{
      backgroundColor: "#808080",
      color: "white",
      boxShadow: "0 2px 4px var(--shadow-slate-btn)",
    }}
    onClick={() => setCurrentScreen("year3")}
  >
    <span className="mr-2 text-lg">←</span> Go Back
  </button>
)}
        <button
          className="py-4 rounded-xl flex items-center justify-center mt-3 mb-3 shadow-sm text-white text-lg font-bold tracking-wide w-full max-w-sm transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          style={{
            backgroundColor: "var(--text-title)",
            boxShadow: "0 1px 2px var(--shadow-blue-btn)",
          }}
          onClick={() => setCurrentScreen("entry")} // Go back to the entry page to start over
        >
          Start Over
        </button>
        {/* Footer Section */}
        <footer className="w-full flex flex-col items-center justify-center mt-auto py-6">
          <p
            className="text-sm font-medium tracking-tight mb-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {" "}
            {/* Use CSS variable for text color */}
            Developed By Eshan Jayawardana | DevoPlus
          </p>
        </footer>
      </div>
    );
  };

  /**
   * Renders the GPA calculation page for a specific year.
   * Allows users to select grades for subjects and view their year's GPA.
   * @param {string} year - The year key (e.g., 'year1').
   * @param {string} yearLabel - The display label for the year (e.g., 'Year 1').
   */
  const renderGPACalculator = (year, yearLabel) => {
    const { gpa, canProceed } = getYearCalculationStatus(year);

    let earnedCredits = 0;
    // Calculate total earned credits for the current year.
    for (const semesterKey in subjects[year]) {
      subjects[year][semesterKey].forEach((subject) => {
        const grade = grades[year][semesterKey][subject.code];
        // Only count credits if a grade is selected and it's not "Not Sit".
        if (grade && grade !== "" && grade !== "Not Sit") {
          earnedCredits += subject.credits;
        }
      });
    }

    // Determine the label for the "Next Year" button.
    const nextYearButtonLabel =
      year === "year1"
        ? "Go to Year 2"
        : year === "year2"
        ? "Go to Year 3"
        : "View Overall GPA";

    // Determine the semester keys based on the current year.
    const semesterKey1 = `semester${
      year === "year1" ? 1 : year === "year2" ? 3 : 5
    }`;
    const semesterKey2 = `semester${
      year === "year1" ? 2 : year === "year2" ? 4 : 6
    }`;

    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center font-inter transition-colors duration-500"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {" "}
        {/* Apply bg using CSS variable */}
        <div className="flex-1 overflow-y-auto pb-20 pt-8 w-full max-w-5xl mx-auto px-4 md:px-8">
          {" "}
          {/* Simulate ScrollView */}
          <p
            className="text-3xl md:text-4xl font-bold text-center mb-5 tracking-wide"
            style={{ color: "var(--text-title)" }}
          >
            {" "}
            {/* Use CSS variable for text color */}
            {yearLabel} GPA Calculation
          </p>
          {/* Display warning message if any */}
          {warningMessage ? (
            <div
              className="rounded-xl flex flex-row items-center p-3 mb-4 border max-w-2xl mx-auto w-full transition-colors duration-500"
              style={{
                backgroundColor: "var(--bg-alert-danger)",
                borderColor: "var(--border-alert-danger)",
              }}
            >
              {" "}
              {/* Use CSS variables for bg and border */}
              <p className="text-2xl mr-2">⚠️</p>
              <p
                className="text-base font-bold flex-1"
                style={{ color: "var(--text-alert-danger-main)" }}
              >
                {" "}
                {/* Use CSS variable for text color */}
                {warningMessage}
              </p>
            </div>
          ) : null}
          {/* Semester Cards Side by Side */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 w-full max-w-4xl mx-auto">
            {/* Left Card (Semester 1/3/5) */}
            <div
              className="rounded-2xl p-5 shadow-md flex-1 min-w-0 transition-colors duration-500"
              style={{
                backgroundColor: "var(--bg-card)",
                boxShadow: "0 4px 6px var(--shadow-card)",
              }}
            >
              {" "}
              {/* Use CSS variables for bg and shadow */}
              <p
                className="text-xl font-bold mb-3 tracking-tight"
                style={{ color: "var(--text-semester-title)" }}
              >
                {" "}
                {/* Use CSS variable for text color */}
                Semester {year === "year1" ? 1 : year === "year2" ? 3 : 5}
              </p>
              {subjects[year][semesterKey1].map((subject, idx) => (
                <div
                  key={subject.code}
                  className={`mb-0 transition-colors duration-500 ${
                    subject.isNonGpa ? "rounded-lg p-2 mb-2" : ""
                  }`}
                  style={
                    subject.isNonGpa
                      ? { backgroundColor: "" }
                      : {}
                  } /* Use CSS variable for bg */
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <p
                      className="text-base font-semibold flex-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {" "}
                      {/* Use CSS variable for text color */}
                      {subject.name}
                    </p>
                    <p
                      className="text-sm ml-2 font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {" "}
                      {/* Use CSS variable for text color */}
                      {subject.credits} Credits
                    </p>
                  </div>
                  <div
                    className={`rounded-lg border mt-1.5 mb-2 overflow-hidden transition-colors duration-500`}
                    style={{
                      backgroundColor: "var(--bg-select)",
                      borderColor: subject.isNonGpa
                        ? "var(--border-select-nongpa)"
                        : "var(--border-select)",
                    }} /* Use CSS variables for bg and border */
                  >
                    <select
                      value={
                        grades[year][semesterKey1][subject.code] !== undefined
                          ? grades[year][semesterKey1][subject.code]
                          : ""
                      }
                      onChange={(e) =>
                        handleGradeChange(
                          year,
                          semesterKey1,
                          subject.code,
                          e.target.value
                        )
                      }
                      className="w-full min-w-[140px] h-14 px-3 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-500"
                      style={{
                        color: "var(--text-select)",
                        backgroundColor: "var(--bg-select)",
                      }} /* Use CSS variables for text and bg */
                    >
                      <option value="">Select Grade</option>
                      {(subject.isNonGpa
                        ? nonGpaGradeOptions
                        : gradeOptions
                      ).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  {idx !== subjects[year][semesterKey1].length - 1 && (
                    <div
                      className="h-px my-1 rounded transition-colors duration-500"
                      style={{ backgroundColor: "var(--border-divider)" }}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Right Card (Semester 2/4/6) */}
            <div
              className="rounded-2xl p-5 shadow-md flex-1 min-w-0 transition-colors duration-500"
              style={{
                backgroundColor: "var(--bg-card)",
                boxShadow: "0 4px 6px var(--shadow-card)",
              }}
            >
              <p
                className="text-xl font-bold mb-3 tracking-tight"
                style={{ color: "var(--text-semester-title)" }}
              >
                Semester {year === "year1" ? 2 : year === "year2" ? 4 : 6}
              </p>
              {subjects[year][semesterKey2].map((subject, idx) => (
                <div
                  key={subject.code}
                  className={`mb-0 transition-colors duration-500 ${
                    subject.isNonGpa ? "rounded-lg p-2 mb-2" : ""
                  }`}
                  style={
                    subject.isNonGpa
                      ? { backgroundColor: "" }
                      : {}
                  } /* Use CSS variable for bg */
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <p
                      className="text-base font-semibold flex-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {" "}
                      {/* Use CSS variable for text color */}
                      {subject.name}
                    </p>
                    <p
                      className="text-sm ml-2 font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {" "}
                      {/* Use CSS variable for text color */}
                      {subject.credits} Credits
                    </p>
                  </div>
                  <div
                    className={`rounded-lg border mt-1.5 mb-2 overflow-hidden transition-colors duration-500`}
                    style={{
                      backgroundColor: "var(--bg-select)",
                      borderColor: subject.isNonGpa
                        ? "var(--border-select-nongpa)"
                        : "var(--border-select)",
                    }} /* Use CSS variables for bg and border */
                  >
                    <select
                      value={
                        grades[year][semesterKey2][subject.code] !== undefined
                          ? grades[year][semesterKey2][subject.code]
                          : ""
                      }
                      onChange={(e) =>
                        handleGradeChange(
                          year,
                          semesterKey2,
                          subject.code,
                          e.target.value
                        )
                      }
                      className="w-full min-w-[140px] h-14 px-3 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-500"
                      style={{
                        color: "var(--text-select)",
                        backgroundColor: "var(--bg-select)",
                      }} /* Use CSS variables for text and bg */
                    >
                      <option value="">Select Grade</option>
                      {(subject.isNonGpa
                        ? nonGpaGradeOptions
                        : gradeOptions
                      ).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  {idx !== subjects[year][semesterKey2].length - 1 && (
                    <div
                      className="h-px my-1 rounded transition-colors duration-500"
                      style={{ backgroundColor: "var(--border-divider)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* GPA Result Card */}
          <div
            className="rounded-2xl flex flex-col items-center p-6 mt-4 mb-6 shadow-sm max-w-2xl mx-auto w-full transition-colors duration-500"
            style={{
              backgroundColor: "var(--bg-gpa-result)",
              boxShadow: "0 1px 2px var(--shadow-blue)",
            }}
          >
            <p className="text-4xl mb-1.5">🎯</p>
            <p
              className="text-lg font-bold mb-1"
              style={{ color: "var(--text-title)" }}
            >
              Your {yearLabel} GPA
            </p>
            <p
              className="text-4xl font-bold mt-0.5"
              style={{ color: "var(--text-gpa-value)" }}
            >
              {gpa}
            </p>
          </div>
          {/* Credits Info Card */}
          <div
            className="rounded-xl p-4 mt-3 mb-6 shadow-sm max-w-2xl mx-auto w-full transition-colors duration-500"
            style={{
              backgroundColor: "var(--bg-credits-info)",
              boxShadow: "0 1px 2px var(--shadow-default)",
            }}
          >
            <p
              className="text-base text-center font-medium"
              style={{ color: "var(--text-credits-info)" }}
            >
              Total Credits Earned This Year:{" "}
              <span className="font-bold">{earnedCredits}</span>
            </p>
          </div>
          {/* Reset Button */}
          <div className="flex justify-center mb-2 max-w-2xl mx-auto w-full">
            <button
              className="py-3 px-8 rounded-lg flex items-center justify-center mt-1 mb-2 shadow-md text-white text-base font-bold tracking-wide transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
              style={{
                backgroundColor: "orange",
                boxShadow: "0 4px 6px var(--shadow-orange-btn)",
              }} /* Use CSS variables for bg and shadow */
              onClick={() => {
                // Reset all grades for this year to empty string
                const newGrades = { ...grades };
                Object.keys(subjects[year]).forEach((semesterKey) => {
                  newGrades[year][semesterKey] = {}; // Reset the semester to an empty object
                  subjects[year][semesterKey].forEach((subject) => {
                    newGrades[year][semesterKey][subject.code] = ""; // Set each subject's grade to empty
                  });
                });
                setGrades(newGrades); // Update the state
                setWarningMessage(""); // Clear any existing warning
              }}
            >
              Reset This Year
            </button>
          </div>
          {/* Next Year Button */}
          <button
  className="w-full py-4 rounded-xl flex items-center justify-center my-3 shadow-md
    bg-blue-600 dark:bg-blue-700 shadow-blue-600/20 dark:shadow-black/30 hover:bg-blue-700 dark:hover:bg-blue-600
    text-white text-lg font-bold tracking-wide transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 max-w-2xl mx-auto"
  onClick={() => {
    setWarningMessage(""); // Optionally clear warning
    setCurrentScreen(
      year === "year1" ? "year2" : year === "year2" ? "year3" : "overall"
    );
  }}
>
  {nextYearButtonLabel}
</button>

          {/* Back Button (if not Year 1) */}
          {year !== "year1" && (
            <button
              className="w-full py-3 rounded-xl flex items-center justify-center mt-1 mb-8 shadow-md text-white text-base font-bold tracking-wide transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 max-w-2xl mx-auto"
              style={{
                backgroundColor: "#808080",
                boxShadow: "0 2px 4px var(--shadow-slate-btn)",
              }} /* Use CSS variables for bg and shadow */
              onClick={() => {
                // Navigate back to the previous year.
                if (year === "year2") setCurrentScreen("year1");
                else if (year === "year3") setCurrentScreen("year2");
              }}
            >
              <span className="mr-2 text-lg">←</span> Back to Previous Year
            </button>
          )}
        </div>
      </div>
    );
  };

  // Function to toggle theme between 'light' and 'dark'.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    // The main container div. The background and text color are handled by CSS variables on the body.
    // The `html.dark` class on the documentElement controls the variables.
    <div className="min-h-screen font-inter">
      {/* Theme Toggle Button - positioned fixed for all pages */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 p-3 rounded-full shadow-md transition-colors duration-300 z-50 hover:scale-105"
        style={{
          backgroundColor: "var(--bg-toggle-button)",
          boxShadow: "0 4px 6px var(--shadow-default)",
        }} /* Use CSS variables for bg and shadow */
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon size={20} style={{ color: "var(--text-icon-light)" }} />
        ) : (
          <Sun size={20} style={{ color: "var(--text-icon-dark)" }} />
        )}
      </button>

      {/* Conditional rendering of pages based on currentScreen state. */}
      {(() => {
        switch (currentScreen) {
          case "entry":
            return renderEntryPage();
          case "year1":
            return renderGPACalculator("year1", "Year 1");
          case "year2":
            return renderGPACalculator("year2", "Year 2");
          case "year3":
            return renderGPACalculator("year3", "Year 3");
          case "overall":
            return renderOverallGPA();
          default:
            return renderEntryPage();
        }
      })()}
    </div>
  );
};

// Export the App component as default.
export default App;
