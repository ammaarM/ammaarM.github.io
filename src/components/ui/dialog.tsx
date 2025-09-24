import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogPortal: React.FC<DialogPrimitive.DialogPortalProps> = ({ children, ...props }) => (
  <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>
);

export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out', className)}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <AnimatePresence>
        <DialogOverlay />
        <DialogPrimitive.Content asChild forceMount {...props}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-x-0 top-24 z-50 mx-auto w-full max-w-2xl rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-xl',
              className
            )}
          >
            {children}
          </motion.div>
        </DialogPrimitive.Content>
      </AnimatePresence>
    </DialogPortal>
  )
);
DialogContent.displayName = 'DialogContent';

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
