export function determineColorClass(scoreImg) {
  const colorClass = (scoreImg <= 30 ? "red" 
                    : scoreImg <= 50 ? "orange" : "green")
  return colorClass;
}