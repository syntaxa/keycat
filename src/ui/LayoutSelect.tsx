import type { LayoutId } from "../domain/types";
export function LayoutSelect({value,onChange}:{value:LayoutId;onChange:(v:LayoutId)=>void}){return <div><h2>Выбор раскладки</h2><button onClick={()=>onChange("ru")} disabled={value==="ru"}>Русская</button><button onClick={()=>onChange("en")} disabled={value==="en"}>English</button></div>;}
