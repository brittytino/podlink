'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Clock, Users, MapPin } from 'lucide-react';

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', region: 'North America', offset: 'UTC-5' },
  { value: 'America/Chicago', label: 'Central Time (CT)', region: 'North America', offset: 'UTC-6' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', region: 'North America', offset: 'UTC-7' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', region: 'North America', offset: 'UTC-8' },
  { value: 'Europe/London', label: 'London (GMT)', region: 'Europe', offset: 'UTC+0' },
  { value: 'Europe/Paris', label: 'Paris (CET)', region: 'Europe', offset: 'UTC+1' },
  { value: 'Asia/Kolkata', label: 'India (IST)', region: 'Asia', offset: 'UTC+5:30' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', region: 'Middle East', offset: 'UTC+4' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', region: 'Asia', offset: 'UTC+9' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', region: 'Asia', offset: 'UTC+8' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)', region: 'Australia', offset: 'UTC+10' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST)', region: 'New Zealand', offset: 'UTC+12' },
];

interface TimezoneSelectorProps {
  timezone: string;
  onTimezoneChange: (value: string) => void;
}

export function TimezoneSelector({ timezone, onTimezoneChange }: TimezoneSelectorProps) {
  const selectedTimezone = timezones.find(tz => tz.value === timezone);
  const currentTime = new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center sm:text-left space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Select Your Timezone
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
          We'll match you with pod members in similar timezones for better availability
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Timezone Selector */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <Label className="text-base sm:text-lg font-bold text-foreground">
              Choose Your Location
            </Label>
          </div>

          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger
              className="
      h-12 sm:h-14 w-full
      rounded-lg border
      px-4
      flex items-center justify-between
      text-sm sm:text-base
      bg-background
      focus:outline-none focus:ring-2 focus:ring-primary
    "
            >
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="
      w-[var(--radix-select-trigger-width)]
      rounded-lg border bg-popover shadow-lg
      animate-in fade-in-0 zoom-in-95
      max-h-72 overflow-y-auto
    "
            >
              {timezones.map((tz) => (
                <SelectItem
                  key={tz.value}
                  value={tz.value}
                  className="
          cursor-pointer
          py-3 px-4
          rounded-md
          hover:bg-accent
          focus:bg-accent
          focus:text-accent-foreground
          text-sm sm:text-base
        "
                >
                  <span className="font-medium text-sm sm:text-base">
                    {tz.label} -
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {tz.region} • {tz.offset}
                    </span>
                  </span>

                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          {/* Benefits */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              Why timezone matters:
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>Better pod member matching</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>Real-time availability sync</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>Local community connections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Timezone Info */}
        <div className="space-y-4 sm:space-y-6">
          {selectedTimezone && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      Selected Timezone
                    </h3>
                  </div>

                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-border">
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-foreground">
                          {selectedTimezone.label}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {selectedTimezone.region} • {selectedTimezone.offset}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Current time:
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-foreground">
                          {currentTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timezone Map Visual */}
          <Card className="border-2 border-border">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Global Pod Network
                  </h3>
                </div>

                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Join thousands of users worldwide working on their goals in accountability pods.
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-primary">24/7</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Global Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-primary">50+</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Active Timezones</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
