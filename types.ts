export enum CaptureItemType {
  Task = 'Task',
  Idea = 'Idea',
  Note = 'Note',
  Media = 'Media',
}

export enum View {
  Inbox = 'Inbox',
  Review = 'Review',
  Scheduled = 'Scheduled',
  Ongoing = 'Ongoing',
  Calendar = 'Calendar',
  ReEvaluate = 'Re-evaluate',
  Discard = 'Discard',
}

export interface CaptureItem {
  id: string;
  type: CaptureItemType;
  title: string;
  body: string;
  attachments?: any[];
  tags: string[];
  source: string;
  createdAt: string;
  processed_flag: boolean;
  status?: 'todo' | 'ongoing' | 'done';
  link_to_task_or_calendar_event?: string;
  startDate?: string;
  dueDate?: string;
  reach?: number;
  impact?: number;
  confidence?: number;
  effort?: number;
  certainty?: 'certain' | 'uncertain';
  assignedTo?: string;
  binned?: boolean;
  category?: 'do-now' | 're-evaluate';
  prioritizationType?: 'professional' | 'personal';
  finalScore?: number;
  project?: string;
  taskCategory?: 'future' | 'maintain' | 'distraction';
}