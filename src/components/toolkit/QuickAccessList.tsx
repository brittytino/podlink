'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface QuickAccessItem {
  id: string;
  title: string;
}

interface QuickAccessListProps {
  items: QuickAccessItem[];
}

export function QuickAccessList({ items }: QuickAccessListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4 text-yellow-500" />
          Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.slice(0, 5).map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
            >
              {item.title}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
