
import React from 'react';
import { View } from '../types';
import { SparkleIcon } from './icons/SparkleIcon';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const NavButton: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
        currentView === view
          ? 'bg-primary text-white'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <SparkleIcon className="w-6 h-6 text-primary" />
           <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            Monk
          </h1>
        </div>
        <nav className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg flex-wrap">
          <NavButton view={View.Inbox}>Inbox</NavButton>
          <NavButton view={View.Review}>Review</NavButton>
          <NavButton view={View.Scheduled}>Scheduled</NavButton>
          <NavButton view={View.Ongoing}>Ongoing</NavButton>
          <NavButton view={View.Calendar}>Calendar</NavButton>
          <NavButton view={View.ReEvaluate}>Re-evaluate</NavButton>
          <NavButton view={View.Discard}>Discard</NavButton>
        </nav>
      </div>
    </header>
  );
};

export default Header;