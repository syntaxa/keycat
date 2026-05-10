interface RewardScreenProps {
  xp: number;
  decorItemId: string;
  eggProgress: number;
  onContinue: () => void;
}

export function RewardScreen({ xp, decorItemId, eggProgress, onContinue }: RewardScreenProps) {
  return (
    <section className="panel reward-screen">
      <h2>Награда!</h2>
      <p>Котик стал увереннее находить буквы.</p>
      <ul>
        <li>Опыт: +{xp}</li>
        <li>Новый декор: {decorItemId}</li>
        <li>Яйцо: +{eggProgress}</li>
      </ul>
      <button type="button" onClick={onContinue}>
        Играть дальше
      </button>
    </section>
  );
}
