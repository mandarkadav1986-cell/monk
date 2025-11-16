import React from 'react';
import { CaptureItem } from '../types';

interface ReEvaluateViewProps {
  items: CaptureItem[];
  onUpdate: (item: CaptureItem) => void;
}

const ReEvaluateItem: React.FC<{ item: CaptureItem; onUpdate: (item: CaptureItem) => void }> = ({ item, onUpdate }) => {

  const handleMoveToReview = () => {
    onUpdate({ ...item, category: undefined });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 flex justify-between items-center shadow-sm border-l-4 border-yellow-500">
      <div>
        <p className="font-semibold">{item.title}</p>
        <p className="text-sm text-neutral-500">
            {item.prioritizationType && `Type: ${item.prioritizationType.charAt(0).toUpperCase() + item.prioritizationType.slice(1)}`}
            {typeof item.finalScore === 'number' && ` | Score: ${Math.round(item.finalScore).toLocaleString()}`}
        </p>
      </div>
      <button
        onClick={handleMoveToReview}
        className="text-sm bg-primary text-white font-semibold px-4 py-1.5 rounded-md hover:bg-primary-hover transition-opacity"
      >
        Move to Review
      </button>
    </div>
  );
};


const ReEvaluateView: React.FC<ReEvaluateViewProps> = ({ items, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Re-evaluate</h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        These tasks have a lower priority score. Consider if they can be simplified, delegated, or if they're still necessary.
      </p>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map(item => <ReEvaluateItem key={item.id} item={item} onUpdate={onUpdate} />)
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <p className="text-neutral-600 dark:text-neutral-400">Nothing to re-evaluate at the moment.</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">Lower-priority tasks will appear here after being scored.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReEvaluateView;
