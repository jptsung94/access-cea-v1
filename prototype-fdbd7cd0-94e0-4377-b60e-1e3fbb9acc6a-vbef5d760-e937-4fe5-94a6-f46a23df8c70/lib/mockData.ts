import { UserProfile, AccessRequest, Asset, AssetType, RoleRequirement } from '@/types/access';

// Mock user profile with CBT completions
export const MOCK_USER_PROFILE: UserProfile = {
  eid: 'E123456',
  name: 'Priya Sharma',
  title: 'Application Developer',
  lob: 'card',
  completedTrainings: ['data_privacy_cbt', 'api_security_cbt', 'gdpr_training'],
  cbtCompletions: {
    'ITM_2335893': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago - valid for 12 months
    'ITM_9988776': new Date(Date.now() - 400 * 24 * 60 * 60 * 1000), // ~13 months ago - expired
    'DATA_HANDLING_101': new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago - valid
  },
};

// Mock dataset assets with role requirements
export const MOCK_CUSTOMER_TRANSACTIONS_DATASET: Asset = {
  id: 'asset-dataset-txn-001',
  name: 'Customer Transactions (v2)',
  type: 'dataset' as AssetType,
  description: 'Comprehensive customer transaction history including purchases, returns, and refunds. Updated daily.',
  owner: 'Data Platform Team',
  roles: [
    {
      roleId: 'PHDP_CUSTOMER_TXN_READ',
      label: 'PHDP_CUSTOMER_TXN_READ',
      description: 'Read-only access to customer transaction dataset',
      hasAccess: false,
      requiresCbts: [
        {
          id: 'ITM_2335893',
          name: 'Data Privacy & Handling (ITM_2335893-12)',
          link: 'https://onelearn.example.com/cbt/ITM_2335893',
          expiryMonths: 12,
          lastCompletedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isValid: true,
          isExpired: false,
        },
      ],
    },
    {
      roleId: 'PHDP_CUSTOMER_TXN_WRITE',
      label: 'PHDP_CUSTOMER_TXN_WRITE',
      description: 'Write access to customer transaction dataset (requires manager approval)',
      hasAccess: false,
      requiresCbts: [
        {
          id: 'ITM_2335893',
          name: 'Data Privacy & Handling (ITM_2335893-12)',
          link: 'https://onelearn.example.com/cbt/ITM_2335893',
          expiryMonths: 12,
          lastCompletedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isValid: true,
          isExpired: false,
        },
        {
          id: 'DATA_HANDLING_101',
          name: 'Advanced Data Stewardship (DATA_HANDLING_101-6)',
          link: 'https://onelearn.example.com/cbt/DATA_HANDLING_101',
          expiryMonths: 6,
          lastCompletedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          isValid: true,
          isExpired: false,
        },
      ],
    },
  ],
};

export const MOCK_MARKETING_LEADS_DATASET: Asset = {
  id: 'asset-dataset-leads-002',
  name: 'Marketing Leads Mart',
  type: 'dataset' as AssetType,
  description: 'Marketing lead generation data with campaign attribution and conversion tracking.',
  owner: 'Marketing Analytics Team',
  roles: [
    {
      roleId: 'MARKETING_LEADS_CONSUMER',
      label: 'MARKETING_LEADS_CONSUMER',
      description: 'Consumer access for marketing lead data',
      hasAccess: true, // User already has this role
      requiresCbts: [
        {
          id: 'ITM_9988776',
          name: 'Marketing Data Ethics (ITM_9988776-12)',
          link: 'https://onelearn.example.com/cbt/ITM_9988776',
          expiryMonths: 12,
          lastCompletedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
          isValid: false,
          isExpired: true,
        },
      ],
    },
    {
      roleId: 'MARKETING_LEADS_PRODUCER',
      label: 'MARKETING_LEADS_PRODUCER',
      description: 'Producer access to update and manage marketing leads',
      hasAccess: false,
      requiresCbts: [
        {
          id: 'ITM_9988776',
          name: 'Marketing Data Ethics (ITM_9988776-12)',
          link: 'https://onelearn.example.com/cbt/ITM_9988776',
          expiryMonths: 12,
          lastCompletedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
          isValid: false,
          isExpired: true,
        },
        {
          id: 'DATA_HANDLING_101',
          name: 'Advanced Data Stewardship (DATA_HANDLING_101-6)',
          link: 'https://onelearn.example.com/cbt/DATA_HANDLING_101',
          expiryMonths: 6,
          lastCompletedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          isValid: true,
          isExpired: false,
        },
      ],
    },
  ],
};

// Mock asset - Customer Profile API
export const MOCK_CUSTOMER_PROFILE_API: Asset = {
  id: 'asset-api-001',
  name: 'Customer Profile API',
  type: 'api' as AssetType,
  description: 'RESTful API providing access to customer profile data including demographics, preferences, and account information. Rate limited to 1000 requests per minute.',
  owner: 'Data Platform Team',
};

// Additional mock assets for testing
export const MOCK_ASSETS: Asset[] = [
  MOCK_CUSTOMER_PROFILE_API,
  MOCK_CUSTOMER_TRANSACTIONS_DATASET,
  MOCK_MARKETING_LEADS_DATASET,
  {
    id: 'asset-dataset-001',
    name: 'Sales Analytics Dataset',
    type: 'dataset',
    description: 'Historical sales data for analytics and reporting',
    owner: 'Analytics Team',
    roles: [
      {
        roleId: 'SALES_ANALYTICS_READ',
        label: 'SALES_ANALYTICS_READ',
        description: 'Read-only access to sales analytics',
        hasAccess: false,
        requiresCbts: [],
      },
    ],
  },
  {
    id: 'asset-bi-001',
    name: 'Executive Dashboard',
    type: 'bi',
    description: 'Power BI dashboard with company-wide metrics',
    owner: 'Business Intelligence Team',
  },
  {
    id: 'asset-warehouse-001',
    name: 'Enterprise Data Warehouse',
    type: 'warehouse',
    description: 'Central data warehouse for enterprise analytics',
    owner: 'Data Engineering Team',
  },
];

// Mock existing requests
export const MOCK_INITIAL_REQUESTS: AccessRequest[] = [
  {
    id: 'req-001',
    assets: [
      {
        id: 'asset-dataset-002',
        name: 'Marketing Campaign Dataset',
        type: 'dataset',
        description: 'Campaign performance metrics',
      },
    ],
    accessType: 'human',
    requesterEid: 'E123456',
    requesterName: 'Priya Sharma',
    requesterTitle: 'Application Developer',
    requesterLob: 'card',
    fields: {
      businessJustification: 'Need to analyze campaign performance for Q4 planning',
      eid: 'E123456',
      title: 'Application Developer',
      lob: 'card',
    },
    status: 'pending_manager',
    currentApprover: 'Sarah Johnson (Manager)',
    approverPath: ['Manager', 'Data Owner'],
    currentApproverIndex: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'req-002',
    assets: [
      {
        id: 'asset-api-002',
        name: 'Payment Processing API',
        type: 'api',
        description: 'API for payment transactions',
      },
    ],
    accessType: 'machine',
    environment: 'prod',
    requesterEid: 'E123456',
    requesterName: 'Priya Sharma',
    requesterTitle: 'Application Developer',
    requesterLob: 'card',
    fields: {
      businessJustification: 'Integration with checkout service',
      eid: 'E123456',
      title: 'Application Developer',
      lob: 'card',
      application: 'customer_portal',
      clientId: 'client-portal-prod',
      onCallId: 'ONCALL-ENG-01',
    },
    status: 'approved',
    approverPath: ['Manager', 'Data Owner', 'Security Team', 'Compliance Team'],
    currentApproverIndex: 4,
    attachments: [
      { name: 'asv-scan-2024-001.pdf', size: 245678, type: 'application/pdf' }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 'req-003',
    assets: [
      {
        id: 'asset-warehouse-002',
        name: 'Customer Data Warehouse',
        type: 'warehouse',
        description: 'Customer analytics warehouse',
      },
    ],
    accessType: 'human',
    environment: 'prod',
    requesterEid: 'E123456',
    requesterName: 'Priya Sharma',
    requesterTitle: 'Application Developer',
    requesterLob: 'card',
    fields: {
      businessJustification: 'Ad-hoc customer behavior analysis',
      eid: 'E123456',
      title: 'Application Developer',
      lob: 'card',
    },
    status: 'denied',
    approverPath: ['Manager', 'Data Owner', 'Security Team'],
    currentApproverIndex: 1,
    denialReason: 'Insufficient business justification. Please provide specific use case and expected outputs.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  },
];

// Mock approver queue (requests waiting for current user's approval)
export const MOCK_APPROVER_QUEUE: AccessRequest[] = [
  {
    id: 'req-approve-001',
    assets: [
      {
        id: 'asset-dataset-003',
        name: 'Financial Reporting Dataset',
        type: 'dataset',
        description: 'Quarterly financial data',
      },
    ],
    accessType: 'human',
    environment: 'dev',
    requesterEid: 'E789012',
    requesterName: 'John Chen',
    requesterTitle: 'Data Analyst',
    requesterLob: 'bank',
    fields: {
      businessJustification: 'Required for quarterly board presentation and financial analysis',
      eid: 'E789012',
      title: 'Data Analyst',
      lob: 'bank',
    },
    status: 'pending_data_owner',
    currentApprover: 'Priya Sharma (Data Owner)',
    approverPath: ['Manager', 'Data Owner'],
    currentApproverIndex: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'req-approve-002',
    assets: [
      {
        id: 'asset-api-003',
        name: 'User Authentication API',
        type: 'api',
        description: 'SSO and authentication services',
      },
    ],
    accessType: 'machine',
    environment: 'prod',
    requesterEid: 'E345678',
    requesterName: 'Maria Rodriguez',
    requesterTitle: 'Senior Engineer',
    requesterLob: 'software',
    fields: {
      businessJustification: 'New microservice needs authentication integration',
      eid: 'E345678',
      title: 'Senior Engineer',
      lob: 'software',
      application: 'ml_model_service',
      clientId: 'client-ml-prod-002',
      onCallId: 'ONCALL-ML-03',
    },
    status: 'pending_data_owner',
    currentApprover: 'Priya Sharma (Data Owner)',
    approverPath: ['Manager', 'Data Owner', 'Security Team', 'Compliance Team'],
    currentApproverIndex: 1,
    attachments: [
      { name: 'asv-scan-ml-045.pdf', size: 189234, type: 'application/pdf' }
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];