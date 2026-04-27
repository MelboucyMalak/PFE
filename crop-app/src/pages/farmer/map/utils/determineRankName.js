export function determineRankName(suitabilityRank) {
  let rankName;
  let rank = Number(suitabilityRank)
  rankName = (rank === 5 ? "Ideal" :
    (rank === 4 ? "Good" :
      (rank === 3 ? "Acceptable" : "Avoid")
    )
  )
  return rankName;
}