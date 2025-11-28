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
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          <Label className="text-base sm:text-lg font-bold text-foreground">
            When are you most active?
          </Label>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Select the hours when you're typically awake and available to support your pod members.
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 max-w-2xl">
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="start" className="text-sm sm:text-base font-semibold text-foreground">
            Start Time
          </Label>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger id="start" className="h-11 sm:h-12 text-sm sm:text-base border-2 rounded-xl focus:border-primary">
              <SelectValue placeholder="Select start" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour.value} value={hour.value} className="text-sm sm:text-base">
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="end" className="text-sm sm:text-base font-semibold text-foreground">
            End Time
          </Label>
          <Select value={endTime} onValueChange={onEndTimeChange}>
            <SelectTrigger id="end" className="h-11 sm:h-12 text-sm sm:text-base border-2 rounded-xl focus:border-primary">
              <SelectValue placeholder="Select end" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour.value} value={hour.value} className="text-sm sm:text-base">
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Time Summary */}
      {startTime && endTime && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 sm:p-5 bg-primary/5 rounded-xl border border-primary/20 max-w-2xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-primary mb-1">
                  Your Active Hours
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Available from{' '}
                  <span className="font-semibold text-foreground">
                    {hours.find(h => h.value === startTime)?.label}
                  </span>
                  {' '}to{' '}
                  <span className="font-semibold text-foreground">
                    {hours.find(h => h.value === endTime)?.label}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
