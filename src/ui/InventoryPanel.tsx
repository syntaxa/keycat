import type { InventoryStack } from "../domain/types";
export function InventoryPanel({items}:{items:InventoryStack[]}){return <section><h3>Инвентарь</h3><ul>{items.map(i=><li key={i.itemId}>{i.itemId} x{i.count}</li>)}</ul></section>;}
