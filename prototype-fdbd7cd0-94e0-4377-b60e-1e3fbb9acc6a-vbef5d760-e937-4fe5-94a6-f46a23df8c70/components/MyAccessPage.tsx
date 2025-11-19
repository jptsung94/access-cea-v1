import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAccessStore } from './AccessStore';
import { StatusBadge } from './StatusBadge';
import { formatDateShort } from '@/lib/utils';
import { AccessRequest } from '@/types/access';

export function MyAccessPage() {
  const { requests, approvalQueue, nudgeRequest, canNudge, approveRequest, denyRequest } =
  useAccessStore();
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [denialReason, setDenialReason] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleNudge = (requestId: string) => {
    if (canNudge(requestId)) {
      const success = nudgeRequest(requestId);
      if (success) {
        showToast('Reminder sent to approver');
      }
    } else {
      showToast('Please wait 24 hours between nudges');
    }
  };

  const handleApprove = (requestId: string) => {
    approveRequest({
      requestId,
      action: 'approve',
      approverEid: 'E123456'
    });
    showToast('Request approved successfully');
  };

  const handleDenyClick = (request: AccessRequest) => {
    setSelectedRequest(request);
    setDenyDialogOpen(true);
  };

  const handleDenyConfirm = () => {
    if (selectedRequest && denialReason.trim()) {
      denyRequest({
        requestId: selectedRequest.id,
        action: 'deny',
        reason: denialReason,
        approverEid: 'E123456'
      });
      setDenyDialogOpen(false);
      setDenialReason('');
      setSelectedRequest(null);
      showToast('Request denied');
    }
  };

  return (
    <div data-node-id="div_cda4eba5" className="page-shell">
      <div data-node-id="div_5ae1545b" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div data-node-id="div_fd723f2e" className="mb-8">
          <h1 data-node-id="h1_f2127387" className="text-3xl font-semibold text-primary mb-2"><span data-node-id="span_f36db797" data-text-id="myaccess_87025dc0" data-editable="jsx-text" className="protoforge-editable-text">My Access</span></h1>
          <p data-node-id="p_d7f9a1c4" className="text-muted-foreground"><span data-node-id="span_4a1be7b0" data-text-id="manageyourac_472f1bda" data-editable="jsx-text" className="protoforge-editable-text">Manage your access requests and approvals</span>

          </p>
        </div>

        {/* Notification Banner */}
        <Card data-node-id="card_af614b51" className="mb-6 bg-muted/30 border-border">
          <CardContent data-node-id="cardcontent_6340846f" className="flex items-start gap-3 pt-6">
            <Bell data-node-id="bell_63b1b4ec" className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div data-node-id="div_b4112ddf">
              <div data-node-id="div_ab86aa9a" className="font-medium text-foreground"><span data-node-id="span_b85cf883" data-text-id="centralizedn_67d742c4" data-editable="jsx-text" className="protoforge-editable-text">Centralized Notifications</span></div>
              <div data-node-id="div_30e82152" className="text-sm text-muted-foreground"><span data-node-id="span_8ed14f67" data-text-id="allaccessreq_43bcfd23" data-editable="jsx-text" className="protoforge-editable-text">All access request notifications and updates will appear here. You'll also
                receive email notifications for status changes.</span>

              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs data-node-id="tabs_b4338bc2" defaultValue="my-requests" className="space-y-6">
          <TabsList data-node-id="tabslist_28d00cbf" className="grid w-full max-w-md grid-cols-2 bg-muted/50 p-1">
            <TabsTrigger data-node-id="tabstrigger_aa9de7e3" value="my-requests" className="data-[state=active]:bg-white"><span data-node-id="span_57b8b643" data-text-id="myrequests_50004d54" data-editable="jsx-text" className="protoforge-editable-text">My Requests</span>

              {requests.length > 0 &&
              <Badge data-node-id="badge_433c4d14" variant="secondary" className="ml-2">
                  <span data-node-id="span_1c6be7df" data-text-id="requestsleng_3dcbac81" data-editable="prop-path" data-prop-path="requests.length" className="protoforge-editable-text">{requests.length}</span>
                </Badge>
              }
            </TabsTrigger>
            <TabsTrigger data-node-id="tabstrigger_c5a9ac7d" value="pending-approval" className="data-[state=active]:bg-white"><span data-node-id="span_c45568a9" data-text-id="pendingmyapp_84a4051a" data-editable="jsx-text" className="protoforge-editable-text">Pending My Approval</span>

              {approvalQueue.length > 0 &&
              <Badge data-node-id="badge_2d9302c8" variant="secondary" className="ml-2">
                  <span data-node-id="span_7a6c45b5" data-text-id="approvalqueu_22f4e179" data-editable="prop-path" data-prop-path="approvalQueue.length" className="protoforge-editable-text">{approvalQueue.length}</span>
                </Badge>
              }
            </TabsTrigger>
          </TabsList>

          {/* My Requests Tab */}
          <TabsContent data-node-id="tabscontent_4e2bd02a" value="my-requests" className="space-y-4">
            {requests.length === 0 ?
            <Card data-node-id="card_ad39b221">
                <CardContent data-node-id="cardcontent_652e7d4b" className="flex flex-col items-center justify-center py-12">
                  <Clock data-node-id="clock_fc3917a4" className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 data-node-id="h3_cd706b00" className="text-lg font-semibold mb-2 text-foreground"><span data-node-id="span_e6ee8e6f" data-text-id="norequestsye_65fd6f2b" data-editable="jsx-text" className="protoforge-editable-text">No requests yet</span></h3>
                  <p data-node-id="p_97272c9e" className="text-sm text-muted-foreground text-center max-w-md"><span data-node-id="span_385faca2" data-text-id="youhaventsub_bdc40b45" data-editable="jsx-text" className="protoforge-editable-text">You haven't submitted any access requests. Browse assets and click
                    "Request Access" to get started.</span>

                </p>
                </CardContent>
              </Card> :

            <Card data-node-id="card_93d623e9">
                <CardHeader data-node-id="cardheader_32e42abf">
                  <CardTitle data-node-id="cardtitle_4129cd95"><span data-node-id="span_c0dc76cd" data-text-id="accessreques_bf212a2c" data-editable="jsx-text" className="protoforge-editable-text">Access Requests</span></CardTitle>
                  <CardDescription data-node-id="carddescription_2324a98d"><span data-node-id="span_e41edb25" data-text-id="trackthestat_33fcc741" data-editable="jsx-text" className="protoforge-editable-text">Track the status of your submitted access requests</span>

                </CardDescription>
                </CardHeader>
                <CardContent data-node-id="cardcontent_44986679">
                  <div data-node-id="div_3a70e22f" className="space-y-3">
                    {requests.map((request, index) =>
                  <div data-node-id="div_179c9342" key={request.id}>
                        {index > 0 && <Separator data-node-id="separator_9dd6f90e" className="my-3" />}
                        <div data-node-id="div_cfc260f0" className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                          <div data-node-id="div_2231a231" className="space-y-2 flex-1">
                            <div data-node-id="div_393b4f10" className="flex flex-wrap items-center gap-2">
                              <h4 data-node-id="h4_12f83ad6" className="font-semibold text-foreground">
                                {request.assets.map((a) => a.name).join(', ')}
                              </h4>
                              <Badge data-node-id="badge_356c740f" variant="outline" className="text-xs">
                                {request.accessType === 'human' ? 'Human' : 'Machine'}
                              </Badge>
                            </div>

                            <div data-node-id="div_115d2d0a" className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div data-node-id="div_5743bfd0" className="flex items-center gap-1">
                                <StatusBadge data-node-id="statusbadge_422070cc" status={request.status} />
                              </div>
                              {request.currentApprover &&
                          <div data-node-id="div_85da66e2"><span data-node-id="span_aa68b8db" data-text-id="current_dd9e1311" data-editable="jsx-text" className="protoforge-editable-text">Current:</span>
                            <span data-node-id="span_0db7a319" className="font-medium"><span data-node-id="span_4a1f1bf0" data-text-id="requestcurre_6b985f06" data-editable="prop-path" data-prop-path="request.currentApprover" className="protoforge-editable-text">{request.currentApprover}</span></span>
                                </div>
                          }
                              <div data-node-id="div_2353ca3b">{formatDateShort(request.createdAt)}</div>
                            </div>

                            {request.denialReason &&
                        <div data-node-id="div_61eb68c1" className="mt-2 p-2 rounded-md bg-red-50 border border-red-200">
                                <p data-node-id="p_ec0fd571" className="text-sm text-red-700">
                                  <span data-node-id="span_4e1f5395" className="font-medium"><span data-node-id="span_81c6dea2" data-text-id="reason_10c66c5e" data-editable="jsx-text" className="protoforge-editable-text">Reason:</span></span>
                                  <span data-node-id="span_2167a5b1" data-text-id="requestdenia_f8c03494" data-editable="prop-path" data-prop-path="request.denialReason" className="protoforge-editable-text">{request.denialReason}</span>
                                </p>
                              </div>
                        }
                          </div>

                          <div data-node-id="div_7c7efbb0" className="flex items-center gap-2">
                            {request.status !== 'approved' &&
                        request.status !== 'denied' &&
                        <Button data-node-id="button_a6f531a0"
                        variant="outline"
                        size="sm"
                        onClick={() => handleNudge(request.id)}
                        disabled={!canNudge(request.id)}>

                                  <Send data-node-id="send_a2d6f2ce" className="h-4 w-4 mr-2" /><span data-node-id="span_9daeb398" data-text-id="sendreminder_72176672" data-editable="jsx-text" className="protoforge-editable-text">Send Reminder</span>

                        </Button>
                        }
                          </div>
                        </div>
                      </div>
                  )}
                  </div>
                </CardContent>
              </Card>
            }
          </TabsContent>

          {/* Pending Approval Tab */}
          <TabsContent data-node-id="tabscontent_01a7902f" value="pending-approval" className="space-y-4">
            {approvalQueue.length === 0 ?
            <Card data-node-id="card_b4e367b1">
                <CardContent data-node-id="cardcontent_909d40e3" className="flex flex-col items-center justify-center py-12">
                  <CheckCircle data-node-id="checkcircle_d61688c2" className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 data-node-id="h3_4eba21ac" className="text-lg font-semibold mb-2 text-foreground"><span data-node-id="span_85529733" data-text-id="allcaughtup_e281bc0b" data-editable="jsx-text" className="protoforge-editable-text">All caught up!</span></h3>
                  <p data-node-id="p_94edbade" className="text-sm text-muted-foreground text-center max-w-md"><span data-node-id="span_367f4c55" data-text-id="youdonthavea_ab8dbe5b" data-editable="jsx-text" className="protoforge-editable-text">You don't have any pending access requests to review.</span>

                </p>
                </CardContent>
              </Card> :

            <Card data-node-id="card_4dba9877">
                <CardHeader data-node-id="cardheader_18bca1e1">
                  <CardTitle data-node-id="cardtitle_1086e491"><span data-node-id="span_601b1cd7" data-text-id="requestsawai_96822001" data-editable="jsx-text" className="protoforge-editable-text">Requests Awaiting Your Approval</span></CardTitle>
                  <CardDescription data-node-id="carddescription_1ca0090e"><span data-node-id="span_f122effe" data-text-id="reviewandapp_e8512bd7" data-editable="jsx-text" className="protoforge-editable-text">Review and approve or deny access requests</span>

                </CardDescription>
                </CardHeader>
                <CardContent data-node-id="cardcontent_831f0907">
                  <div data-node-id="div_5558a9dd" className="space-y-4">
                    {approvalQueue.map((request, index) =>
                  <div data-node-id="div_9b5948bf" key={request.id}>
                        {index > 0 && <Separator data-node-id="separator_008c9861" className="my-4" />}
                        <div data-node-id="div_f2eac2f7" className="py-2 space-y-4">
                          <div data-node-id="div_6a33ce79" className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div data-node-id="div_1fc4f74f" className="space-y-2 flex-1">
                              <div data-node-id="div_c581a1ff" className="flex flex-wrap items-center gap-2">
                                <h4 data-node-id="h4_9a9d74a4" className="font-semibold text-foreground">
                                  {request.assets.map((a) => a.name).join(', ')}
                                </h4>
                                <Badge data-node-id="badge_8bcd85eb" variant="outline" className="text-xs">
                                  {request.accessType === 'human' ? 'Human' : 'Machine'}
                                </Badge>
                              </div>

                              <div data-node-id="div_fd6c8dd2" className="text-sm space-y-1">
                                <div data-node-id="div_92e90e3f">
                                  <span data-node-id="span_0de3e789" className="text-muted-foreground"><span data-node-id="span_b1f79086" data-text-id="requester_7344e393" data-editable="jsx-text" className="protoforge-editable-text">Requester:</span></span>
                                  <span data-node-id="span_4c07c025" className="font-medium text-foreground">
                                    <span data-node-id="span_5355bd84" data-text-id="requestreque_105a78e0" data-editable="prop-path" data-prop-path="request.requesterName" className="protoforge-editable-text">{request.requesterName}</span> (<span data-node-id="span_9f993d00" data-text-id="requestreque_fa7f053e" data-editable="prop-path" data-prop-path="request.requesterEid" className="protoforge-editable-text">{request.requesterEid}</span>)
                                  </span>
                                </div>
                                <div data-node-id="div_621119b8">
                                  <span data-node-id="span_01e383c8" className="text-muted-foreground"><span data-node-id="span_46182f9d" data-text-id="title_6966b448" data-editable="jsx-text" className="protoforge-editable-text">Title:</span></span>
                                  <span data-node-id="span_e58e2616" className="text-foreground"><span data-node-id="span_3946f467" data-text-id="requestreque_994f080d" data-editable="prop-path" data-prop-path="request.requesterTitle" className="protoforge-editable-text">{request.requesterTitle}</span></span>
                                </div>
                                <div data-node-id="div_899cfa12">
                                  <span data-node-id="span_3236a4fb" className="text-muted-foreground"><span data-node-id="span_ba83659d" data-text-id="lob_afce7961" data-editable="jsx-text" className="protoforge-editable-text">LOB:</span></span>
                                  <span data-node-id="span_0af9b761" className="text-foreground"><span data-node-id="span_b5c125cc" data-text-id="requestreque_58b97996" data-editable="prop-path" data-prop-path="request.requesterLob" className="protoforge-editable-text">{request.requesterLob}</span></span>
                                </div>
                                <div data-node-id="div_79e17b7c">
                                  <span data-node-id="span_90369d26" className="text-muted-foreground"><span data-node-id="span_a9984bc1" data-text-id="requested_d53d6752" data-editable="jsx-text" className="protoforge-editable-text">Requested:</span></span>
                                  <span data-node-id="span_9547e301" className="text-foreground">{formatDateShort(request.createdAt)}</span>
                                </div>
                              </div>

                              {request.fields.businessJustification &&
                          <div data-node-id="div_94ddb5f3" className="mt-3 p-3 rounded-md bg-muted/50 border border-border">
                                  <div data-node-id="div_3230757b" className="text-sm font-medium mb-1 text-foreground"><span data-node-id="span_363433c9" data-text-id="businessjust_7efca383" data-editable="jsx-text" className="protoforge-editable-text">Business Justification:</span>

                            </div>
                                  <p data-node-id="p_88409f57" className="text-sm text-muted-foreground">
                                    <span data-node-id="span_21283ad0" data-text-id="requestfield_613cb4c5" data-editable="prop-path" data-prop-path="request.fields.businessJustification" className="protoforge-editable-text">{request.fields.businessJustification}</span>
                                  </p>
                                </div>
                          }
                            </div>
                          </div>

                          <div data-node-id="div_f467460a" className="flex items-center gap-2 pt-2 border-t border-border">
                            <Button data-node-id="button_e6d3850d"
                        onClick={() => handleApprove(request.id)}>

                              <CheckCircle data-node-id="checkcircle_036ec137" className="h-4 w-4 mr-2" /><span data-node-id="span_64bbe48d" data-text-id="approve_7a0da28c" data-editable="jsx-text" className="protoforge-editable-text">Approve</span>

                        </Button>
                            <Button data-node-id="button_a201ebaf"
                        variant="destructive"
                        onClick={() => handleDenyClick(request)}>

                              <XCircle data-node-id="xcircle_b136855d" className="h-4 w-4 mr-2" /><span data-node-id="span_80ca5ad3" data-text-id="deny_1275f78c" data-editable="jsx-text" className="protoforge-editable-text">Deny</span>

                        </Button>
                          </div>
                        </div>
                      </div>
                  )}
                  </div>
                </CardContent>
              </Card>
            }
          </TabsContent>
        </Tabs>
      </div>

      {/* Deny Dialog */}
      <Dialog data-node-id="dialog_5e5b8cbe" open={denyDialogOpen} onOpenChange={setDenyDialogOpen}>
        <DialogContent data-node-id="dialogcontent_141f68ee">
          <DialogHeader data-node-id="dialogheader_3421b49d">
            <DialogTitle data-node-id="dialogtitle_1935ac98"><span data-node-id="span_6132ae7d" data-text-id="denyaccessre_1673a277" data-editable="jsx-text" className="protoforge-editable-text">Deny Access Request</span></DialogTitle>
            <DialogDescription data-node-id="dialogdescription_1d50d8fa"><span data-node-id="span_6baec0da" data-text-id="pleaseprovid_f43efb6a" data-editable="jsx-text" className="protoforge-editable-text">Please provide a reason for denying this access request. This will be shared
              with the requester.</span>

            </DialogDescription>
          </DialogHeader>

          <div data-node-id="div_3149d894" className="space-y-4 py-4">
            <div data-node-id="div_17dd7e4b" className="space-y-2">
              <Label data-node-id="label_022c5bed" htmlFor="denial-reason"><span data-node-id="span_1ec5b5e3" data-text-id="denialreason_753a9336" data-editable="jsx-text" className="protoforge-editable-text">Denial Reason *</span></Label>
              <Textarea data-node-id="textarea_denialreason_0c9776"
              id="denial-reason"
              placeholder="Explain why this request is being denied..."
              value={denialReason}
              onChange={(e) => setDenialReason(e.target.value)}
              rows={4} />

            </div>
          </div>

          <DialogFooter data-node-id="dialogfooter_ae73427e">
            <Button data-node-id="button_419cb953" variant="outline" onClick={() => setDenyDialogOpen(false)}><span data-node-id="span_a53bc730" data-text-id="cancel_a33b5470" data-editable="jsx-text" className="protoforge-editable-text">Cancel</span>

            </Button>
            <Button data-node-id="button_c273228b"
            variant="destructive"
            onClick={handleDenyConfirm}
            disabled={!denialReason.trim()}><span data-node-id="span_5fce6d9f" data-text-id="confirmdenia_8a3b8e5d" data-editable="jsx-text" className="protoforge-editable-text">Confirm Denial</span>


            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      {toastMessage &&
      <div data-node-id="div_7b456269" className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-3 rounded-md shadow-lg animate-in slide-in-from-bottom-2 z-50">
          <span data-node-id="span_abdae6a9" data-text-id="toastmessage_14bf6bda" data-editable="variable" data-variable-name="toastMessage" className="protoforge-editable-text">{toastMessage}</span>
        </div>
      }
    </div>);

}