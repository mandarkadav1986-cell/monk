import { CaptureItem } from '../types';

export const calculateRiceScore = (item: Partial<CaptureItem>): number => {
    const reach = item.reach || 0;
    const impact = item.impact || 0;
    const confidence = item.confidence || 0;
    const effort = item.effort || 1; // Avoid division by zero
    return Math.round((reach * impact * confidence) / effort);
};
