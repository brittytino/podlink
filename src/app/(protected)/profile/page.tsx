'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Badge } from '@/components/ui/badge';
import { User, Loader2, Flame, Calendar, Target } from 'lucide-react';

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  goalDescription: string;
  goalType: string;
  timezone: string;
  availabilityHours: { start: string; end: string };
  currentStreak: number;
  avatarUrl: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/profile?userId=${session.user.id}`);
      const data = await response.json();
      setProfile(data.user);
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use session data initially
    if (session?.user) {
      setProfile({
        fullName: session.user.name || '',
        username: session.user.username || '',
        email: session.user.email || '',
        goalDescription: '',
        goalType: 'BUILD_HABIT',
        timezone: 'Asia/Kolkata',
        availabilityHours: { start: '09:00', end: '22:00' },
        currentStreak: 0,
        avatarUrl: session.user.image || null,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [session?.user]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{profile.currentStreak}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg font-bold">{memberSince}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goal Type</p>
                <Badge variant="secondary" className="mt-1">
                  {profile.goalType === 'BUILD_HABIT' ? 'Build' : 'Quit'}
                </Badge>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatar={profile.avatarUrl}
            userName={profile.fullName}
            onUploadSuccess={(url) => {
              setProfile({ ...profile, avatarUrl: url });
              update({ image: url });
            }}
          />
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            user={profile}
            onUpdateSuccess={() => {
              fetchProfile();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
