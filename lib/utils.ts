import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AccessType, AssetType, Environment } from '@/types/access';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApproverPath(
  accessType: AccessType,
  assetType: AssetType,
  environment?: Environment
): string[] {
  const basePath = ['Manager'];

  if (assetType === 'dataset') {
    basePath.push('Data Owner');
    if (accessType === 'machine' || environment === 'prod') {
      basePath.push('Security');
    }
  } else if (assetType === 'api') {
    basePath.push('API Owner');
    if (environment === 'prod') {
      basePath.push('Security', 'Compliance');
    }
  } else {
    basePath.push('Data Owner');
  }

  return basePath;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes}${ampm}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function parseTags(input: string): string[] {
  if (!input || input.trim() === '') return [];
  return input
    .split(/,|\n/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// localStorage helpers for draft persistence
export function loadDraft(draftId: string): any | null {
  try {
    const stored = localStorage.getItem(`access-draft-${draftId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load draft:', error);
  }
  return null;
}

export function saveDraftToStorage(draftId: string, draft: any): void {
  try {
    localStorage.setItem(`access-draft-${draftId}`, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

export function clearDraftFromStorage(draftId: string): void {
  try {
    localStorage.removeItem(`access-draft-${draftId}`);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
}

// CBT validation helper
export function isCbtValid(lastCompletedAt: Date | undefined, expiryMonths: number): boolean {
  if (!lastCompletedAt) return false;
  const expiryDate = new Date(lastCompletedAt);
  expiryDate.setMonth(expiryDate.getMonth() + expiryMonths);
  return new Date() < expiryDate;
}

export function getNowIsoTimeLabel(): string {
  return new Date().toISOString();
}

// Format date for display
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getStatusBadgeColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'approved':
      return 'default';
    case 'denied':
    case 'destructive':
      return 'secondary';
    case 'pending_manager':
    case 'pending_data_owner':
    case 'pending_security':
    case 'in_progress':
      return 'secondary';
    default:
      return 'outline';
  }
}
