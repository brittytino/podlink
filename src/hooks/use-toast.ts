'use client';

import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive' | 'success';
    }) => {
      const { title, description, variant } = props;
      
      if (variant === 'destructive') {
        sonnerToast.error(title || description || 'An error occurred');
      } else if (variant === 'success') {
        sonnerToast.success(title || description || 'Success');
      } else {
        sonnerToast(title || description || 'Notification');
      }
    },
  };
}


