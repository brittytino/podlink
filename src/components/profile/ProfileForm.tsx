'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormProps {
  user: {
    fullName: string;
    username: string;
    email: string;
    goalDescription: string;
    timezone: string;
    availabilityHours: { start: string; end: string };
    gender?: string | null;
  };
  onUpdateSuccess: () => void;
}

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export function ProfileForm({ user, onUpdateSuccess }: ProfileFormProps) {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Profile Updated',
          description: 'Your changes have been saved',
        });
        onUpdateSuccess();
      }
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm sm:text-base font-medium">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          className="h-11 sm:h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm sm:text-base font-medium">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          className="h-11 sm:h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email</Label>
        <Input id="email" value={formData.email} disabled className="h-11 sm:h-12 text-base" />
        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal" className="text-sm sm:text-base font-medium">Goal Description</Label>
        <Textarea
          id="goal"
          value={formData.goalDescription}
          onChange={(e) => setFormData({ ...formData, goalDescription: e.target.value })}
          rows={3}
          className="text-sm sm:text-base resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone" className="text-sm sm:text-base font-medium">Timezone</Label>
        <Select
          value={formData.timezone}
          onValueChange={(value) => setFormData({ ...formData, timezone: value })}
        >
          <SelectTrigger className="h-11 sm:h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value} className="text-sm sm:text-base">
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 sm:h-12 text-base font-semibold">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
}
