import React from 'react';
import { CaptureItem } from '../types';

interface DoItNowViewProps {
  items: CaptureItem[];
  onUpdate: (item: CaptureItem) => void;
}

const DoItNowItem: React.FC<{ item: CaptureItem; onUpdate: (item: CaptureItem) => void }> = ({ item, onUpdate }) => {

  const handleMoveToReview = () => {
    onUpdate({ ...item, category: undefined });
  };
  
  const handleInputChange = (field: keyof CaptureItem, value: string) => {
    onUpdate({ ...item, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border-l-4 border-green-500 flex flex-col">
       <div className="p-4 flex justify-between items-start">
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-neutral-500">
              {item.prioritizationType && `Type: ${item.prioritizationType.charAt(0).toUpperCase() + item.prioritizationType.slice(1)}`}
              {typeof item.finalScore === 'number' && ` | Score: ${Math.round(item.finalScore).toLocaleString()}`}
            </p>
          </div>
          <button
            onClick={handleMoveToReview}
            className="text-sm bg-primary text-white font-semibold px-4 py-1.5 rounded-md hover:bg-primary-hover transition-opacity flex-shrink-0 ml-4"
          >
            Move to Review
          </button>
       </div>
       <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Assigned To</label>
          <input
            type="text"
            value={item.assignedTo || ''}
            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            placeholder="e.g., Me, John Doe"
            className="w-full bg-neutral-100 dark:bg-neutral-700 border border-transparent rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Start Date</label>
          <input
            type="date"
            value={item.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full bg-neutral-100 dark:bg-neutral-700 border border-transparent rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">End Date (Deadline)</label>
          <input
            type="date"
            value={item.dueDate || ''}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            className="w-full bg-neutral-100 dark:bg-neutral-700 border border-transparent rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};


const DoItNowView: React.FC<DoItNowViewProps> = ({ items, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Do it now</h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        These are your highest-priority tasks based on the scoring wizard. Focus on these first.
      </p>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map(item => <DoItNowItem key={item.id} item={item} onUpdate={onUpdate} />)
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <p className="text-neutral-600 dark:text-neutral-400">Nothing to do right now.</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">High-priority tasks will appear here after you score them on the Review Board.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoItNowView;