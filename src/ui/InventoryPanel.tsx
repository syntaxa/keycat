import type { InventoryStack } from "../domain/types";

interface InventoryPanelProps {
  inventory: InventoryStack[];
}

export function InventoryPanel({ inventory }: InventoryPanelProps) {
  return (
    <section className="panel inventory-panel" aria-labelledby="inventory-title">
      <h2 id="inventory-title">Инвентарь</h2>
      {inventory.length === 0 ? (
        <p className="empty-state">Пока нет декора. Заверши урок, чтобы получить награду.</p>
      ) : (
        <ul className="inventory-list">
          {inventory.map((item) => (
            <li className="inventory-stack" key={item.itemId}>
              <span className="item-name">{item.itemId}</span>
              <span className="item-count">x{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
