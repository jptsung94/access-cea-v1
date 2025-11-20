export type AccessType = 'human' | 'machine';
export type AssetType = 'dataset' | 'api' | 'bi' | 'warehouse';
export type Environment = 'dev' | 'stage' | 'prod';

export type RequestStatus = 
  | 'pending_manager'
  | 'pending_data_owner'
  | 'pending_security'
  | 'approved'
  | 'denied'
  | 'in_progress';

export type PrereqStatus = 'complete' | 'incomplete' | 'auto';

export interface Prerequisite {
  id: string;
  label: string;
  description: string;
  link?: string;
  autoVerified?: boolean;
  completed?: boolean;
  verifiable?: boolean;
  allowUpload?: boolean;
}

// New: Role requirement for datasets
export interface RoleRequirement {
  roleId: string;
  label: string;
  description: string;
  hasAccess: boolean;
  requiresCbts: CbtRequirement[];
}

export interface CbtRequirement {
  id: string;
  name: string;
  link?: string;
  expiryMonths: number; // e.g., 12 for -12 suffix
  lastCompletedAt?: Date;
  isValid: boolean;
  isExpired: boolean;
}

export interface AccessField {
  id: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'tags' | 'file' | 'date';
  required: boolean;
  options?: { value: string; label: string }[];
  description?: string;
  rightAdornment?: string;
  condition?: {
    field: string;
    value: any;
  };
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  description: string;
  owner?: string;
  roles?: RoleRequirement[]; // For datasets
}

export interface FileAttachment {
  name: string;
  size: number;
  type: string;
}

export interface DraftRequest {
  id: string;
  assets: Asset[];
  activeAssetId?: string; // Current asset in multi-asset workflow
  accessType?: AccessType;
  environment?: Environment;
  prereqStatus: Record<string, Record<string, PrereqStatus>>; // assetId -> prereqId -> status
  fieldValues: Record<string, any>;
  attachments: FileAttachment[];
  // Dataset-specific: selected roles per asset
  datasetRoles: Record<string, string[]>; // assetId -> roleIds[]
  // Dataset-specific: CBT completion overrides
  cbtCompletionOverrides: Record<string, Record<string, boolean>>; // assetId -> cbtId -> completed
  lastSavedAt: number;
}

export interface AccessRequest {
  id: string;
  assets: Asset[];
  accessType: AccessType;
  environment?: Environment;
  requesterEid: string;
  requesterName: string;
  requesterTitle: string;
  requesterLob: string;
  fields: Record<string, any>;
  status: RequestStatus;
  currentApprover?: string;
  approverPath: string[];
  currentApproverIndex: number;
  attachments?: FileAttachment[];
  // Dataset-specific
  selectedRoles?: string[]; // For dataset requests
  createdAt: Date;
  updatedAt: Date;
  lastNudgedAt?: Date;
  denialReason?: string;
}

export interface ApproverAction {
  requestId: string;
  action: 'approve' | 'deny';
  reason?: string;
  approverEid: string;
}

export interface UserProfile {
  eid: string;
  name: string;
  title: string;
  lob: string;
  completedTrainings: string[];
  // New: CBT completion tracking with dates
  cbtCompletions: Record<string, Date>; // cbtId -> lastCompletedAt
}