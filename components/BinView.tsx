import React from 'react';
import { CaptureItem } from '../types';

interface DiscardViewProps {
  items: CaptureItem[];
  onUpdate: (item: CaptureItem) => void;
}

const DiscardItem: React.FC<{ item: CaptureItem; onUpdate: (item: CaptureItem) => void }> = ({ item, onUpdate }) => {

  const handleRestore = () => {
    onUpdate({ ...item, binned: false });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 flex justify-between items-center shadow-sm">
      <div>
        <p className="font-semibold">{item.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-neutral-500">
            {item.prioritizationType && `Type: ${item.prioritizationType.charAt(0).toUpperCase() + item.prioritizationType.slice(1)}`}
            {typeof item.finalScore === 'number' && ` | Score: ${Math.round(item.finalScore).toLocaleString()}`}
          </span>
        </div>
      </div>
      <button
        onClick={handleRestore}
        className="text-sm bg-secondary text-white font-semibold px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
      >
        Restore
      </button>
    </div>
  );
};


const DiscardView: React.FC<DiscardViewProps> = ({ items, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Discard</h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        These items were automatically moved here because their priority score was very low. You can restore them to the Review Board.
      </p>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map(item => <DiscardItem key={item.id} item={item} onUpdate={onUpdate} />)
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <p className="text-neutral-600 dark:text-neutral-400">The discard pile is empty.</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">Low-priority tasks will appear here after being scored.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscardView;
