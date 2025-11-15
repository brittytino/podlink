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
    <div className="space-y-8 lg:space-y-10 max-h-[calc(100vh-400px)] lg:max-h-none overflow-hidden">
      <div className="text-center lg:text-left space-y-3 lg:space-y-4">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
          Select Your Timezone
        </h2>
        <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto lg:mx-0">
          We'll match you with pod members in similar timezones so someone is always available when you need support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
        {/* Timezone Selector */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
            <Label className="text-lg lg:text-xl font-bold text-foreground">
              Choose Your Location
            </Label>
          </div>

          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="h-14 lg:h-16 text-base lg:text-lg border-2 rounded-xl focus:border-primary">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value} className="py-3">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-semibold">{tz.label}</div>
                      <div className="text-sm text-muted-foreground">{tz.region} • {tz.offset}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-base lg:text-lg font-semibold text-foreground">
              Why timezone matters:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                <Users className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>Better pod member matching</span>
              </div>
              <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                <Clock className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Real-time availability sync</span>
              </div>
              <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                <MapPin className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span>Local community connections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Timezone Info */}
        <div className="space-y-6">
          {selectedTimezone && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6 lg:p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                    <h3 className="text-lg lg:text-xl font-bold text-foreground">
                      Selected Timezone
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-border">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-base lg:text-lg text-foreground">
                            {selectedTimezone.label}
                          </h4>
                          <p className="text-sm lg:text-base text-muted-foreground">
                            {selectedTimezone.region} • {selectedTimezone.offset}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                          <span className="text-sm lg:text-base text-muted-foreground">
                            Current time:
                          </span>
                          <span className="font-semibold text-base lg:text-lg text-foreground">
                            {currentTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timezone Map Visual (Placeholder) */}
          <Card className="border-2 border-border">
            <CardContent className="p-6 lg:p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 lg:h-7 lg:w-7 text-blue-500" />
                  <h3 className="text-lg lg:text-xl font-bold text-foreground">
                    Global Pod Network
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    Join thousands of users worldwide working on their goals in accountability pods.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-lg lg:text-xl font-bold text-blue-600">24/7</div>
                      <div className="text-xs lg:text-sm text-muted-foreground">Global Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg lg:text-xl font-bold text-green-600">50+</div>
                      <div className="text-xs lg:text-sm text-muted-foreground">Active Timezones</div>
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
