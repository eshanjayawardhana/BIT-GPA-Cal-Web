import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

// These values are taken from the uploaded 2025 handbook.
export const BIT_HANDBOOK = Object.freeze({
  totalGpaCredits: 90,
  classTargets: Object.freeze([
    { id: "first", label: "First Class", minimumGpa: 3.7 },
    { id: "second-upper", label: "Second Upper", minimumGpa: 3.3 },
    { id: "second-lower", label: "Second Lower", minimumGpa: 3.0 },
  ]),
  grades: Object.freeze([
    { label: "A+", points: 4.0 },
    { label: "A", points: 4.0 },
    { label: "A-", points: 3.7 },
    { label: "B+", points: 3.3 },
    { label: "B", points: 3.0 },
    { label: "B-", points: 2.7 },
    { label: "C+", points: 2.3 },
    { label: "C", points: 2.0 },
    { label: "C-", points: 1.7 },
    { label: "D+", points: 1.3 },
    { label: "D", points: 1.0 },
    { label: "E", points: 0.0 },
  ]),
});

const HANDBOOK_MAX_GPA = Math.max(...BIT_HANDBOOK.grades.map((grade) => grade.points));

const STORAGE_KEY = "bit-gpa-predictor-target";

const formatGpa = (value) => (Number.isFinite(value) ? value.toFixed(2) : "0.00");

const getDegreeClass = (gpa) =>
  BIT_HANDBOOK.classTargets.find((target) => gpa >= target.minimumGpa)?.label ||
  "No listed class threshold reached";

const getStoredTarget = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored || BIT_HANDBOOK.classTargets[0].id;
  } catch {
    return BIT_HANDBOOK.classTargets[0].id;
  }
};

const getGradeBreakdown = (requiredGpa, remainingCredits) => {
  if (remainingCredits <= 0 || requiredGpa <= 0) return [];

  const grades = BIT_HANDBOOK.grades;
  const upperIndex = grades.findIndex((grade) => grade.points <= requiredGpa);
  const lowerIndex = Math.max(upperIndex, 0);
  const lower = grades[lowerIndex];

  if (lower.points === requiredGpa || lowerIndex === 0) {
    return [{ ...lower, credits: remainingCredits }];
  }

  const upper = grades[lowerIndex - 1];
  const upperCredits = Math.ceil(
    ((requiredGpa - lower.points) / (upper.points - lower.points)) * remainingCredits,
  );
  const safeUpperCredits = Math.min(Math.max(upperCredits, 0), remainingCredits);
  const lowerCredits = remainingCredits - safeUpperCredits;

  return [
    ...(safeUpperCredits > 0 ? [{ ...upper, credits: safeUpperCredits }] : []),
    ...(lowerCredits > 0 ? [{ ...lower, credits: lowerCredits }] : []),
  ];
};

const getDifficulty = (requiredGpa, maxGpa) => {
  const easiestClassGpa = BIT_HANDBOOK.classTargets[BIT_HANDBOOK.classTargets.length - 1].minimumGpa;
  const hardestClassGpa = BIT_HANDBOOK.classTargets[0].minimumGpa;
  if (requiredGpa > HANDBOOK_MAX_GPA) return { label: "Beyond the maximum", tone: "danger", percent: 100 };
  if (requiredGpa <= easiestClassGpa) return { label: "Easy", tone: "success", percent: Math.max((requiredGpa / HANDBOOK_MAX_GPA) * 100, 0) };
  if (requiredGpa <= hardestClassGpa) return { label: "Moderate", tone: "warning", percent: Math.max((requiredGpa / HANDBOOK_MAX_GPA) * 100, 0) };
  return {
    label: requiredGpa <= maxGpa ? "Hard" : "Beyond the maximum",
    tone: requiredGpa <= maxGpa ? "danger" : "danger",
    percent: Math.max(Math.min((requiredGpa / HANDBOOK_MAX_GPA) * 100, 100), 0),
  };
};

export default function TargetGpaPredictor({
  currentGPA = 0,
  completedCredits = 0,
  onBack,
}) {
  const [selectedTarget, setSelectedTarget] = useState(getStoredTarget);
  const [customTarget, setCustomTarget] = useState("3.00");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, selectedTarget);
    } catch {
      // Persistence is optional when browser storage is unavailable.
    }
  }, [selectedTarget]);

  const calculations = useMemo(() => {
    const totalCredits = BIT_HANDBOOK.totalGpaCredits;
    const completed = Math.min(Math.max(Number(completedCredits) || 0, 0), totalCredits);
    const current = Math.min(Math.max(Number(currentGPA) || 0, 0), HANDBOOK_MAX_GPA);
    const remaining = totalCredits - completed;
    const targetOption = BIT_HANDBOOK.classTargets.find((target) => target.id === selectedTarget);
    const target = selectedTarget === "custom" ? Number(customTarget) : targetOption?.minimumGpa;
    const safeTarget = Math.min(Math.max(Number(target) || 0, 0), HANDBOOK_MAX_GPA);
    const required = remaining > 0 ? (safeTarget * totalCredits - current * completed) / remaining : 0;
    const maximum = (current * completed + HANDBOOK_MAX_GPA * remaining) / totalCredits;
    const isComplete = remaining === 0;
    const isAchieved = current >= safeTarget;
    const impossible = !isComplete && required > HANDBOOK_MAX_GPA;
    const difficulty = getDifficulty(required, maximum);

    return {
      completed,
      current,
      remaining,
      target: safeTarget,
      required,
      maximum,
      isComplete,
      isAchieved,
      impossible,
      difficulty,
      maximumClass: getDegreeClass(maximum),
      finalClass: getDegreeClass(current),
      breakdown: getGradeBreakdown(required, remaining),
    };
  }, [completedCredits, currentGPA, customTarget, selectedTarget]);

  const resetTarget = () => {
    setSelectedTarget(BIT_HANDBOOK.classTargets[0].id);
    setCustomTarget("3.00");
  };

  const renderState = () => {
    if (calculations.isComplete) {
      return (
        <div className="target-state target-state-info">
          <GraduationCap size={24} />
          <div>
            {calculations.finalClass === "No listed class threshold reached" ? (
              <><strong>Degree Complete</strong><span>No listed handbook degree class threshold is reached at a final GPA of {formatGpa(calculations.current)}.</span></>
            ) : (
              <><strong>Congratulations! You have been awarded a {calculations.finalClass}</strong><span>Degree Complete - your final GPA is {formatGpa(calculations.current)}.</span></>
            )}
          </div>
        </div>
      );
    }
    if (calculations.impossible) {
      return (
        <div className="target-state target-state-danger">
          <TriangleAlert size={24} />
          <div>
            <strong>This target is mathematically out of reach</strong>
            <span>The required remaining GPA is above the handbook maximum of 4.00.</span>
            <b>Absolute maximum achievable GPA: {formatGpa(calculations.maximum)}</b>
          </div>
        </div>
      );
    }
    if (calculations.isAchieved) {
      return (
        <div className="target-state target-state-success">
          <CheckCircle2 size={24} />
          <div><strong>Target already achieved</strong><span>Your current GPA is already at or above this goal.</span></div>
        </div>
      );
    }
    return (
      <div className={`target-state target-state-${calculations.difficulty.tone}`}>
        <TrendingUp size={24} />
        <div><strong>Required GPA: {formatGpa(calculations.required)}</strong><span>{calculations.difficulty.label} based on the remaining credits.</span></div>
      </div>
    );
  };

  return (
    <main className="target-page">
      <div className="target-shell">
        <header className="target-header">
          <div>
            <p className="target-eyebrow"><Target size={15} /> BIT planning tool</p>
            <h1>Target GPA Predictor</h1>
            <p className="target-subtitle">Plan the grades you need across the remaining {BIT_HANDBOOK.totalGpaCredits} GPA credits.</p>
          </div>
          <button className="target-icon-button" onClick={onBack} type="button" aria-label="Back to GPA calculator" title="Back to GPA calculator"><ArrowLeft size={20} /></button>
        </header>

        <section className="target-grid">
          <div className="target-panel target-controls">
            <div className="target-panel-heading"><span className="target-step">01</span><div><h2>Choose your target</h2><p>Your selection is saved automatically.</p></div></div>
            <label htmlFor="target-goal">Target goal</label>
            <select id="target-goal" value={selectedTarget} onChange={(event) => setSelectedTarget(event.target.value)}>
              {BIT_HANDBOOK.classTargets.map((target) => <option key={target.id} value={target.id}>{target.label} - {target.minimumGpa.toFixed(2)} GPA</option>)}
              <option value="custom">Custom Input</option>
            </select>
            {selectedTarget === "custom" && (
              <div className="target-custom-input">
                <label htmlFor="custom-gpa">Custom target GPA</label>
                <input id="custom-gpa" type="number" min="0" max={HANDBOOK_MAX_GPA} step="0.01" value={customTarget} onChange={(event) => setCustomTarget(event.target.value)} />
              </div>
            )}
            <div className="target-stats">
              <div><span>Current GPA</span><strong>{formatGpa(calculations.current)}</strong></div>
              <div><span>Completed GPA credits</span><strong>{calculations.completed} / {BIT_HANDBOOK.totalGpaCredits}</strong></div>
              <div><span>Remaining credits</span><strong>{calculations.remaining}</strong></div>
            </div>
            {!calculations.isComplete && (
              <div className="target-ceiling-badge">
                <span>Maximum Achievable Class</span>
                <strong>{calculations.maximumClass}</strong>
                <small>Highest possible ceiling with {formatGpa(Math.max(...BIT_HANDBOOK.grades.map((grade) => grade.points)))} GPA in every remaining credit</small>
              </div>
            )}
            <button type="button" className="target-reset" onClick={resetTarget}><RotateCcw size={15} /> Reset target</button>
          </div>

          <div className="target-panel target-result-panel">
            <div className="target-panel-heading"><span className="target-step">02</span><div><h2>Your projection</h2><p>Calculated from your current weighted GPA.</p></div></div>
            <div className="target-gauge" style={{ "--gauge-value": `${calculations.difficulty.percent}%` }}>
              <div className="target-gauge-inner"><span>Goal</span><strong>{formatGpa(calculations.target)}</strong></div>
            </div>
            <div className="target-legend"><span className="legend-easy">Easy</span><span className="legend-moderate">Moderate</span><span className="legend-hard">Hard</span></div>
            {renderState()}
          </div>
        </section>

        {!calculations.isComplete && !calculations.impossible && !calculations.isAchieved && (
          <section className="target-panel target-breakdown">
            <div className="target-panel-heading"><span className="target-step">03</span><div><h2>Smart grade breakdown</h2><p>An approximate credit mix using the handbook grading scale.</p></div></div>
            <div className="target-grade-list">
              {calculations.breakdown.map((grade) => <div className="target-grade-row" key={grade.label}><span className="target-grade-badge">{grade.label}</span><div className="target-grade-track"><span style={{ width: `${(grade.credits / calculations.remaining) * 100}%` }} /></div><strong>{grade.credits} credit{grade.credits === 1 ? "" : "s"}</strong></div>)}
            </div>
            <div className="target-tip"><Lightbulb size={18} /><span>This is an estimate in credit units. Your actual course choices may have different credit values.</span></div>
          </section>
        )}

        <footer className="target-footnote">Based on the grading scale and degree class requirements in the uploaded 2025 handbook. GPA values are rounded to two decimal places.</footer>
      </div>
    </main>
  );
}
