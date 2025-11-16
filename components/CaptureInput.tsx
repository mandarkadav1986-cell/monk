
import React, { useState, useRef } from 'react';
import { CaptureItem, CaptureItemType } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TaskIcon } from './icons/TaskIcon';
import { IdeaIcon } from './icons/IdeaIcon';
import { NoteIcon } from './icons/NoteIcon';

interface CaptureInputProps {
  onAddItem: (item: Omit<CaptureItem, 'id' | 'createdAt' | 'processed_flag'>) => void;
}

const CaptureInput: React.FC<CaptureInputProps> = ({ onAddItem }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState<CaptureItemType>(CaptureItemType.Task);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddItem({
        type: selectedType,
        title: inputValue.trim(),
        body: '',
        tags: [],
        source: 'WebApp',
      });
      setInputValue('');
      inputRef.current?.blur();
    }
  };

  const TypeButton = ({ type, icon, label }: { type: CaptureItemType; icon: React.ReactNode; label: string }) => (
    <button
      type="button"
      onClick={() => setSelectedType(type)}
      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
        selectedType === type
          ? 'bg-primary text-white shadow'
          : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
      }`}
      aria-label={`Set type to ${label}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-neutral-100 dark:from-neutral-900 via-neutral-100/90 dark:via-neutral-900/90 to-transparent">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg shadow-neutral-300/30 dark:shadow-black/30 p-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Capture a task, idea, or note..."
              className="flex-grow bg-transparent text-sm px-3 py-2 text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex-shrink-0 bg-primary hover:bg-primary-hover focus:ring-2 focus:ring-primary-focus focus:outline-none text-white rounded-lg p-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim()}
              aria-label="Add item"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-2 pb-1">
             <TypeButton type={CaptureItemType.Task} icon={<TaskIcon className="w-3 h-3"/>} label="Task" />
             <TypeButton type={CaptureItemType.Idea} icon={<IdeaIcon className="w-3 h-3"/>} label="Idea" />
             <TypeButton type={CaptureItemType.Note} icon={<NoteIcon className="w-3 h-3"/>} label="Note" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaptureInput;
