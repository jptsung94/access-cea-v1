import { AccessField, AccessType, AssetType, Environment, UserProfile } from '@/types/access';
import { z } from 'zod';

// Master field library with all standardized fields per requirements
export const FIELD_LIBRARY: Record<string, AccessField> = {
  // Common Fields (all asset types)
  businessJustification: {
    id: 'businessJustification',
    label: 'Business Justification',
    placeholder: 'Explain why you need access to this asset...',
    type: 'textarea',
    required: true,
    description: 'Provide a clear business reason for requesting access',
  },
  eid: {
    id: 'eid',
    label: 'Employee ID (EID)',
    placeholder: 'e.g., E123456',
    type: 'text',
    required: true,
  },
  title: {
    id: 'title',
    label: 'Job Title',
    placeholder: 'e.g., Data Analyst',
    type: 'text',
    required: true,
  },
  lob: {
    id: 'lob',
    label: 'Line of Business',
    placeholder: 'Select your LOB',
    type: 'select',
    required: true,
    options: [
      { value: 'card', label: 'Card' },
      { value: 'epx', label: 'EPX' },
      { value: 'bank', label: 'Bank' },
      { value: 'auto', label: 'Auto' },
      { value: 'software', label: 'Software' },
      { value: 'other', label: 'Other' },
    ],
  },
  environment: {
    id: 'environment',
    label: 'Environment',
    placeholder: 'Select environment',
    type: 'select',
    required: true,
    options: [
      { value: 'dev', label: 'Development' },
      { value: 'stage', label: 'Staging' },
      { value: 'prod', label: 'Production' },
    ],
    description: 'Select the environment you need access to',
  },
  
  // Standardized Application Name (APIs, Features, OneLake, OneStream Kafka, DPI)
  applicationName: {
    id: 'applicationName',
    label: 'Application Name',
    placeholder: 'Select or enter application name',
    type: 'select',
    required: true,
    options: [
      { value: 'customer_portal', label: 'Customer Portal' },
      { value: 'data_pipeline', label: 'Data Pipeline Service' },
      { value: 'analytics_dashboard', label: 'Analytics Dashboard' },
      { value: 'ml_model_service', label: 'ML Model Service' },
      { value: 'reporting_engine', label: 'Reporting Engine' },
    ],
  },
  
  // On-call Support / Production ID (API, OneLake, BatchID)
  onCallSupportId: {
    id: 'onCallSupportId',
    label: 'On-call Support / Production ID',
    placeholder: 'e.g., PROD-ONCALL-123',
    type: 'text',
    required: true,
    description: 'Your on-call rotation identifier or production support contact',
  },
  
  // Entitlements (BI Reports, Features, OneLake, OneStream)
  entitlements: {
    id: 'entitlements',
    label: 'Required Entitlements',
    placeholder: 'Select entitlements',
    type: 'select',
    required: false,
    options: [
      { value: 'read', label: 'Read' },
      { value: 'write', label: 'Write' },
      { value: 'admin', label: 'Admin' },
    ],
  },
  
  // Machine Access Fields
  clientId: {
    id: 'clientId',
    label: 'Client ID',
    placeholder: 'e.g., client-abc-123',
    type: 'text',
    required: true,
  },
  batchId: {
    id: 'batchId',
    label: 'Batch ID',
    placeholder: 'e.g., batch-xyz-789',
    type: 'text',
    required: false,
    description: 'Required for dataset batch processing workflows',
  },
  
  // API Metadata Fields (specific to APIs)
  endpoints: {
    id: 'endpoints',
    label: 'Required API Endpoints',
    placeholder: 'e.g., /api/v1/customers, /api/v1/profiles',
    type: 'tags',
    required: true,
    description: 'Enter endpoints separated by commas or new lines',
  },
  expectedResponseTimeMs: {
    id: 'expectedResponseTimeMs',
    label: 'Expected Response Time',
    placeholder: 'e.g., 200',
    type: 'number',
    required: true,
    rightAdornment: 'ms',
    description: 'Target response time in milliseconds',
  },
  averageTransactions: {
    id: 'averageTransactions',
    label: 'Average Transactions per Day',
    placeholder: 'e.g., 10000',
    type: 'number',
    required: true,
    description: 'Expected daily transaction volume',
  },
  productionDate: {
    id: 'productionDate',
    label: 'Expected Production Date',
    placeholder: 'YYYY-MM-DD',
    type: 'date',
    required: false,
    description: 'When do you plan to go live in production?',
  },
  
  // Production AWS Account (shown only for prod environment)
  productionAwsAccountId: {
    id: 'productionAwsAccountId',
    label: 'Production AWS Account ID',
    placeholder: 'e.g., 123456789012',
    type: 'text',
    required: true,
    description: 'Your 12-digit AWS account identifier for production',
  },
  
  // Dataset-specific fields
  objects: {
    id: 'objects',
    label: 'Database Objects / Tables',
    placeholder: 'e.g., customers, transactions',
    type: 'tags',
    required: false,
    description: 'Specific tables or objects you need access to',
  },
  dataSensitivity: {
    id: 'dataSensitivity',
    label: 'Data Sensitivity Level',
    placeholder: 'Select sensitivity',
    type: 'select',
    required: false,
    options: [
      { value: 'public', label: 'Public' },
      { value: 'internal', label: 'Internal' },
      { value: 'confidential', label: 'Confidential' },
      { value: 'restricted', label: 'Restricted' },
    ],
  },
};

// Get default fields based on context
export function getDefaultFieldsForContext(
  accessType: AccessType,
  assetType: AssetType
): AccessField[] {
  const baseFields = [
    FIELD_LIBRARY.businessJustification,
    FIELD_LIBRARY.eid,
    FIELD_LIBRARY.title,
    FIELD_LIBRARY.lob,
  ];

  // Machine access always includes application name and client ID
  if (accessType === 'machine') {
    baseFields.push(
      FIELD_LIBRARY.applicationName,
      FIELD_LIBRARY.clientId
    );
  }

  return baseFields;
}

// Get conditional fields based on asset type and environment
export function getConditionalFieldsForAsset(
  assetType: AssetType,
  accessType: AccessType,
  environment?: Environment
): AccessField[] {
  const fields: AccessField[] = [];

  // API-specific metadata fields (per requirements)
  if (assetType === 'api') {
    if (accessType === 'machine') {
      fields.push(
        FIELD_LIBRARY.endpoints,
        FIELD_LIBRARY.expectedResponseTimeMs,
        FIELD_LIBRARY.averageTransactions,
        FIELD_LIBRARY.productionDate,
        FIELD_LIBRARY.onCallSupportId
      );
    }
  }

  // Dataset Batch ID requirements
  if (assetType === 'dataset') {
    fields.push(
      FIELD_LIBRARY.batchId,
      FIELD_LIBRARY.objects,
      FIELD_LIBRARY.dataSensitivity
    );
  }

  // OneLake includes application name, on-call support, entitlements
  if (assetType === 'warehouse') {
    fields.push(
      FIELD_LIBRARY.applicationName,
      FIELD_LIBRARY.onCallSupportId,
      FIELD_LIBRARY.entitlements
    );
  }

  // BI Reports, Features, OneStream include application name and entitlements
  if (assetType === 'bi') {
    fields.push(
      FIELD_LIBRARY.applicationName,
      FIELD_LIBRARY.entitlements
    );
  }

  // Production AWS Account Details (only for prod environment)
  if (environment === 'prod') {
    fields.push(FIELD_LIBRARY.productionAwsAccountId);
  }

  return fields;
}

// Get all fields for a specific context
export function getAllFieldsForContext(
  accessType: AccessType,
  assetType: AssetType,
  environment?: Environment
): AccessField[] {
  const defaultFields = getDefaultFieldsForContext(accessType, assetType);
  const conditionalFields = getConditionalFieldsForAsset(assetType, accessType, environment);
  
  // Always include environment selector
  return [FIELD_LIBRARY.environment, ...defaultFields, ...conditionalFields];
}

// Get Zod schema for validation
export function getZodSchemaForContext(
  fields: AccessField[]
): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};
  
  fields.forEach(field => {
    let validator: z.ZodTypeAny;
    
    switch (field.type) {
      case 'email':
        validator = z.string().email('Invalid email address');
        break;
      case 'number':
        validator = z.coerce.number().positive('Must be a positive number');
        break;
      case 'date':
        validator = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format');
        break;
      case 'tags':
        validator = z.union([
          z.array(z.string()),
          z.string().transform(val => val.split(/[,\n]/).map(s => s.trim()).filter(Boolean))
        ]);
        break;
      case 'file':
        validator = z.any(); // File validation handled separately
        break;
      default:
        validator = z.string().min(1, `${field.label} is required`);
    }
    
    if (!field.required) {
      validator = validator.optional();
    }
    
    shape[field.id] = validator;
  });
  
  return z.object(shape);
}

// Get default values for fields
export function getDefaultValues(fields: AccessField[], profile?: any): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  fields.forEach(field => {
    if (field.id === 'eid' && profile?.eid) {
      defaults[field.id] = profile.eid;
    } else if (field.id === 'title' && profile?.title) {
      defaults[field.id] = profile.title;
    } else if (field.id === 'lob' && profile?.lob) {
      defaults[field.id] = profile.lob;
    } else if (field.type === 'tags') {
      defaults[field.id] = [];
    } else {
      defaults[field.id] = '';
    }
  });
  
  return defaults;
}

// Get default values with realistic assumptions for autofill
export function getDefaultValuesForContext(
  accessType: AccessType,
  assetType: AssetType,
  environment: Environment,
  profile: UserProfile
): Record<string, any> {
  const today = new Date().toISOString().split('T')[0];
  
  const values: Record<string, any> = {
    // User info (pre-populated)
    eid: profile.eid,
    title: profile.title,
    lob: profile.lob,
    
    // Environment
    environment,
    
    // Business justification
    businessJustification: `Requesting ${accessType} access to ${assetType} in ${environment} environment for ongoing project requirements. This access is necessary to support critical business operations and data analytics workflows.`,
  };
  
  // Machine access specific fields
  if (accessType === 'machine') {
    values.applicationName = 'data_pipeline';
    values.clientId = `client-${profile.eid.toLowerCase()}-${Date.now().toString(36)}`;
  }
  
  // API specific fields
  if (assetType === 'api' && accessType === 'machine') {
    values.endpoints = ['/api/v1/customers', '/api/v1/orders'];
    values.expectedResponseTimeMs = '200';
    values.averageTransactions = '5000';
    values.productionDate = today;
    values.onCallSupportId = `ONCALL-${profile.eid}`;
  }
  
  // Dataset specific fields
  if (assetType === 'dataset') {
    values.batchId = `BATCH-${Date.now().toString(36).substring(0, 8).toUpperCase()}`;
    values.objects = ['customers', 'transactions'];
    values.dataSensitivity = 'internal';
  }
  
  // Warehouse fields
  if (assetType === 'warehouse') {
    values.applicationName = 'analytics_dashboard';
    values.onCallSupportId = `ONCALL-${profile.eid}`;
    values.entitlements = 'read';
  }
  
  // Production environment fields
  if (environment === 'prod') {
    values.productionAwsAccountId = '123456789012';
  }
  
  return values;
}
