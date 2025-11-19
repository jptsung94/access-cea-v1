import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription } from
'@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  AlertCircle,
  ChevronRight,
  X,
  Upload,
  FileText,
  Save,
  Loader2,
  Info,
  Check,
  AlertTriangle,
  Sparkles } from
'lucide-react';
import { cn, getApproverPath, formatTime, parseTags, formatFileSize } from '@/lib/utils';
import {
  Asset,
  AccessType,
  Prerequisite,
  AccessField,
  AccessRequest,
  Environment,
  FileAttachment,
  PrereqStatus } from
'@/types/access';
import {
  getPrereqsForContext,
  autoVerifyPrereqs,
  areAllAssetsPrereqsComplete,
  getPrereqDisplayByAsset,
  MASTER_PREREQUISITES } from
'@/lib/prerequisites';
import { getAllFieldsForContext, getZodSchemaForContext } from '@/lib/formLibrary';
import { useAccessStore } from './AccessStore';
import { useAccessCartStore } from './AccessCartStore';
import { useToast } from '@/hooks/use-toast';

interface UnifiedAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Asset[];
}

type Step = 1 | 2 | 3 | 4;

const STEP_CONFIG = {
  1: { label: 'Prerequisites', key: 'prerequisites' },
  2: { label: 'Details', key: 'details' },
  3: { label: 'Review', key: 'review' },
  4: { label: 'Confirmation', key: 'confirmation' }
};

export function UnifiedAccessModal({ open, onOpenChange, assets }: UnifiedAccessModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const profile = useAccessStore((state) => state.profile);
  const submitRequests = useAccessStore((state) => state.submitRequests);
  const clearCart = useAccessCartStore((state) => state.clearCart);

  // Draft management
  const draft = useAccessStore((state) => state.draft);
  const createDraft = useAccessStore((state) => state.createDraft);
  const updateDraftField = useAccessStore((state) => state.updateDraftField);
  const updateDraftAccessType = useAccessStore((state) => state.updateDraftAccessType);
  const updateDraftEnvironment = useAccessStore((state) => state.updateDraftEnvironment);
  const updatePrereqStatus = useAccessStore((state) => state.updatePrereqStatus);
  const attachFiles = useAccessStore((state) => state.attachFiles);
  const saveDraft = useAccessStore((state) => state.saveDraft);
  const clearDraft = useAccessStore((state) => state.clearDraft);
  const draftSaving = useAccessStore((state) => state.draftSaving);
  const draftLastSaved = useAccessStore((state) => state.draftLastSaved);
  const autofillDraftAssumptions = useAccessStore((state) => state.autofillDraftAssumptions);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [accessType, setAccessType] = useState<AccessType | undefined>();
  const [environment, setEnvironment] = useState<Environment | undefined>();
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [prereqsByAsset, setPrereqsByAsset] = useState<Record<string, Prerequisite[]>>({});
  const [autoVerifiedPrereqs, setAutoVerifiedPrereqs] = useState<Set<string>>(new Set());
  const [formFields, setFormFields] = useState<AccessField[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [approverPath, setApproverPath] = useState<string[]>([]);
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get current step label for title
  const currentStepLabel = currentStep === 4 ? 'Success' : STEP_CONFIG[currentStep].label;

  // Initialize or restore draft
  useEffect(() => {
    if (open && assets.length > 0) {
      if (draft && draft.assets[0]?.id === assets[0]?.id) {
        // Restore from existing draft
        setAccessType(draft.accessType);
        setEnvironment(draft.environment);
        setFormValues(draft.fieldValues);
        // Start at prerequisites if no access type, else details
        setCurrentStep(draft.accessType ? 2 : 1);
      } else {
        // Create new draft
        createDraft(assets);
        setCurrentStep(1);
        setAccessType(undefined);
        setEnvironment(undefined);
        setFormValues({
          eid: profile.eid,
          title: profile.title,
          lob: profile.lob
        });
        setErrors({});
      }

      // Expand all assets by default
      setExpandedAssets(new Set(assets.map((a) => a.id)));
    }
  }, [open, assets]);

  // Update prerequisites when context changes
  useEffect(() => {
    if (assets.length > 0 && accessType) {
      const primaryAsset = assets[0];
      const prereqs = getPrereqsForContext(accessType, primaryAsset.type, environment);
      setPrerequisites(prereqs);

      const byAsset = getPrereqDisplayByAsset(assets, accessType, environment);
      setPrereqsByAsset(byAsset);

      const verified = autoVerifyPrereqs(profile, prereqs);
      setAutoVerifiedPrereqs(verified);

      // Auto-mark verified prereqs in draft
      verified.forEach((prereqId) => {
        assets.forEach((asset) => {
          if (!draft?.prereqStatus[asset.id]?.[prereqId]) {
            updatePrereqStatus(asset.id, prereqId, 'auto');
          }
        });
      });

      // Update approver path
      const path = getApproverPath(accessType, primaryAsset.type, environment);
      setApproverPath(path);
    }
  }, [accessType, environment, assets, profile]);

  // Update form fields when context changes
  useEffect(() => {
    if (assets.length > 0 && accessType) {
      const primaryAsset = assets[0];
      const fields = getAllFieldsForContext(accessType, primaryAsset.type, environment);
      setFormFields(fields);
    }
  }, [accessType, environment, assets]);

  // Sync form values from draft
  useEffect(() => {
    if (draft) {
      setFormValues(draft.fieldValues);
    }
  }, [draft]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      // Escape to close
      if (e.key === 'Escape') {
        onOpenChange(false);
      }

      // Cmd/Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveDraft();
        toast({
          title: 'Draft Saved',
          description: 'Your progress has been saved.'
        });
      }

      // Enter on Next button
      if (e.key === 'Enter' && !e.shiftKey && currentStep < 3) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentStep, saveDraft, toast]);

  // Scroll to top on step change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const isPrereqComplete = (assetId: string, prereqId: string): boolean => {
    const status = draft?.prereqStatus[assetId]?.[prereqId];
    return status === 'complete' || status === 'auto';
  };

  const togglePrereqComplete = (assetId: string, prereqId: string) => {
    const currentStatus = draft?.prereqStatus[assetId]?.[prereqId];
    const newStatus: PrereqStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';
    updatePrereqStatus(assetId, prereqId, newStatus);
  };

  const handleVerifyAgain = () => {
    const verified = autoVerifyPrereqs(profile, prerequisites);
    setAutoVerifiedPrereqs(verified);

    verified.forEach((prereqId) => {
      assets.forEach((asset) => {
        updatePrereqStatus(asset.id, prereqId, 'auto');
      });
    });

    toast({
      title: 'Verification Complete',
      description: `${verified.size} prerequisite(s) auto-verified.`
    });
  };

  const handleAutofillAssumptions = () => {
    autofillDraftAssumptions();

    toast({
      title: 'Form Auto-filled',
      description: 'Prerequisites marked complete and form populated with assumptions.'
    });

    // Navigate to review step after a brief delay
    setTimeout(() => {
      setCurrentStep(3);
    }, 500);
  };

  const canProceedFromPrerequisites = (): boolean => {
    if (!draft || !accessType) return false;
    return areAllAssetsPrereqsComplete(draft.prereqStatus, assets, accessType, environment);
  };

  const validateForm = (): {valid: boolean;errors: Record<string, string>;} => {
    const newErrors: Record<string, string> = {};

    try {
      const schema = getZodSchemaForContext(formFields);
      schema.parse(formValues);
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          newErrors[field] = err.message;
        });
      }
    }

    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    updateDraftField(fieldId, value);

    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleAccessTypeChange = (type: AccessType) => {
    setAccessType(type);
    updateDraftAccessType(type);
  };

  const handleEnvironmentChange = (env: string) => {
    const environment = env as Environment;
    setEnvironment(environment);
    updateDraftEnvironment(environment);
    handleFieldChange('environment', env);
  };

  const handleFileUpload = (prereqId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.prereqId = prereqId;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingFiles(true);

    // Simulate upload delay
    setTimeout(() => {
      const newAttachments: FileAttachment[] = files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      attachFiles(newAttachments);
      setUploadingFiles(false);

      // Mark ASV prereq as complete
      const prereqId = e.target.dataset.prereqId;
      if (prereqId === 'asv_scan') {
        assets.forEach((asset) => {
          updatePrereqStatus(asset.id, prereqId, 'complete');
        });
      }

      toast({
        title: 'File Uploaded',
        description: `${files.length} file(s) uploaded successfully.`
      });
    }, 1000);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!accessType) {
        toast({
          title: 'Access Type Required',
          description: 'Please select an access type in the Details step first.',
          variant: 'destructive'
        });
        setCurrentStep(2);
        return;
      }
      if (canProceedFromPrerequisites()) {
        setCurrentStep(2);
      } else {
        toast({
          title: 'Prerequisites Incomplete',
          description: 'Please complete all required prerequisites to continue.',
          variant: 'destructive'
        });
      }
    } else if (currentStep === 2) {
      const validation = validateForm();
      if (validation.valid) {
        setCurrentStep(3);
      } else {
        // Focus first error
        const firstErrorField = Object.keys(validation.errors)[0];
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1 as Step);
    }
  };

  const handleStepClick = (step: Step) => {
    // Allow clicking on current step or completed steps to revisit
    if (step < currentStep || step === currentStep) {
      setCurrentStep(step);
    }
  };

  const handleEditFromReview = (step: Step) => {
    setCurrentStep(step);
    // Focus first editable field after a short delay
    setTimeout(() => {
      if (step === 2 && formFields.length > 0) {
        const firstEditableField = formFields.find(
          (f) => f.id !== 'eid' && f.id !== 'title' && f.id !== 'lob'
        );
        if (firstEditableField) {
          document.getElementById(firstEditableField.id)?.focus();
        }
      }
    }, 100);
  };

  const handleSubmit = () => {
    if (!accessType || !draft) return;

    // Final validation
    const validation = validateForm();
    if (!validation.valid) {
      toast({
        title: 'Validation Failed',
        description: 'Please fix the errors in your form.',
        variant: 'destructive'
      });
      setCurrentStep(2);
      return;
    }

    const newRequests: AccessRequest[] = assets.map((asset) => ({
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assets: [asset],
      accessType,
      environment,
      requesterEid: profile.eid,
      requesterName: profile.name,
      requesterTitle: profile.title,
      requesterLob: profile.lob,
      fields: formValues,
      status: 'pending_manager',
      currentApprover: approverPath[0],
      approverPath,
      currentApproverIndex: 0,
      attachments: draft.attachments,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    submitRequests(newRequests);
    clearCart();
    setCurrentStep(4);
  };

  const handleClose = () => {
    if (currentStep === 4) {
      clearDraft();
    }
    onOpenChange(false);
  };

  const handleViewMyAccess = () => {
    clearDraft();
    onOpenChange(false);
    setTimeout(() => {
      navigate('/my-access');
    }, 100);
  };

  const toggleAssetExpanded = (assetId: string) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  // Render functions for each step
  const renderPrerequisitesStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="section-title">Prerequisites Checklist</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutofillAssumptions}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Complete prerequisites for me
          </Button>
        </div>
        <p className="help-text">
          Complete all required prerequisites before proceeding. You can verify your completed
          trainings automatically.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleVerifyAgain} className="gap-2">
          <Check className="h-4 w-4" />
          Verify Again
        </Button>
      </div>

      {/* Prerequisites by Asset */}
      <div className="space-y-4">
        {assets.map((asset) => {
          const assetPrereqs = prereqsByAsset[asset.id] || [];
          const isExpanded = expandedAssets.has(asset.id);
          const completedCount = assetPrereqs.filter((p) => isPrereqComplete(asset.id, p.id)).length;

          return (
            <div key={asset.id} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAssetExpanded(asset.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-foreground">{asset.name}</div>
                  <Badge variant={completedCount === assetPrereqs.length ? 'default' : 'secondary'}>
                    {completedCount}/{assetPrereqs.length} Complete
                  </Badge>
                </div>
                <ChevronRight
                  className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {assetPrereqs.map((prereq) => {
                    const isComplete = isPrereqComplete(asset.id, prereq.id);
                    const isAutoVerified = autoVerifiedPrereqs.has(prereq.id);
                    const prereqData = MASTER_PREREQUISITES.find((p) => p.id === prereq.id);

                    return (
                      <div
                        key={prereq.id}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-md border transition-colors',
                          isComplete
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-border bg-white'
                        )}
                      >
                        <div className="flex items-center gap-2 pt-0.5">
                          {isComplete ? (
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-foreground">
                              {prereq.label}
                            </span>
                            {isAutoVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Auto-verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{prereq.description}</p>

                          <div className="flex items-center gap-4 flex-wrap">
                            {prereq.link && (
                              <a
                                href={prereq.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                Complete requirement
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}

                            {prereqData?.allowUpload && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileUpload(prereq.id)}
                                className="h-7 px-2 text-xs gap-1"
                                disabled={uploadingFiles}
                              >
                                <Upload className="h-3 w-3" />
                                Upload
                              </Button>
                            )}

                            {!isAutoVerified && (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`${asset.id}-${prereq.id}`}
                                  checked={isComplete}
                                  onCheckedChange={() => togglePrereqComplete(asset.id, prereq.id)}
                                />
                                <label
                                  htmlFor={`${asset.id}-${prereq.id}`}
                                  className="text-xs text-muted-foreground cursor-pointer select-none"
                                >
                                  I have completed this
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {draft?.attachments && draft.attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Uploaded Files</h4>
          <div className="space-y-2">
            {draft.attachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {!canProceedFromPrerequisites() && accessType && (
        <div className="flex items-start gap-2 p-4 rounded-md bg-amber-50 border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Please complete all prerequisites across all assets to continue with your access
            request.
          </p>
        </div>
      )}

      {!accessType && (
        <div className="flex items-start gap-2 p-4 rounded-md bg-blue-50 border border-blue-200">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Select an access type in the Details step to see required prerequisites.
          </p>
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => {
    const hasErrors = Object.keys(errors).length > 0;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="section-title">Access Details</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAutofillAssumptions}
              className="gap-2 text-primary"
            >
              <Sparkles className="h-4 w-4" />
              Auto-fill with assumptions
            </Button>
          </div>
          <p className="help-text">
            Provide the required information for your access request. Fields marked with * are
            required. Assumed values can be edited.
          </p>
        </div>

        {hasErrors && (
          <div
            className="flex items-start gap-2 p-4 rounded-md bg-red-50 border border-red-200"
            role="alert"
            aria-live="assertive"
          >
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">
                Please fix the following errors:
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-0.5">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Access Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Access Type
            <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleAccessTypeChange('human')}
              className={cn(
                'p-4 rounded-md border-2 text-left transition-all',
                accessType === 'human'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white hover:border-gray-300'
              )}
            >
              <div className="font-semibold text-foreground mb-1">Human Access</div>
              <div className="text-sm text-muted-foreground">
                For personal use via EID/username
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAccessTypeChange('machine')}
              className={cn(
                'p-4 rounded-md border-2 text-left transition-all',
                accessType === 'machine'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white hover:border-gray-300'
              )}
            >
              <div className="font-semibold text-foreground mb-1">Machine (App) Access</div>
              <div className="text-sm text-muted-foreground">
                For applications and automated systems
              </div>
            </button>
          </div>
        </div>

        {accessType && (
          <>
            <Separator />

            {/* Dynamic Form Fields */}
            <div className="form-grid">
              {formFields.map((field) => {
                const isDisabled = field.id === 'eid' || field.id === 'title' || field.id === 'lob';

                return (
                  <div key={field.id} className="field">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>

                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        rows={4}
                        description={field.description}
                        aria-invalid={!!errors[field.id]}
                        className={errors[field.id] ? 'border-destructive' : ''}
                      />
                    ) : field.type === 'select' ? (
                      <>
                        <Select
                          value={formValues[field.id] || ''}
                          onValueChange={(value) => {
                            if (field.id === 'environment') {
                              handleEnvironmentChange(value);
                            } else {
                              handleFieldChange(field.id, value);
                            }
                          }}
                        >
                          <SelectTrigger
                            id={field.id}
                            className={errors[field.id] ? 'border-destructive' : ''}
                            aria-invalid={!!errors[field.id]}
                          >
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.description && (
                          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                        )}
                      </>
                    ) : field.type === 'tags' ? (
                      <>
                        <Textarea
                          id={field.id}
                          placeholder={field.placeholder}
                          value={
                            Array.isArray(formValues[field.id])
                              ? formValues[field.id].join(', ')
                              : formValues[field.id] || ''
                          }
                          onChange={(e) => {
                            const tags = parseTags(e.target.value);
                            handleFieldChange(field.id, tags);
                          }}
                          rows={3}
                          description={field.description}
                          aria-invalid={!!errors[field.id]}
                          className={errors[field.id] ? 'border-destructive' : ''}
                        />
                      </>
                    ) : field.type === 'number' ? (
                      <Input
                        id={field.id}
                        type="number"
                        placeholder={field.placeholder}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        rightAdornment={field.rightAdornment}
                        description={field.description}
                        aria-invalid={!!errors[field.id]}
                        className={errors[field.id] ? 'border-destructive' : ''}
                        disabled={isDisabled}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        description={field.description}
                        aria-invalid={!!errors[field.id]}
                        className={errors[field.id] ? 'border-destructive' : ''}
                        disabled={isDisabled}
                      />
                    )}

                    {errors[field.id] && (
                      <p className="text-sm text-destructive mt-1">{errors[field.id]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="section-title">Review &amp; Submit</h3>
        <p className="help-text">
          Please review your access request carefully before submitting.
        </p>
      </div>

      {/* Assets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Requesting Access To:</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditFromReview(1)}
            className="text-primary h-7"
          >
            Edit
          </Button>
        </div>
        <div className="space-y-2">
          {assets.map((asset) => (
            <div key={asset.id} className="p-3 rounded-md border bg-muted/30">
              <div className="font-medium text-foreground">{asset.name}</div>
              <div className="text-sm text-muted-foreground capitalize">{asset.type}</div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Access Type & Environment */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Access Configuration:</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditFromReview(2)}
            className="text-primary h-7"
          >
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Access Type:</span>
            <div className="font-medium text-foreground mt-1">
              {accessType === 'human' ? 'Human Access' : 'Machine (App) Access'}
            </div>
          </div>
          {environment && (
            <div>
              <span className="text-muted-foreground">Environment:</span>
              <div className="font-medium text-foreground mt-1 capitalize">
                {environment === 'prod'
                  ? 'Production'
                  : environment === 'stage'
                  ? 'Staging'
                  : 'Development'}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Prerequisites */}
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">Prerequisites Completed:</h4>
        <div className="space-y-1">
          {prerequisites.map((prereq) => (
            <div key={prereq.id} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-foreground">{prereq.label}</span>
            </div>
          ))}
        </div>
      </div>

      {draft?.attachments && draft.attachments.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Attachments:</h4>
            <div className="space-y-2">
              {draft.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Approver Path */}
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">Approval Path:</h4>
        <div className="flex items-center gap-2 flex-wrap">
          {approverPath.map((approver, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Badge variant={idx === 0 ? 'default' : 'outline'} className="font-normal">
                {approver}
              </Badge>
              {idx < approverPath.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Form Values */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Request Details:</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditFromReview(2)}
            className="text-primary h-7"
          >
            Edit
          </Button>
        </div>
        <div className="space-y-2">
          {formFields.map((field) => {
            let value = formValues[field.id];
            if (!value && value !== 0) return null;

            // Format value display
            let displayValue = value;
            if (field.type === 'select') {
              displayValue = field.options?.find((o) => o.value === value)?.label || value;
            } else if (field.type === 'tags' && Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (field.rightAdornment) {
              displayValue = `${value} ${field.rightAdornment}`;
            }

            return (
              <div key={field.id} className="grid grid-cols-3 gap-2 text-sm py-1">
                <div className="text-muted-foreground">{field.label}:</div>
                <div className="col-span-2 font-medium break-words text-foreground">
                  {displayValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">
          Request Submitted Successfully!
        </h3>
        <p className="text-muted-foreground max-w-md">
          Your access request has been submitted and is now being reviewed. You can track its
          progress in My Access.
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleViewMyAccess}>View in My Access</Button>
        <Button variant="outline" onClick={handleClose}>
          Request More Access
        </Button>
      </div>
    </div>
  );

  const renderContextPanel = () => {
    if (currentStep === 1) {
      return (
        <div className="context-panel">
          <h4 className="font-semibold text-foreground mb-2">About Prerequisites</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Prerequisites ensure you have the required training and approvals before accessing data
            assets. Use the auto-fill button to skip this section with assumed defaults.
          </p>

          {assets.length > 1 && (
            <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">
                You're requesting access to {assets.length} assets. Prerequisites are shown for each
                asset individually.
              </p>
            </div>
          )}

          {accessType && approverPath.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-foreground mb-2">Approval Path Preview:</h5>
              <div className="space-y-1">
                {approverPath.map((approver, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <span className="text-muted-foreground">{approver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Auto-verified items are checked automatically
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Click "Verify Again" to re-check your trainings
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Upload className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Upload documents for verification where needed
              </span>
            </div>
          </div>
        </div>
      );
    } else if (currentStep === 2) {
      return (
        <div className="context-panel">
          <h4 className="font-semibold text-foreground mb-2">Filling Out Your Request</h4>
          <p className="text-sm text-muted-foreground mb-4">
            The form adapts based on your selections. Production environment access requires
            additional security information. Click auto-fill to populate with reasonable defaults.
          </p>

          {approverPath.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-foreground mb-2">
                Your request will be reviewed by:
              </h5>
              <div className="space-y-1">
                {approverPath.map((approver, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <span className="text-muted-foreground">{approver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-md bg-gray-50 border">
            <h5 className="text-sm font-semibold text-foreground mb-2">Keyboard Shortcuts</h5>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                <kbd className="px-1.5 py-0.5 rounded bg-white border">Esc</kbd> Close modal
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 rounded bg-white border">⌘/Ctrl+S</kbd> Save draft
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 rounded bg-white border">Enter</kbd> Next step
              </div>
            </div>
          </div>
        </div>
      );
    } else if (currentStep === 3) {
      return (
        <div className="context-panel">
          <h4 className="font-semibold text-foreground mb-2">Review Your Request</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Please carefully review all information before submitting. Once submitted, your request
            will be routed to the appropriate approvers.
          </p>

          {approverPath.length > 0 && (
            <div className="mb-4 p-3 rounded-md bg-primary/5 border border-primary/20">
              <h5 className="text-sm font-semibold text-foreground mb-2">Next Step:</h5>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white">
                  1
                </div>
                <span className="text-foreground font-medium">{approverPath[0]} Review</span>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            You can click "Edit" next to any section to make changes before submitting.
          </p>
        </div>
      );
    }

    return null;
  };

  const steps: Step[] = [1, 2, 3, 4];
  const getStepStatus = (step: Step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Accessible Title and Description */}
        <DialogTitle className="sr-only">
          Request Data Access - {currentStepLabel}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Unified access request flow. Use the stepper to navigate through prerequisites, details,
          and review before submitting your request.
        </DialogDescription>

        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white z-10 border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">Request Data Access</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Draft status */}
              {currentStep < 4 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {draftSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : draftLastSaved ? (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Saved at {formatTime(draftLastSaved)}</span>
                    </>
                  ) : null}
                </div>
              )}

              <button
                onClick={handleClose}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>

          {/* Stepper */}
          {currentStep < 4 && (
            <div className="stepper-container">
              <div className="flex items-center gap-2 flex-wrap">
                {steps.slice(0, 3).map((step, idx) => {
                  const status = getStepStatus(step);
                  const isClickable = status === 'completed' || status === 'active';

                  return (
                    <div key={step} className="flex items-center gap-2">
                      {idx > 0 && <ChevronRight className="h-4 w-4 stepper-chevron" />}

                      <button
                        onClick={() => isClickable && handleStepClick(step)}
                        disabled={!isClickable}
                        aria-current={status === 'active' ? 'step' : undefined}
                        aria-disabled={!isClickable}
                        className={cn(
                          'stepper-stage',
                          status === 'active' && 'stepper-stage-active',
                          status === 'completed' && 'stepper-stage-completed cursor-pointer',
                          status === 'inactive' && 'stepper-stage-inactive'
                        )}
                      >
                        <div
                          className={cn(
                            'stepper-badge',
                            status === 'active' && 'bg-white text-foreground border-2 border-primary',
                            status === 'completed' && 'bg-primary text-white',
                            status === 'inactive' && 'bg-gray-300 text-gray-600'
                          )}
                        >
                          {status === 'completed' ? <Check className="h-3 w-3" /> : step}
                        </div>
                        <span>{STEP_CONFIG[step].label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div
          ref={contentRef}
          className="dialog-scroll-area flex-1 overflow-y-auto px-6 py-4 min-h-0"
          tabIndex={0}
          role="region"
          aria-label="Modal content"
        >
          {currentStep === 4 ? (
            renderConfirmationStep()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main content - 8 columns */}
              <div className="md:col-span-8 space-y-6">
                {currentStep === 1 && renderPrerequisitesStep()}
                {currentStep === 2 && renderDetailsStep()}
                {currentStep === 3 && renderReviewStep()}
              </div>

              {/* Context help panel - 4 columns */}
              <div className="md:col-span-4">{renderContextPanel()}</div>
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        {currentStep < 4 && (
          <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveDraft()}
                className="gap-2"
                disabled={draftSaving}
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedFromPrerequisites()) ||
                    (currentStep === 2 && !accessType)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>Submit Request</Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
