export function getScoreDisplay(score){
  if (score >= 90) return { rank: 1, color: 'P', compatibility:'Perfect' }
  if (score >= 75) return { rank: 2, color: 'EH', compatibility:'Extremely High' }
  if (score >= 60) return { rank: 3, color: 'H', compatibility:'High' }
  return { rank: 4, color: 'G', compatibility:'Good' }
} 