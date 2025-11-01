'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}` };
});

interface AvailabilityPickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export function AvailabilityPicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: AvailabilityPickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <Label className="text-lg font-semibold">When are you most active?</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        Select the hours when you're typically awake and available to support your pod members.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start" className="text-sm font-medium mb-2 block">
            Start Time
          </Label>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger id="start">
              <SelectValue placeholder="Select start" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour.value} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="end" className="text-sm font-medium mb-2 block">
            End Time
          </Label>
          <Select value={endTime} onValueChange={onEndTimeChange}>
            <SelectTrigger id="end">
              <SelectValue placeholder="Select end" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour.value} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
