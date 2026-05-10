import type { Profile } from "./types";
export const createDefaultProfile=():Profile=>({selectedLayout:"ru",level:1,xp:0,eggProgress:0,layoutProgress:{ru:{unlockedLetters:["а"],letters:{}},en:{unlockedLetters:["a"],letters:{}}},inventory:[]});
