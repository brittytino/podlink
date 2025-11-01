'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';

interface ToolkitItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    orderPosition: number;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ToolkitItem({ item, onEdit, onDelete }: ToolkitItemProps) {
  return (
    <Card className="group hover:border-primary transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(item.id)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
