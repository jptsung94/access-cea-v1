import { create } from 'zustand';
import { AccessRequest, ApproverAction, UserProfile, DraftRequest, Asset, AccessType, Environment, PrereqStatus, FileAttachment } from '@/types/access';
import { MOCK_USER_PROFILE, MOCK_INITIAL_REQUESTS, MOCK_APPROVER_QUEUE } from '@/lib/mockData';
import { loadDraft, saveDraftToStorage, clearDraftFromStorage, debounce } from '@/lib/utils';
import { getDefaultValuesForContext } from '@/lib/formLibrary';
import { markPrereqsComplete } from '@/lib/prerequisites';

interface AccessState {
  profile: UserProfile;
  requests: AccessRequest[];
  approvalQueue: AccessRequest[];
  nudges: Map<string, Date>;
  draft: DraftRequest | null;
  draftSaving: boolean;
  draftLastSaved: number | null;
  
  // Draft actions
  createDraft: (assets: Asset[]) => void;
  updateDraftField: (field: string, value: any) => void;
  updateDraftAccessType: (accessType: AccessType) => void;
  updateDraftEnvironment: (environment: Environment) => void;
  updatePrereqStatus: (assetId: string, prereqId: string, status: PrereqStatus) => void;
  attachFiles: (files: FileAttachment[]) => void;
  saveDraft: () => void;
  loadStoredDraft: (draftId: string) => void;
  clearDraft: () => void;
  hasDraft: () => boolean;
  autofillDraftAssumptions: () => void;
  
  // Dataset-specific actions
  selectDatasetRole: (assetId: string, roleId: string, selected: boolean) => void;
  toggleCbtCompleted: (assetId: string, cbtId: string) => void;
  setActiveAsset: (assetId: string) => void;
  
  // Request actions
  submitRequests: (requests: AccessRequest[]) => void;
  nudgeRequest: (requestId: string) => boolean;
  canNudge: (requestId: string) => boolean;
  approveRequest: (action: ApproverAction) => void;
  denyRequest: (action: ApproverAction) => void;
}

const NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Create debounced save function
const debouncedSave = debounce((callback: () => void) => {
  callback();
}, 1000);

export const useAccessStore = create<AccessState>((set, get) => ({
  profile: MOCK_USER_PROFILE,
  requests: MOCK_INITIAL_REQUESTS,
  approvalQueue: MOCK_APPROVER_QUEUE,
  nudges: new Map(),
  draft: null,
  draftSaving: false,
  draftLastSaved: null,
  
  // Draft management
  createDraft: (assets) => {
    const draftId = `draft-${Date.now()}`;
    const draft: DraftRequest = {
      id: draftId,
      assets,
      activeAssetId: assets[0]?.id,
      accessType: undefined,
      environment: undefined,
      prereqStatus: {},
      fieldValues: {},
      attachments: [],
      datasetRoles: {},
      cbtCompletionOverrides: {},
      lastSavedAt: Date.now(),
    };
    
    set({ draft });
    saveDraftToStorage(draftId, draft);
  },
  
  updateDraftField: (field, value) => {
    const { draft } = get();
    if (!draft) return;
    
    const updatedDraft = {
      ...draft,
      fieldValues: {
        ...draft.fieldValues,
        [field]: value,
      },
    };
    
    set({ draft: updatedDraft });
    
    // Debounced save
    debouncedSave(() => {
      set({ draftSaving: true });
      const finalDraft = get().draft;
      if (finalDraft) {
        const savedDraft = { ...finalDraft, lastSavedAt: Date.now() };
        saveDraftToStorage(savedDraft.id, savedDraft);
        set({ 
          draft: savedDraft,
          draftSaving: false, 
          draftLastSaved: Date.now() 
        });
      }
    });
  },
  
  updateDraftAccessType: (accessType) => {
    const { draft } = get();
    if (!draft) return;
    
    const updatedDraft = {
      ...draft,
      accessType,
      lastSavedAt: Date.now(),
    };
    
    set({ draft: updatedDraft });
    saveDraftToStorage(updatedDraft.id, updatedDraft);
  },
  
  updateDraftEnvironment: (environment) => {
    const { draft } = get();
    if (!draft) return;
    
    const updatedDraft = {
      ...draft,
      environment,
      lastSavedAt: Date.now(),
    };
    
    set({ draft: updatedDraft });
    saveDraftToStorage(updatedDraft.id, updatedDraft);
  },
  
  updatePrereqStatus: (assetId, prereqId, status) => {
    const { draft } = get();
    if (!draft) return;
    
    const updatedDraft = {
      ...draft,
      prereqStatus: {
        ...draft.prereqStatus,
        [assetId]: {
          ...(draft.prereqStatus[assetId] || {}),
          [prereqId]: status,
        },
      },
      lastSavedAt: Date.now(),
    };
    
    set({ draft: updatedDraft });
    saveDraftToStorage(updatedDraft.id, updatedDraft);
  },
  
  attachFiles: (files) => {
    const { draft } = get();
    if (!draft) return;
    
    const updatedDraft = {
      ...draft,
      attachments: [...draft.attachments, ...files],
      lastSavedAt: Date.now(),
    };
    
    set({ draft: updatedDraft });
    saveDraftToStorage(updatedDraft.id, updatedDraft);
  },
  
  saveDraft: () => {
    const { draft: currentDraft } = get();
    if (!currentDraft) return;
    
    set({ draftSaving: true });
    const savedDraft = { ...currentDraft, lastSavedAt: Date.now() };
    saveDraftToStorage(savedDraft.id, savedDraft);
    
    setTimeout(() => {
      set({ 
        draft: savedDraft,
        draftSaving: false, 
        draftLastSaved: Date.now() 
      });
    }, 500);
  },
  
  loadStoredDraft: (draftId: string) => {
    const storedDraft = loadDraft(draftId);
    if (storedDraft) {
      set({ draft: storedDraft, draftLastSaved: storedDraft.lastSavedAt });
    }
  },
  
  clearDraft: () => {
    const { draft } = get();
    if (draft) {
      clearDraftFromStorage(draft.id);
    }
    set({ draft: null, draftLastSaved: null });
  },
  
  hasDraft: () => {
    return get().draft !== null;
  },
  
  // Auto-fill with assumptions
  autofillDraftAssumptions: () => {
    const { draft, profile } = get();
    if (!draft) return;
    
    const accessType: AccessType = 'machine';
    const environment: Environment = 'prod';
    const primaryAsset = draft.assets[0];
    
    // Get default values from form library
    const defaultValues = getDefaultValuesForContext(accessType, primaryAsset.type, environment, profile);
    
    // Mark all prerequisites complete
    const prereqStatusMap = markPrereqsComplete(draft.assets, accessType, environment);
    
    // Create mock ASV upload attachment
    const asvAttachment: FileAttachment = {
      name: 'asv_scan_results_2024.pdf',
      size: 245760, // ~240 KB
      type: 'application/pdf'
    };
    
    const updatedDraft: DraftRequest = {
      ...draft,
      accessType,
      environment,
      fieldValues: defaultValues,
      prereqStatus: prereqStatusMap,
      attachments: [asvAttachment],
      lastSavedAt: Date.now(),
    };
    
    set({ draft: updatedDraft, draftLastSaved: Date.now() });
    saveDraftToStorage(updatedDraft.id, updatedDraft);
  },
  
  // Dataset-specific actions
  selectDatasetRole: (assetId, roleId, selected) => {
    const { draft } = get();
    if (!draft) return;
    
    const currentRoles = draft.datasetRoles[assetId] || [];
    const updatedRoles = selected
      ? [...currentRoles, roleId]
      : currentRoles.filter(id => id !== roleId);
    
    const updatedDraft = {
      ...draft,
      datasetRoles: {
        ...draft.datasetRoles,
        [assetId]: updatedRoles,
      },
      lastSavedAt: Date.now(),
    };
    
    set({ draft: updatedDraft });
    saveDraftToStorage(updatedDraft.id, updatedDraft);
  },
  
  toggleCbtCompleted: (assetId, cbtId) => {
    const { draft } = get();
    if (!draft) return;
    
    const assetOverrides = draft.cbtCompletionOverrides[assetId] || {};
    const currentStatus = assetOverrides[cbtId];
    
    const updatedDraft = {
      ...draft,
      cbtCompletionOverrides: {
        ...draft.cbtCompletionOverrides,
        [assetId]: {
          ...assetOverrides,
          [cbtId]: !currentStatus,
        },
      },
      lastSavedAt: Date.now(),
    };
    
    set({ draft: updatedDraft });
    saveDraftToStorage(updatedDraft.id, updatedDraft);
  },
  
  setActiveAsset: (assetId) => {
    const { draft } = get();
    if (!draft) return;
    
    const updatedDraft = {
      ...draft,
      activeAssetId: assetId,
    };
    
    set({ draft: updatedDraft });
  },
  
  // Request management
  submitRequests: (newRequests) => {
    set((state) => ({
      requests: [...newRequests, ...state.requests],
    }));
    
    // Clear draft after successful submission
    get().clearDraft();
  },
  
  canNudge: (requestId) => {
    const { nudges } = get();
    const lastNudge = nudges.get(requestId);
    
    if (!lastNudge) return true;
    
    const timeSinceNudge = Date.now() - lastNudge.getTime();
    return timeSinceNudge >= NUDGE_COOLDOWN_MS;
  },
  
  nudgeRequest: (requestId) => {
    const { canNudge, nudges } = get();
    
    if (!canNudge(requestId)) {
      return false;
    }
    
    const newNudges = new Map(nudges);
    newNudges.set(requestId, new Date());
    
    set({ nudges: newNudges });
    
    // In a real app, this would send a notification to the approver
    console.log(`Nudge sent for request ${requestId}`);
    
    return true;
  },
  
  approveRequest: (action) => {
    set((state) => {
      // Remove from approval queue
      const updatedQueue = state.approvalQueue.filter(
        (req) => req.id !== action.requestId
      );
      
      // Update in all requests if it exists there
      const updatedRequests = state.requests.map((req) =>
        req.id === action.requestId
          ? { ...req, status: 'approved' as const, updatedAt: new Date() }
          : req
      );
      
      return {
        approvalQueue: updatedQueue,
        requests: updatedRequests,
      };
    });
  },
  
  denyRequest: (action) => {
    set((state) => {
      // Remove from approval queue
      const updatedQueue = state.approvalQueue.filter(
        (req) => req.id !== action.requestId
      );
      
      // Update in all requests if it exists there
      const updatedRequests = state.requests.map((req) =>
        req.id === action.requestId
          ? {
              ...req,
              status: 'denied' as const,
              denialReason: action.reason,
              updatedAt: new Date(),
            }
          : req
      );
      
      return {
        approvalQueue: updatedQueue,
        requests: updatedRequests,
      };
    });
  },
}));