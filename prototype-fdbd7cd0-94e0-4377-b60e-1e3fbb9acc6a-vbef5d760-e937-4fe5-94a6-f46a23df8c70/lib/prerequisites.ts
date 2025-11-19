import { Prerequisite, AccessType, AssetType, UserProfile, Environment, Asset, PrereqStatus } from '@/types/access';

// Master list of all prerequisites (11 comprehensive prerequisites as per requirements)
export const MASTER_PREREQUISITES: Prerequisite[] = [
  // Common Prerequisites
  {
    id: 'exchange_team',
    label: 'Exchange Team',
    description: 'Be part of an Exchange team with appropriate permissions',
    link: '/teams/join',
    autoVerified: false,
    verifiable: false,
  },
  {
    id: 'app_access',
    label: 'App Access',
    description: 'Application must be registered and approved for access',
    link: '/applications/register',
    autoVerified: false,
    verifiable: false,
  },
  {
    id: 'batch_id',
    label: 'Batch ID',
    description: 'Valid Batch ID for data processing workflows',
    autoVerified: false,
    verifiable: false,
  },
  // API Prerequisites
  {
    id: 'pre_production_access',
    label: 'Pre-production Access',
    description: 'Access approval for development and staging environments',
    autoVerified: false,
    verifiable: false,
  },
  {
    id: 'production_access',
    label: 'Production Access',
    description: 'Manager approval required for production environment access',
    autoVerified: false,
    verifiable: false,
  },
  {
    id: 'aws_account',
    label: 'AWS Account',
    description: 'Valid AWS account configured for the application',
    link: '/infrastructure/aws-setup',
    autoVerified: false,
    verifiable: false,
  },
  {
    id: 'on_call_support',
    label: 'On-Call Support Contact',
    description: 'On-call support rotation and contact information',
    link: '/operations/on-call',
    autoVerified: false,
    verifiable: false,
  },
  {
    id: 'production_aws_account',
    label: 'Production AWS Account',
    description: 'Production-specific AWS account details',
    autoVerified: false,
    verifiable: false,
  },
  {
    id: 'asv_scan',
    label: 'ASV Scan',
    description: 'Valid Application Security Verification scan results',
    link: '/security/asv-scans',
    autoVerified: false,
    verifiable: false,
    allowUpload: true,
  },
  // Dataset Prerequisites
  {
    id: 'cbts',
    label: 'CBTs (Computer-Based Trainings)',
    description: 'Complete required training modules for data access',
    link: '/training/courses',
    autoVerified: true,
    verifiable: true,
  },
  {
    id: 'objects',
    label: 'Objects',
    description: 'Specific database objects or tables requested',
    autoVerified: false,
    verifiable: false,
  },
];

// Get relevant prerequisites based on context
export function getPrereqsForContext(
  accessType: AccessType,
  assetType: AssetType,
  environment?: Environment
): Prerequisite[] {
  const prereqs: Prerequisite[] = [];

  // API prerequisites (8 total as per requirements)
  if (assetType === 'api') {
    prereqs.push(
      MASTER_PREREQUISITES.find(p => p.id === 'exchange_team')!,
      MASTER_PREREQUISITES.find(p => p.id === 'app_access')!,
      MASTER_PREREQUISITES.find(p => p.id === 'on_call_support')!,
      MASTER_PREREQUISITES.find(p => p.id === 'aws_account')!,
      MASTER_PREREQUISITES.find(p => p.id === 'asv_scan')!
    );

    // Add environment-specific prereqs
    if (environment === 'prod') {
      prereqs.push(
        MASTER_PREREQUISITES.find(p => p.id === 'production_access')!,
        MASTER_PREREQUISITES.find(p => p.id === 'production_aws_account')!
      );
    } else {
      prereqs.push(
        MASTER_PREREQUISITES.find(p => p.id === 'pre_production_access')!
      );
    }
  }

  // Dataset prerequisites (3 total as per requirements)
  if (assetType === 'dataset') {
    prereqs.push(
      MASTER_PREREQUISITES.find(p => p.id === 'cbts')!,
      MASTER_PREREQUISITES.find(p => p.id === 'batch_id')!,
      MASTER_PREREQUISITES.find(p => p.id === 'objects')!
    );
  }

  // Warehouse similar to datasets
  if (assetType === 'warehouse') {
    prereqs.push(
      MASTER_PREREQUISITES.find(p => p.id === 'cbts')!,
      MASTER_PREREQUISITES.find(p => p.id === 'batch_id')!,
      MASTER_PREREQUISITES.find(p => p.id === 'production_aws_account')!
    );
  }

  // BI and other asset types
  if (assetType === 'bi') {
    prereqs.push(
      MASTER_PREREQUISITES.find(p => p.id === 'exchange_team')!,
      MASTER_PREREQUISITES.find(p => p.id === 'cbts')!
    );
  }

  // Remove duplicates and nulls
  return Array.from(new Map(prereqs.filter(Boolean).map(p => [p.id, p])).values());
}

// Get prerequisites display organized by asset
export function getPrereqDisplayByAsset(
  assets: Asset[],
  accessType: AccessType,
  environment?: Environment
): Record<string, Prerequisite[]> {
  const prereqsByAsset: Record<string, Prerequisite[]> = {};
  
  assets.forEach(asset => {
    prereqsByAsset[asset.id] = getPrereqsForContext(accessType, asset.type, environment);
  });
  
  return prereqsByAsset;
}

// Auto-verify prerequisites based on user profile
export function autoVerifyPrereqs(
  profile: UserProfile,
  prereqs: Prerequisite[]
): Set<string> {
  const completed = new Set<string>();

  prereqs.forEach(prereq => {
    if (prereq.autoVerified && prereq.verifiable && profile.completedTrainings.includes(prereq.id)) {
      completed.add(prereq.id);
    }
  });

  return completed;
}

// Mock training database for auto-verification
export const MOCK_TRAINING_DB: Record<string, string[]> = {
  'E123456': ['cbts', 'exchange_team'],
  'E789012': ['cbts'],
};

// Helper to check if all required prerequisites are completed
export function arePrerequisitesComplete(
  prereqs: Prerequisite[],
  completedIds: Set<string>,
  userMarkedComplete: Set<string>
): boolean {
  return prereqs.every(prereq => 
    completedIds.has(prereq.id) || userMarkedComplete.has(prereq.id)
  );
}

// Check if all assets have all prerequisites complete
export function areAllAssetsPrereqsComplete(
  prereqStatus: Record<string, Record<string, PrereqStatus>>,
  assets: Asset[],
  accessType: AccessType,
  environment?: Environment
): boolean {
  return assets.every(asset => {
    const assetPrereqs = getPrereqsForContext(accessType, asset.type, environment);
    const assetStatus = prereqStatus[asset.id] || {};
    
    return assetPrereqs.every(prereq => {
      const status = assetStatus[prereq.id];
      return status === 'complete' || status === 'auto';
    });
  });
}

// Mark prerequisites as complete for autofill
export function markPrereqsComplete(
  assets: Asset[],
  accessType: AccessType,
  environment?: Environment
): Record<string, Record<string, PrereqStatus>> {
  const prereqStatus: Record<string, Record<string, PrereqStatus>> = {};
  
  assets.forEach(asset => {
    const assetPrereqs = getPrereqsForContext(accessType, asset.type, environment);
    prereqStatus[asset.id] = {};
    
    assetPrereqs.forEach(prereq => {
      // Mark verifiable items as 'auto', others as 'complete'
      prereqStatus[asset.id][prereq.id] = prereq.verifiable ? 'auto' : 'complete';
    });
  });
  
  return prereqStatus;
}
