import React, { useState, useCallback, useMemo } from 'react';
import { CaptureItem, CaptureItemType, View } from './types';
import Header from './components/Header';
import CaptureInput from './components/CaptureInput';
import Inbox from './components/Inbox';
import ReviewBoard from './components/ReviewBoard';
import ScheduledView from './components/ScheduledView';
import CalendarView from './components/CalendarView';
import DiscardView from './components/BinView';
import ReEvaluateView from './components/ProblemView';
import OngoingView from './components/OngoingView';

const App: React.FC = () => {
  const [captureItems, setCaptureItems] = useState<CaptureItem[]>([
    {
      id: '1',
      type: CaptureItemType.Task,
      title: 'Draft Q3 marketing strategy',
      body: 'Initial thoughts on the campaign focus, channels, and budget allocation. Need to coordinate with sales.',
      tags: ['marketing', 'strategy'],
      source: 'Manual',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      processed_flag: false,
    },
    {
      id: '2',
      type: CaptureItemType.Idea,
      title: 'New feature for social media integration',
      body: '',
      tags: ['product', 'feature-idea'],
      source: 'Widget',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      processed_flag: false,
    },
     {
      id: '3',
      type: CaptureItemType.Note,
      title: 'Meeting notes with Project Phoenix team',
      body: '- Discussed timeline adjustments\n- Sarah to follow up on vendor contracts\n- Next sync on Friday',
      tags: ['meeting', 'project-phoenix'],
      source: 'Email',
      createdAt: new Date().toISOString(),
      processed_flag: true, // Already organized
      status: 'todo',
      certainty: 'certain',
      assignedTo: 'Sarah',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().slice(0, 10),
    },
    {
      id: '4',
      type: CaptureItemType.Task,
      title: 'Prepare slides for all-hands meeting',
      body: 'Include Q2 performance metrics and shoutouts for top performers.',
      tags: ['presentation', 'all-hands'],
      source: 'Manual',
      createdAt: new Date().toISOString(),
      processed_flag: true, // Already organized
      status: 'todo',
      dueDate: new Date().toISOString().slice(0, 10), // Scheduled for today
    },
    {
      id: '5',
      type: CaptureItemType.Task,
      title: 'Review Q2 Financials',
      body: 'Check the final numbers before the board meeting.',
      tags: ['finance', 'reporting'],
      source: 'Manual',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      processed_flag: true,
      status: 'done', // This one is already done
      // FIX: Call getDate() as a function before performing arithmetic on its result.
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10), // Scheduled for yesterday
    },
  ]);
  const [currentView, setCurrentView] = useState<View>(View.Inbox);

  const addCaptureItem = useCallback((item: Omit<CaptureItem, 'id' | 'createdAt' | 'processed_flag'>) => {
    const newItem: CaptureItem = {
      ...item,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      processed_flag: false,
    };
    setCaptureItems(prevItems => [newItem, ...prevItems]);
  }, []);

  const updateCaptureItem = useCallback((updatedItem: CaptureItem) => {
    setCaptureItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const deleteCaptureItem = useCallback((itemId: string) => {
    setCaptureItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);
  
  const inboxItems = useMemo(() => captureItems.filter(item => !item.processed_flag), [captureItems]);
  const reviewItems = useMemo(() => captureItems.filter(item => item.processed_flag && item.status === 'todo' && !item.binned && typeof item.finalScore === 'undefined'), [captureItems]);
  const scheduledItems = useMemo(() => captureItems.filter(item => item.processed_flag && item.status === 'todo' && !item.binned && typeof item.finalScore !== 'undefined' && item.category !== 're-evaluate'), [captureItems]);
  const ongoingItems = useMemo(() => captureItems.filter(item => item.status === 'ongoing'), [captureItems]);
  const discardItems = useMemo(() => captureItems.filter(item => item.processed_flag && item.status === 'todo' && item.binned), [captureItems]);
  const reEvaluateItems = useMemo(() => captureItems.filter(item => item.processed_flag && item.status === 'todo' && item.category === 're-evaluate'), [captureItems]);


  return (
    <div className="min-h-screen font-sans text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="max-w-3xl mx-auto p-4 sm:p-6 pb-24">
        {currentView === View.Inbox && (
          <Inbox 
            items={inboxItems} 
            updateItem={updateCaptureItem} 
            deleteItem={deleteCaptureItem}
          />
        )}
        {currentView === View.Review && (
          <ReviewBoard 
            items={reviewItems}
            updateItem={updateCaptureItem}
          />
        )}
        {currentView === View.Scheduled && (
          <ScheduledView
            items={scheduledItems}
            onUpdate={updateCaptureItem}
            onDelete={deleteCaptureItem}
          />
        )}
        {currentView === View.Ongoing && (
          <OngoingView
            items={ongoingItems}
            onUpdate={updateCaptureItem}
          />
        )}
        {currentView === View.Calendar && (
          <CalendarView
            items={captureItems.filter(i => i.status === 'todo' || i.status === 'ongoing')}
            onUpdate={updateCaptureItem}
          />
        )}
        {currentView === View.Discard && (
          <DiscardView
            items={discardItems}
            onUpdate={updateCaptureItem}
          />
        )}
        {currentView === View.ReEvaluate && (
          <ReEvaluateView
            items={reEvaluateItems}
            onUpdate={updateCaptureItem}
          />
        )}
      </main>
      {currentView === View.Inbox && <CaptureInput onAddItem={addCaptureItem} />}
    </div>
  );
};

export default App;