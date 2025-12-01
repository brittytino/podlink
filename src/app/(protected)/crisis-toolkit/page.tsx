'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ToolkitItem } from '@/components/toolkit/ToolkitItem';
import { AddToolkitForm } from '@/components/toolkit/AddToolkitForm';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ToolkitItemType {
  id: string;
  title: string;
  description: string;
  orderPosition: number;
}

export default function CrisisToolkitPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<ToolkitItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/toolkit/list?userId=${session.user.id}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load toolkit items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [session?.user?.id]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/toolkit/delete?id=${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Deleted',
          description: 'Strategy removed from toolkit',
        });
        fetchItems();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 top-[56px] sm:top-[64px] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-3"
        >
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-emerald-600" />
          <p className="text-sm text-slate-600 font-medium">Loading toolkit...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[56px] sm:top-[64px] flex bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 px-6 lg:px-10 xl:px-12 py-6 lg:py-7 bg-white/80 backdrop-blur-sm border-b border-slate-200/80 shadow-sm"
        >
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              <Shield className="h-7 w-7 sm:h-9 sm:w-9 text-emerald-600" />
              Crisis Toolkit
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your personal strategies to overcome difficult moments and stay on track
            </p>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 lg:px-10 xl:px-12 py-6 lg:py-8">
            <div className="max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
              {/* Add Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <AddToolkitForm onSuccess={fetchItems} />
              </motion.div>

              {/* Toolkit Items or Empty State */}
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-center py-16 lg:py-24 border-2 border-dashed rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-500 w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                  >
                    <Shield className="h-12 w-12 lg:h-14 lg:w-14 text-white" />
                  </motion.div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    No Strategies Yet
                  </h3>
                  <p className="text-muted-foreground text-sm lg:text-base max-w-md mx-auto leading-relaxed">
                    Add your first crisis management strategy above to build your personal toolkit and prepare for challenging moments
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-4"
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="transform transition-all duration-200"
                    >
                      <ToolkitItem
                        item={item}
                        onEdit={(id) => {
                          toast({
                            title: 'Coming Soon',
                            description: 'Edit functionality will be added',
                          });
                        }}
                        onDelete={(id) => setDeleteId(id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Strategy?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this strategy
              from your toolkit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
