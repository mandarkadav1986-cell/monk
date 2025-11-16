import React, { useState } from 'react';
import { CaptureItem, CaptureItemType } from '../types';
import AIAssistant from './AIAssistant';
import { TaskIcon } from './icons/TaskIcon';
import { IdeaIcon } from './icons/IdeaIcon';
import { NoteIcon } from './icons/NoteIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { ArchiveIcon } from './icons/ArchiveIcon';
import { TrashIcon } from './icons/TrashIcon';

interface InboxItemProps {
  item: CaptureItem;
  onUpdate: (item: CaptureItem) => void;
  onDelete: (itemId: string) => void;
}

const typeDetails = {
  [CaptureItemType.Task]: { icon: <TaskIcon className="w-4 h-4" />, color: 'text-blue-500' },
  [CaptureItemType.Idea]: { icon: <IdeaIcon className="w-4 h-4" />, color: 'text-yellow-500' },
  [CaptureItemType.Note]: { icon: <NoteIcon className="w-4 h-4" />, color: 'text-green-500' },
  [CaptureItemType.Media]: { icon: <NoteIcon className="w-4 h-4" />, color: 'text-purple-500' },
};

const InboxItem: React.FC<InboxItemProps> = ({ item, onUpdate, onDelete }) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleProcess = () => {
    onUpdate({ ...item, processed_flag: true, status: 'todo' });
  };
  
  const handleArchive = () => {
    onUpdate({ ...item, processed_flag: true, status: 'todo', binned: true });
  };

  const { icon, color } = typeDetails[item.type];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md transition-shadow hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className={`flex items-center gap-2 text-sm font-semibold ${color}`}>
              {icon}
              <span>{item.type}</span>
            </div>
            <p className="mt-1 font-semibold text-neutral-800 dark:text-neutral-100">{item.title}</p>
            {item.body && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 whitespace-pre-wrap">{item.body}</p>}
          </div>
          <button onClick={() => setShowAIAssistant(!showAIAssistant)} className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors">
            <SparkleIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {showAIAssistant && <AIAssistant item={item} onUpdate={onUpdate} />}
      
      <div className="border-t border-neutral-200 dark:border-neutral-700 p-2 flex justify-end items-center gap-2">
        <button onClick={() => onDelete(item.id)} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors">
          <TrashIcon className="w-4 h-4" />
          Delete
        </button>
        <button onClick={handleArchive} className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 px-3 py-1.5 rounded-md hover:bg-neutral-500/10 transition-colors">
          <ArchiveIcon className="w-4 h-4" />
          Archive
        </button>
        <button onClick={handleProcess} className="text-sm bg-primary text-white font-semibold px-4 py-1.5 rounded-md hover:bg-primary-hover transition-colors">
          Process
        </button>
      </div>
    </div>
  );
};

export default InboxItem;