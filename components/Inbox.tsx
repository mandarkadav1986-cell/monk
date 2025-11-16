
import React from 'react';
import { CaptureItem } from '../types';
import InboxItem from './InboxItem';

interface InboxProps {
  items: CaptureItem[];
  updateItem: (item: CaptureItem) => void;
  deleteItem: (itemId: string) => void;
}

const Inbox: React.FC<InboxProps> = ({ items, updateItem, deleteItem }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Inbox</h2>
      {items.length > 0 ? (
        items.map(item => (
          <InboxItem key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />
        ))
      ) : (
        <div className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <p className="text-neutral-600 dark:text-neutral-400">Your inbox is clear!</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">Use the input below to capture new items.</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;
