import React, { useState, useMemo, useEffect } from 'react';
import { CaptureItem } from '../types';

interface OngoingViewProps {
  items: CaptureItem[];
  onUpdate: (item: CaptureItem) => void;
}

const OngoingItem: React.FC<{ item: CaptureItem; onUpdate: (item: CaptureItem) => void }> = ({ item, onUpdate }) => {
  const handleMarkDone = () => {
    onUpdate({ ...item, status: 'done' });
  };

  const handleReschedule = () => {
    onUpdate({ ...item, status: 'todo' });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 flex justify-between items-center shadow-sm border-l-4 border-primary">
      <div>
        {item.project && <p className="text-xs font-semibold text-primary uppercase tracking-wider">{item.project}</p>}
        <p className="font-semibold mt-1">{item.title}</p>
        <div className="flex items-center gap-2 mt-2">
          {item.assignedTo && <span className="text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-full">{item.assignedTo}</span>}
          {item.dueDate && <span className="text-xs text-neutral-500">Due: {new Date(item.dueDate).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <button
          onClick={handleReschedule}
          className="text-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold px-4 py-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
        >
          Reschedule
        </button>
        <button
          onClick={handleMarkDone}
          className="text-sm bg-secondary text-white font-semibold px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
        >
          Mark Done
        </button>
      </div>
    </div>
  );
};

type TaskCategoryTab = 'future' | 'maintain' | 'distraction' | 'other';

const OngoingView: React.FC<OngoingViewProps> = ({ items, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<TaskCategoryTab>('future');
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const itemsInCategory = useMemo(() => {
    return items.filter(item => {
      if (activeTab === 'other') return !item.taskCategory;
      return item.taskCategory === activeTab;
    });
  }, [items, activeTab]);

  const projectsInCategory = useMemo(() => {
    const projectSet = new Set<string>();
    itemsInCategory.forEach(item => {
      projectSet.add(item.project || 'Unassigned');
    });
    return Array.from(projectSet);
  }, [itemsInCategory]);

  useEffect(() => {
    setActiveProject(projectsInCategory.length > 0 ? projectsInCategory[0] : null);
  }, [projectsInCategory]);

  const finalItemsToShow = useMemo(() => {
    if (!activeProject) return [];
    return itemsInCategory.filter(item => (item.project || 'Unassigned') === activeProject);
  }, [itemsInCategory, activeProject]);

  const CategoryTabButton: React.FC<{ tab: TaskCategoryTab; children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 capitalize ${
        activeTab === tab
          ? 'bg-primary text-white'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
      }`}
    >
      {children}
    </button>
  );

  const ProjectTabButton: React.FC<{ project: string }> = ({ project }) => (
    <button
      onClick={() => setActiveProject(project)}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
        activeProject === project
          ? 'bg-secondary text-white shadow'
          : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
      }`}
    >
      {project}
    </button>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Ongoing Tasks</h2>
      <p className="text-neutral-600 dark:text-neutral-400">
        These are the tasks you are currently working on, organized by category and project.
      </p>

      <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
        <CategoryTabButton tab="future">Future</CategoryTabButton>
        <CategoryTabButton tab="maintain">Maintain</CategoryTabButton>
        <CategoryTabButton tab="distraction">Distraction</CategoryTabButton>
        <CategoryTabButton tab="other">Other</CategoryTabButton>
      </div>

      {projectsInCategory.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap border-b border-neutral-200 dark:border-neutral-700 pb-3">
          <span className="text-sm font-semibold mr-2 text-neutral-600 dark:text-neutral-400">Projects:</span>
          {projectsInCategory.map(project => (
            <ProjectTabButton key={project} project={project} />
          ))}
        </div>
      )}

      <div className="space-y-3 pt-2">
        {projectsInCategory.length > 0 ? (
          finalItemsToShow.map(item => <OngoingItem key={item.id} item={item} onUpdate={onUpdate} />)
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <p className="text-neutral-600 dark:text-neutral-400">No ongoing tasks in the '{activeTab}' category.</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">Start a task from the 'Scheduled' view to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingView;
