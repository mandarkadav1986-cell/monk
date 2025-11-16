
import React, { useState, useCallback } from 'react';
import { CaptureItem } from '../types';
import { summarizeText, suggestTags, estimateEffort } from '../services/geminiService';

interface AIAssistantProps {
  item: CaptureItem;
  onUpdate: (item: CaptureItem) => void;
}

type AIAction = 'summarize' | 'tags' | 'effort';

const AIAssistant: React.FC<AIAssistantProps> = ({ item, onUpdate }) => {
  const [isLoading, setIsLoading] = useState<AIAction | null>(null);
  const [result, setResult] = useState<string | string[] | null>(null);
  const [actionType, setActionType] = useState<AIAction | null>(null);

  const handleAction = useCallback(async (action: AIAction) => {
    setIsLoading(action);
    setResult(null);
    setActionType(action);
    let apiResult: string | string[] | null = null;
    
    try {
      if (action === 'summarize') {
        apiResult = await summarizeText(`${item.title}\n${item.body}`);
      } else if (action === 'tags') {
        apiResult = await suggestTags(item);
      } else if (action === 'effort') {
        apiResult = await estimateEffort(item);
      }
      setResult(apiResult);
    } catch (error) {
      console.error(`AI action '${action}' failed:`, error);
      setResult('An error occurred.');
    } finally {
      setIsLoading(null);
    }
  }, [item]);

  const handleAddTags = () => {
    if (actionType === 'tags' && Array.isArray(result)) {
      const newTags = result.filter(tag => !item.tags.includes(tag));
      onUpdate({ ...item, tags: [...item.tags, ...newTags] });
      setResult(null);
      setActionType(null);
    }
  };

  const ActionButton: React.FC<{ action: AIAction, children: React.ReactNode }> = ({ action, children }) => (
    <button
      onClick={() => handleAction(action)}
      disabled={!!isLoading}
      className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-wait"
    >
      {isLoading === action ? 'Working...' : children}
    </button>
  );

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center justify-start gap-2">
        <ActionButton action="summarize">Summarize</ActionButton>
        <ActionButton action="tags">Suggest Tags</ActionButton>
        <ActionButton action="effort">Estimate Effort</ActionButton>
      </div>

      {result && (
        <div className="mt-3 p-3 bg-white dark:bg-neutral-700/50 rounded-lg">
          {actionType === 'summarize' && <p className="text-sm text-neutral-700 dark:text-neutral-200">{result}</p>}
          {actionType === 'effort' && <p className="text-sm text-neutral-700 dark:text-neutral-200">Estimated effort: <span className="font-bold">{result}</span></p>}
          {actionType === 'tags' && Array.isArray(result) && (
            <div>
              <p className="text-sm font-medium mb-2">Suggested Tags:</p>
              <div className="flex flex-wrap gap-2">
                {result.map((tag: string) => (
                  <span key={tag} className="text-xs bg-accent/20 text-accent-800 dark:text-accent-200 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              {result.length > 0 && 
                <button onClick={handleAddTags} className="mt-3 text-xs bg-secondary text-white font-semibold px-3 py-1.5 rounded-md hover:opacity-90">
                    Add Tags to Item
                </button>
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
