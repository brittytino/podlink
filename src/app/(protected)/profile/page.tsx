'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Badge } from '@/components/ui/badge';
import { User, Loader2, Flame, Calendar, Target } from 'lucide-react';

interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  goalDescription: string;
  goalType: string;
  goalCategory: string | null;
  timezone: string;
  availabilityHours: { start: string; end: string };
  currentStreak: number;
  avatarUrl: string | null;
  gender: string | null;
  lastCheckIn: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setProfile(data.user);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

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
    // outer container: comfortable padding on all screen sizes, center and limit width
    <div className="px-4 py-8 sm:py-10 lg:py-12 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
          <User className="h-6 w-6 sm:h-8 sm:w-8" />
          Profile Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Manage your account and preferences — update your avatar, personal details, and goal settings to
          keep your habit journey in sync.
        </p>
      </div>

      {/* Stats Cards: responsive grid with consistent card styling */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-150">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl sm:text-3xl font-bold">{profile.currentStreak}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-150">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg sm:text-xl font-bold">{memberSince}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-150">
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

      {/* Main content: use a responsive two-column layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Avatar (spans full width on small screens) */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <AvatarUpload
                  currentAvatar={profile.avatarUrl}
                  userName={profile.fullName}
                  onUploadSuccess={async (url) => {
                    setProfile({ ...profile, avatarUrl: url });
                    await update({ avatarUrl: url });
                    // Refresh profile to get updated data
                    fetchProfile();
                  }}
                />
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Upload a square image (recommended 400×400). Your avatar will be visible to other members.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Form (spans two columns on large screens for comfortable width) */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ProfileForm
                  user={profile}
                  onUpdateSuccess={() => {
                    fetchProfile();
                  }}
                />

                {/* Small helper / meta info row at the bottom for smaller screens */}
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                  <span>Timezone: <span className="font-medium text-foreground">{profile.timezone}</span></span>
                  <span>Availability: <span className="font-medium text-foreground">{profile.availabilityHours.start} - {profile.availabilityHours.end}</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spacing at the bottom for comfortable scrolling on small devices */}
      <div className="h-6 lg:h-10" />
    </div>
  );
}
