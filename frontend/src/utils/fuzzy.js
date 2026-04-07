/**
 * Triangular membership function.
 * Returns degree of membership [0, 1] for value x given triangle [a, b, c].
 */
function trimf(x, [a, b, c]) {
  if (x === b) return 1          // peak check first — handles b===a or b===c edge cases
  if (x <= a || x >= c) return 0
  if (x < b) return (x - a) / (b - a)
  return (c - x) / (c - b)
}

/**
 * Compute fuzzy performance score (0–100) from attendance and hours_studied.
 * Uses params from fuzzy_params.json structure.
 */
export function computeFuzzyScore(attendance, hoursStudied, params) {
  const att  = params.attendance
  const hrs  = params.hours_studied
  const perf = params.performance

  // Membership degrees for inputs
  const attLow  = trimf(attendance,   att.low)
  const attMed  = trimf(attendance,   att.medium)
  const attHigh = trimf(attendance,   att.high)
  const hrsLow  = trimf(hoursStudied, hrs.low)
  const hrsMed  = trimf(hoursStudied, hrs.medium)
  const hrsHigh = trimf(hoursStudied, hrs.high)

  // 9 rules: attendance × hours_studied → performance
  // Low×Low→Low, Low×Med→Low, Low×High→Med
  // Med×Low→Low, Med×Med→Med, Med×High→High
  // High×Low→Med, High×Med→High, High×High→High
  const rules = [
    { strength: Math.min(attLow,  hrsLow),  output: perf.low    },
    { strength: Math.min(attLow,  hrsMed),  output: perf.low    },
    { strength: Math.min(attLow,  hrsHigh), output: perf.medium },
    { strength: Math.min(attMed,  hrsLow),  output: perf.low    },
    { strength: Math.min(attMed,  hrsMed),  output: perf.medium },
    { strength: Math.min(attMed,  hrsHigh), output: perf.high   },
    { strength: Math.min(attHigh, hrsLow),  output: perf.medium },
    { strength: Math.min(attHigh, hrsMed),  output: perf.high   },
    { strength: Math.min(attHigh, hrsHigh), output: perf.high   },
  ]

  // Centroid defuzzification over 0–100 universe (101 points)
  let num = 0, den = 0
  for (let x = 0; x <= 100; x++) {
    const agg = Math.max(...rules.map(r => Math.min(r.strength, trimf(x, r.output))))
    num += x * agg
    den += agg
  }

  return den === 0 ? 0 : num / den
}

/**
 * Find the active decision tree rule for given feature values.
 * @param {object} featureValues - { Attendance: 80, Hours_Studied: 20, ... }
 * @param {Array}  rules         - loaded from rules.json
 */
export function findActiveRule(featureValues, rules) {
  for (const rule of rules) {
    const match = rule.conditions.every(c => {
      const val = featureValues[c.feature]
      if (val === undefined) return true
      return c.operator === '<=' ? val <= c.threshold : val > c.threshold
    })
    if (match) return rule
  }
  return null
}
