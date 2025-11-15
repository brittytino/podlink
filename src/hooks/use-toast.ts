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
      
      // Sonner API: toast(message, { description: "..." })
      // Use title as main message, description as additional info
      const message = title || description || 'Notification';
      const toastOptions: { 
        description?: string; 
        duration: number;
        className?: string;
        style?: any;
      } = {
        duration: variant === 'destructive' ? 5000 : 4000,
        className: 'toast-custom',
        style: {
          color: '#000000',
          fontWeight: '500',
        }
      };
      
      // If both title and description exist, use title as message and description as description
      // If only one exists, use it as the message
      if (title && description) {
        toastOptions.description = description;
      }
      
      if (variant === 'destructive') {
        sonnerToast.error(message, {
          ...toastOptions,
          className: 'toast-destructive',
          style: {
            color: '#000000',
            backgroundColor: '#fef2f2',
            borderColor: '#ef4444',
            fontWeight: '500',
          }
        });
      } else if (variant === 'success') {
        sonnerToast.success(message, {
          ...toastOptions,
          className: 'toast-success',
          style: {
            color: '#000000',
            backgroundColor: '#f0fdf4',
            borderColor: '#22c55e',
            fontWeight: '500',
          }
        });
      } else {
        sonnerToast(message, {
          ...toastOptions,
          className: 'toast-default',
          style: {
            color: '#000000',
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            fontWeight: '500',
          }
        });
      }
    },
  };
}


