export function hasCommonInterest(userA, userB) {
  if (!userA.interests || !userB.interests) return false;

  return userA.interests.some(interest => userB.interests.includes(interest));
}
