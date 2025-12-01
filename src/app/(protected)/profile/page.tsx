'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
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
      <div className="fixed inset-0 top-[56px] sm:top-[64px] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-3"
        >
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-600" />
          <p className="text-sm text-slate-600 font-medium">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 top-[56px] sm:top-[64px] flex bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 px-6 lg:px-10 xl:px-12 py-6 lg:py-7 bg-white/80 backdrop-blur-sm border-b border-slate-200/80 shadow-sm"
        >
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              <User className="h-7 w-7 sm:h-9 sm:w-9 text-purple-600" />
              Profile Settings
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your account and preferences — update your avatar, personal details, and goal settings
            </p>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 lg:px-10 xl:px-12 py-6 lg:py-8">
            <div className="max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              >
                <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 overflow-hidden group">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Current Streak</p>
                        <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          {profile.currentStreak}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg"
                      >
                        <Flame className="h-9 w-9 text-white" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden group">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Member Since</p>
                        <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {memberSince}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl shadow-lg"
                      >
                        <Calendar className="h-9 w-9 text-white" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 overflow-hidden group sm:col-span-2 lg:col-span-1">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-2">Goal Type</p>
                        <Badge variant="secondary" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-4 py-1.5 text-sm">
                          {profile.goalType === 'BUILD_HABIT' ? 'Build Habit' : 'Quit Habit'}
                        </Badge>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg"
                      >
                        <Target className="h-9 w-9 text-white" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Content Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
              >
                {/* Avatar Card */}
                <div className="lg:col-span-4 xl:col-span-3">
                  <Card className="rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-lg font-bold">Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-5">
                        <AvatarUpload
                          currentAvatar={profile.avatarUrl}
                          userName={profile.fullName}
                          onUploadSuccess={async (url) => {
                            setProfile({ ...profile, avatarUrl: url });
                            await update({ avatarUrl: url });
                            fetchProfile();
                          }}
                        />
                        <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
                          Upload a square image (recommended 400×400). Your avatar will be visible to other members.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Form Card */}
                <div className="lg:col-span-8 xl:col-span-9">
                  <Card className="rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ProfileForm
                        user={profile}
                        onUpdateSuccess={() => {
                          fetchProfile();
                        }}
                      />

                      {/* Metadata */}
                      <div className="mt-8 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-lg">🌍</span>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Timezone</p>
                            <p className="font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                              {profile.timezone}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-lg">⏰</span>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Availability</p>
                            <p className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              {profile.availabilityHours.start} - {profile.availabilityHours.end}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
