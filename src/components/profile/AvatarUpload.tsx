'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, Shuffle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AvatarUploadProps {
  currentAvatar: string | null;
  userName: string;
  onUploadSuccess: (url: string) => void;
}

export function AvatarUpload({ currentAvatar, userName, onUploadSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatar);
  const [gender, setGender] = useState<'boy' | 'girl' | 'random'>('random');
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchAvatarFromAPI = async (genderType: 'boy' | 'girl' | 'random') => {
    setLoadingAvatar(true);
    try {
      let apiUrl = '';
      if (genderType === 'random') {
        // Randomly choose boy or girl
        apiUrl = Math.random() > 0.5 
          ? 'https://avatar.iran.liara.run/public/boy'
          : 'https://avatar.iran.liara.run/public/girl';
      } else {
        apiUrl = genderType === 'boy'
          ? 'https://avatar.iran.liara.run/public/boy'
          : 'https://avatar.iran.liara.run/public/girl';
      }

      // Fetch avatar from API
      const response = await fetch('/api/profile/fetch-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: apiUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreview(data.url);
        onUploadSuccess(data.url);
        toast({
          title: 'Success!',
          description: 'Avatar updated',
        });
      } else {
        throw new Error('Failed to fetch avatar');
      }
    } catch (error) {
      toast({
        title: 'Failed to fetch avatar',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleGenderChange = (value: string) => {
    const newGender = value as 'boy' | 'girl' | 'random';
    setGender(newGender);
    fetchAvatarFromAPI(newGender);
  };

  const handleRandomize = () => {
    fetchAvatarFromAPI('random');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUploadSuccess(data.url);
        toast({
          title: 'Success!',
          description: 'Profile picture updated',
        });
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Label className="text-base font-semibold">Profile Picture</Label>
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={preview || ''} alt={userName} />
          <AvatarFallback className="text-4xl">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loadingAvatar}
        >
          {uploading || loadingAvatar ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm">Choose Avatar Gender</Label>
        </div>
        <div className="flex gap-2">
          <Select value={gender} onValueChange={handleGenderChange} disabled={loadingAvatar}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random</SelectItem>
              <SelectItem value="boy">Boy</SelectItem>
              <SelectItem value="girl">Girl</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRandomize}
            disabled={loadingAvatar}
            title="Randomize avatar"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-xs text-muted-foreground text-center">
        Click the camera icon to upload your own photo (max 5MB)
      </p>
    </div>
  );
}
