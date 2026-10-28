export function tagScoring(preferredTags: String[], destTags: String[], destDist: number, userPreferredDist: number, destTripDurMin: number, destTripDurMax: number, userPrefDur: number) {
  let score = 0;
  for (let i = 0; i < preferredTags.length; i++) {
    for (let j = 0; j < destTags.length; j++) {
      if (preferredTags[i] === destTags[j]) {
        score++;
      }
    }
  }



  return score;
}
