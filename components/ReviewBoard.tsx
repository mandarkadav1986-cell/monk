import React, { useState, useMemo } from 'react';
import { CaptureItem } from '../types';

interface ReviewBoardProps {
  items: CaptureItem[];
  updateItem: (item: CaptureItem) => void;
}

const ScoreInput: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; helperText: string; }> = ({ label, value, onChange, helperText }) => (
  <div className="flex-1 min-w-[120px]">
    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
    <input
      type="range"
      min="1"
      max="100"
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
    />
    <div className="flex justify-between text-xs text-neutral-500">
      <span>1</span>
      <span className="font-bold text-primary">{value}</span>
      <span>100</span>
    </div>
    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{helperText}</p>
  </div>
);

const ReviewItem: React.FC<{ item: CaptureItem; onUpdate: (item: CaptureItem) => void }> = ({ item, onUpdate }) => {
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [type, setType] = useState<'professional' | 'personal' | null>(null);
  
  const [scores, setScores] = useState({
      reach: item.reach || 50,
      impact: item.impact || 50,
      confidence: item.confidence || 50,
      effort: item.effort || 50,
  });

  const handleScoreChange = (field: keyof typeof scores, value: string) => {
      const numericValue = parseInt(value, 10);
      setScores(prev => ({ ...prev, [field]: numericValue }));
  };

  const handleMarkDone = () => {
    onUpdate({ ...item, status: 'done' });
  };
  
  const handlePrioritize = () => {
    const { reach, impact, confidence, effort } = scores;
    let finalScore: number;
    let category: 're-evaluate' | undefined = undefined;
    let binned: boolean | undefined = undefined;
    
    if (type === 'professional') {
        finalScore = (reach * impact * confidence) / (effort > 0 ? effort : 1);
        if (finalScore < 1000 && finalScore >= 250) category = 're-evaluate';
        else if (finalScore < 250) binned = true;
    } else { // Personal (ICE)
        finalScore = (impact * confidence) / (effort > 0 ? effort : 1);
        if (finalScore < 50 && finalScore >= 10) category = 're-evaluate';
        else if (finalScore < 10) binned = true;
    }

    onUpdate({
        ...item,
        ...scores,
        prioritizationType: type ?? undefined,
        finalScore,
        category,
        binned,
    });

    // Reset state
    setIsPrioritizing(false);
    setType(null);
  };
  
  const cancelPrioritization = () => {
    setIsPrioritizing(false);
    setType(null);
  }

  const TypeButton: React.FC<{ onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
    <button onClick={onClick} className="w-full text-center px-4 py-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg hover:bg-primary hover:text-white transition-all duration-200 group">
      <span className="font-semibold text-lg">{children}</span>
    </button>
  );

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm transition-shadow hover:shadow-md flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex-grow">
          <p className="font-semibold">{item.title}</p>
          {item.body && <p className="text-sm text-neutral-500 mt-1">{item.body.substring(0, 100)}{item.body.length > 100 ? '...' : ''}</p>}
        </div>
        <div className="flex-shrink-0 ml-4 flex flex-col items-end gap-2">
            <button onClick={handleMarkDone} className="text-sm font-semibold text-secondary hover:underline">Mark Done</button>
            <button onClick={() => setIsPrioritizing(true)} className="text-sm bg-primary text-white font-semibold px-4 py-1.5 rounded-md hover:bg-primary-hover transition-colors">
              Prioritize
            </button>
        </div>
      </div>

      {isPrioritizing && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
          {!type ? (
            <div>
                <h3 className="text-center font-semibold mb-3">What kind of task is this?</h3>
                <div className="flex gap-4">
                    <TypeButton onClick={() => setType('professional')}>Professional / Work</TypeButton>
                    <TypeButton onClick={() => setType('personal')}>Personal / Life</TypeButton>
                </div>
            </div>
          ) : type === 'professional' ? (
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">Score using RICE (1-100)</h3>
              <div className="flex flex-wrap gap-4">
                <ScoreInput label="Reach" value={scores.reach} onChange={e => handleScoreChange('reach', e.target.value)} helperText="How many people will this affect?" />
                <ScoreInput label="Impact" value={scores.impact} onChange={e => handleScoreChange('impact', e.target.value)} helperText="How much will this move the needle?" />
                <ScoreInput label="Confidence" value={scores.confidence} onChange={e => handleScoreChange('confidence', e.target.value)} helperText="How confident are you in estimates?" />
                <ScoreInput label="Effort" value={scores.effort} onChange={e => handleScoreChange('effort', e.target.value)} helperText="How much effort is required?" />
              </div>
            </div>
          ) : ( // Personal
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">Score using ICE (1-100)</h3>
              <div className="flex flex-wrap gap-4">
                <ScoreInput label="Impact" value={scores.impact} onChange={e => handleScoreChange('impact', e.target.value)} helperText="How much impact on personal goals?" />
                <ScoreInput label="Confidence" value={scores.confidence} onChange={e => handleScoreChange('confidence', e.target.value)} helperText="How confident in this task's value?" />
                <ScoreInput label="Effort" value={scores.effort} onChange={e => handleScoreChange('effort', e.target.value)} helperText="How much personal effort required?" />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={cancelPrioritization} className="text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                Cancel
            </button>
            {type && (
                <button onClick={handlePrioritize} className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Calculate & Categorize
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const ReviewBoard: React.FC<ReviewBoardProps> = ({ items, updateItem }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Review Board</h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        Use the prioritization wizard to score your tasks and automatically sort them into the right buckets.
      </p>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map(item => <ReviewItem key={item.id} item={item} onUpdate={updateItem} />)
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <p className="text-neutral-600 dark:text-neutral-400">Nothing to review!</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">Process items from your inbox to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewBoard;