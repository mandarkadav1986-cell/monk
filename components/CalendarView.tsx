import React, { useState, useMemo } from 'react';
import { CaptureItem } from '../types';
import Modal from './Modal';

interface CalendarViewProps {
  items: CaptureItem[];
  onUpdate: (item: CaptureItem) => void;
}

// Helper function to get the start of the week (Sunday)
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const TaskItem: React.FC<{
  item: CaptureItem;
  type: 'start' | 'deadline';
  onClick: () => void;
}> = ({ item, type, onClick }) => {
  const isAssignedToMe = item.assignedTo && item.assignedTo.toLowerCase() === 'me';
  const color = type === 'start' ? (isAssignedToMe ? 'border-green-500' : 'border-blue-500') : (isAssignedToMe ? 'border-red-500' : 'border-yellow-400');
  
  return (
    <div
      onClick={onClick}
      className={`w-full p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border-l-4 ${color} shadow-sm cursor-pointer hover:shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200`}
    >
      <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">{item.title}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{type} Date</p>
    </div>
  );
};


const CalendarView: React.FC<CalendarViewProps> = ({ items, onUpdate }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [selectedItem, setSelectedItem] = useState<CaptureItem | null>(null);
  const [activeTab, setActiveTab] = useState<'professional' | 'personal'>('professional');

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentWeekStart]);

  const eventsByDate = useMemo(() => {
    const filteredItems = items.filter(item => item.prioritizationType === activeTab);
    return weekDays.reduce((acc, day) => {
      const dateString = day.toISOString().slice(0, 10);
      acc[dateString] = [];
      for (const item of filteredItems) {
        const startDate = item.startDate || new Date(item.createdAt).toISOString().slice(0, 10);
        if (startDate === dateString) {
          acc[dateString].push({ type: 'start', item });
        }
        if (item.dueDate && item.dueDate === dateString) {
          acc[dateString].push({ type: 'deadline', item });
        }
      }
      return acc;
    }, {} as Record<string, { type: 'start' | 'deadline'; item: CaptureItem }[]>);
  }, [items, weekDays, activeTab]);

  const changeWeek = (offset: number) => {
    setCurrentWeekStart(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + offset * 7);
      return newDate;
    });
  };
  
  const handleComplete = () => {
    if (selectedItem) {
      onUpdate({ ...selectedItem, status: 'done' });
      setSelectedItem(null);
    }
  };
  
  const handleReschedule = () => {
     if (selectedItem) {
      onUpdate({ ...selectedItem, status: 'todo' });
      setSelectedItem(null);
    }
  };

  const TabButton: React.FC<{ tab: 'professional' | 'personal'; children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
        activeTab === tab
          ? 'bg-primary text-white'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg">
          <TabButton tab="professional">Professional</TabButton>
          <TabButton tab="personal">Personal</TabButton>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => changeWeek(-1)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" aria-label="Previous week">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
           <button onClick={() => setCurrentWeekStart(getStartOfWeek(new Date()))} className="text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            Today
          </button>
          <button onClick={() => changeWeek(1)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" aria-label="Next week">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
       <h2 className="text-lg font-bold text-center text-neutral-800 dark:text-neutral-100 mb-4">
          {weekDays[0].toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
       </h2>
      <div className="space-y-4">
        {weekDays.map(day => {
          const dateString = day.toISOString().slice(0, 10);
          const todaysEvents = eventsByDate[dateString] || [];
          const isToday = new Date().toISOString().slice(0, 10) === dateString;

          return (
            <div key={dateString} className={`p-3 rounded-lg ${isToday ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className={`font-bold text-lg ${isToday ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'}`}>
                  {day.toLocaleDateString(undefined, { weekday: 'short' })}
                </h3>
                <p className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="space-y-2">
                {todaysEvents.length > 0 ? (
                  todaysEvents.map((event, index) => (
                    <TaskItem 
                      key={`${event.item.id}-${event.type}-${index}`}
                      item={event.item}
                      type={event.type}
                      onClick={() => setSelectedItem(event.item)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 pl-1">No tasks.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem ? selectedItem.title : ''}
      >
        {selectedItem && (
          <div>
            <div className="space-y-2 mb-6">
                <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{selectedItem.body}</p>
                 <p className="text-sm text-neutral-500"><strong>Assigned To:</strong> {selectedItem.assignedTo || 'N/A'}</p>
                 <p className="text-sm text-neutral-500"><strong>Start Date:</strong> {selectedItem.startDate ? new Date(selectedItem.startDate).toLocaleDateString() : 'N/A'}</p>
                 <p className="text-sm text-neutral-500"><strong>Deadline:</strong> {selectedItem.dueDate ? new Date(selectedItem.dueDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
               <button
                  onClick={handleReschedule}
                  className="text-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold px-4 py-2 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={handleComplete}
                  className="text-sm bg-secondary text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Complete Task
                </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarView;
