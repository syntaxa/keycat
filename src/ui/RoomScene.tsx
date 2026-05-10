export function RoomScene({target,mistake}:{target:string;mistake:boolean}){return <section><p>Котик ждёт букву: <b>{target.toUpperCase()}</b></p>{mistake&&<p>😿</p>}</section>;}
