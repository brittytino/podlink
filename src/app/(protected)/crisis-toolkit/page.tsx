'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Crisis Toolkit
        </h1>
        <p className="text-muted-foreground">
          Your personal strategies to overcome difficult moments
        </p>
      </div>

      <AddToolkitForm onSuccess={fetchItems} />

      {items.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Strategies Yet</h3>
          <p className="text-muted-foreground">
            Add your first crisis management strategy above
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ToolkitItem
              key={item.id}
              item={item}
              onEdit={(id) => {
                // Edit functionality can be added later
                toast({
                  title: 'Coming Soon',
                  description: 'Edit functionality will be added',
                });
              }}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

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
