import { Badge } from '@/components/ui/badge';
import { getStatusBadgeColor } from '@/lib/utils';
import { RequestStatus } from '@/types/access';

interface StatusBadgeProps {
  status: RequestStatus;
}

function getStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    pending_manager: 'Pending Manager',
    pending_data_owner: 'Pending Data Owner',
    pending_security: 'Pending Security',
    approved: 'Approved',
    denied: 'Denied',
    in_progress: 'In Progress'
  };
  return labels[status] || status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge data-node-id="badge_259f1679" variant={getStatusBadgeColor(status)}>
      {getStatusLabel(status)}
    </Badge>);

}