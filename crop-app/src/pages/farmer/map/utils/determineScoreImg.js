export function determineScoreImg(score){
  const scoreImg =Math.round(score / 10) * 10 
  return scoreImg;
}