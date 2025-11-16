import React from 'react';
import { CaptureItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface ScheduledViewProps {
  items: CaptureItem[];
  onUpdate: (item: CaptureItem) => void;
  onDelete: (itemId: string) => void;
}

const getPriorityInfo = (item: CaptureItem): { color: string, label: string } => {
    if (typeof item.finalScore !== 'number') return { color: 'border-transparent', label: 'Not Scored' };

    if (item.prioritizationType === 'professional') {
        if (item.finalScore > 5000) return { color: 'border-green-500', label: 'High Priority' };
        return { color: 'border-yellow-500', label: 'Medium Priority' };
    } else { // Personal
        if (item.finalScore > 100) return { color: 'border-green-500', label: 'High Priority' };
        return { color: 'border-yellow-500', label: 'Medium Priority' };
    }
};

const ScheduledItem: React.FC<{ item: CaptureItem; onUpdate: (item: CaptureItem) => void; onDelete: (itemId: string) => void; }> = ({ item, onUpdate, onDelete }) => {
  const handleStartTask = () => {
    onUpdate({ ...item, status: 'ongoing' });
  };
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      onDelete(item.id);
    }
  };

  const handleInputChange = (field: keyof CaptureItem, value: string) => {
    onUpdate({ ...item, [field]: value });
  };
  
  const priorityInfo = getPriorityInfo(item);

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg p-4 flex flex-col gap-4 shadow-sm border-l-4 ${priorityInfo.color}`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="font-semibold">{item.title}</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{priorityInfo.label}</span>
             {typeof item.finalScore === 'number' && (
                <span className="text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-full">
                    Score: {Math.round(item.finalScore).toLocaleString()}
                </span>
             )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleStartTask}
            className="text-sm bg-secondary text-white font-semibold px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            Start Task
          </button>
           <button
            onClick={handleDelete}
            className="p-2 rounded-full text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            aria-label="Delete task"
           >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Project Name</label>
          <input
            type="text"
            value={item.project || ''}
            onChange={(e) => handleInputChange('project', e.target.value)}
            placeholder="e.g., Q3 Marketing Campaign"
            className="w-full bg-neutral-100 dark:bg-neutral-700 border border-transparent rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Category</label>
          <select
            value={item.taskCategory || ''}
            onChange={(e) => handleInputChange('taskCategory', e.target.value)}
            className="w-full bg-neutral-100 dark:bg-neutral-700 border border-transparent rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Category</option>
            <option value="future">Future</option>
            <option value="maintain">Maintain</option>
            <option value="distraction">Distraction</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ScheduledView: React.FC<ScheduledViewProps> = ({ items, onUpdate, onDelete }) => {
  const sortedItems = [...items].sort((a, b) => {
    const scoreA = a.finalScore || 0;
    const scoreB = b.finalScore || 0;
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Sort by score descending
    }
    // Fallback to date sorting
    const dateA = new Date(a.dueDate || a.startDate || a.createdAt).getTime();
    const dateB = new Date(b.dueDate || b.startDate || b.createdAt).getTime();
    return dateA - dateB;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Scheduled Tasks</h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        Here is a list of all your active tasks, sorted by priority.
      </p>
      <div className="space-y-3">
        {sortedItems.length > 0 ? (
          sortedItems.map(item => <ScheduledItem key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />)
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <p className="text-neutral-600 dark:text-neutral-400">You have no scheduled tasks.</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">Process and score items from your Review Board to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledView;