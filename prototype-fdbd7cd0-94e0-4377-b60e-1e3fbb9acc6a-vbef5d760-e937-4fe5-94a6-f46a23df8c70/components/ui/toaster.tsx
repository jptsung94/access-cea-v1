import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div data-node-id="div_1c43d7df" className="fixed bottom-0 right-0 z-50 p-4 pointer-events-none">
      <div data-node-id="div_0d1267b6" className="flex flex-col gap-2 items-end">
        {toasts.map((toast) =>
        <div data-node-id="div_96ffe0d7"
        key={toast.id}
        className={cn(
          'pointer-events-auto flex items-start gap-3 rounded-md border p-4 shadow-lg transition-all animate-in slide-in-from-right-full',
          toast.variant === 'destructive' ?
          'bg-red-50 border-red-200' :
          'bg-white border-border'
        )}
        style={{ minWidth: '300px', maxWidth: '400px' }}>

            {toast.variant === 'destructive' ?
          <AlertCircle data-node-id="alertcircle_aeb7adae" className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" /> :

          <CheckCircle2 data-node-id="checkcircle2_ff268e2d" className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          }
            <div data-node-id="div_6c362a7b" className="flex-1">
              <div data-node-id="div_51bbafb1"
            className={cn(
              'font-semibold text-sm',
              toast.variant === 'destructive' ? 'text-red-900' : 'text-foreground'
            )}>

                <span data-node-id="span_47088f51" data-text-id="toasttitle_90a7072b" data-editable="prop-path" data-prop-path="toast.title" className="protoforge-editable-text">{toast.title}</span>
              </div>
              {toast.description &&
            <div data-node-id="div_c4ee2940"
            className={cn(
              'text-sm mt-1',
              toast.variant === 'destructive' ? 'text-red-700' : 'text-muted-foreground'
            )}>

                  <span data-node-id="span_811d1c91" data-text-id="toastdescrip_57b02597" data-editable="prop-path" data-prop-path="toast.description" className="protoforge-editable-text">{toast.description}</span>
                </div>
            }
            </div>
            <button data-node-id="button_c57bc1a9"
          onClick={() => dismiss(toast.id)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">

              <X data-node-id="x_912989e2" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>);

}