export const xpForSuccess=10;
export function applySessionXp(xp:number,correct:number){const gained=correct*xpForSuccess;const nextXp=xp+gained;return {xp:nextXp,level:Math.floor(nextXp/100)+1,gained};}
