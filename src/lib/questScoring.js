// Scoring helpers for CNC First Order Quest.
// Pure functions — no side effects, no UI dependencies.

export function scoreMission1(selectedIds, choices) {
  let score = 0
  for (const id of selectedIds) {
    const choice = choices.find((c) => c.id === id)
    if (choice) score += choice.score
  }
  return Math.max(0, score)
}

export function scoreMission2(answers, items) {
  // answers: { itemId: selectedStage }
  let score = 0
  for (const item of items) {
    if (answers[item.id] === item.correctStage) score += item.score
  }
  return score
}

export function scoreMission3(selectedId, choices) {
  const choice = choices.find((c) => c.id === selectedId)
  return choice ? Math.max(0, choice.score) : 0
}

export function scoreMission4(selectedId, choices) {
  const choice = choices.find((c) => c.id === selectedId)
  return choice ? Math.max(0, choice.score) : 0
}

export function scoreMission5(answers, questions) {
  // answers: { questionId: selectedChoiceId }
  let score = 0
  for (const q of questions) {
    const selected = q.choices.find((c) => c.id === answers[q.id])
    if (selected?.correct) score += q.score
  }
  return score
}

// Returns normalized scores (0–100) per dimension plus overall weighted score.
export function calculateOverallScore(rawScores) {
  const { m1 = 0, m2 = 0, m3 = 0, m4 = 0, m5 = 0 } = rawScores

  const customerUnderstanding = Math.min(100, Math.round((m1 / 40) * 100))
  const journeyMapping        = Math.min(100, Math.round((m2 / 60) * 100))
  const pricingAwareness      = Math.min(100, Math.round((m3 / 40) * 100))
  const riskAwareness         = Math.min(100, Math.round((m4 / 40) * 100))
  const operationalThinking   = Math.min(100, Math.round((m5 / 50) * 100))

  const overall = Math.round(
    customerUnderstanding * 0.25 +
    journeyMapping        * 0.25 +
    pricingAwareness      * 0.20 +
    riskAwareness         * 0.15 +
    operationalThinking   * 0.15,
  )

  return {
    customerUnderstanding,
    journeyMapping,
    pricingAwareness,
    riskAwareness,
    operationalThinking,
    overall,
  }
}

export function getScoreLevel(overall) {
  if (overall >= 85) return { label: 'Excellent', color: 'text-emerald-400', borderColor: 'border-emerald-500/30', bg: 'bg-emerald-500/10' }
  if (overall >= 70) return { label: 'Good',      color: 'text-cyan-400',    borderColor: 'border-cyan-500/30',    bg: 'bg-cyan-500/10'    }
  if (overall >= 50) return { label: 'Basic',     color: 'text-yellow-400',  borderColor: 'border-yellow-500/30',  bg: 'bg-yellow-500/10'  }
  return               { label: 'Needs Review',   color: 'text-red-400',     borderColor: 'border-red-500/30',     bg: 'bg-red-500/10'     }
}
