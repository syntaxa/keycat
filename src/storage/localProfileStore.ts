import { createDefaultProfile } from "../domain/profile";
import type { Profile } from "../domain/types";
const KEY="keycat-profile";
export const loadProfile=():Profile=>{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):createDefaultProfile();}catch{return createDefaultProfile();}};
export const saveProfile=(profile:Profile)=>localStorage.setItem(KEY,JSON.stringify(profile));
