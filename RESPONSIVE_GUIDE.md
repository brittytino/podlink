# Quick Reference: Responsive Onboarding UI

## 📱 Mobile Layout (< 768px)

```
┌─────────────────────────┐
│  Step 1 of 6      83%   │ ← Sticky Header
│  ━━━━━━━━━░░░░░░░      │ ← Progress Bar
│  • • • ● ○ ○            │ ← Step Dots
├─────────────────────────┤
│                         │
│   [Quit Habit]          │ ← Full width
│   [Build Habit]         │ ← Stacked buttons
│                         │
│   Describe your goal    │
│   ┌─────────────────┐   │
│   │ Textarea        │   │
│   └─────────────────┘   │
│                         │
│   Popular Habits        │
│   ┌──────┐ ┌──────┐     │ ← 2 columns
│   │Habit1│ │Habit2│     │
│   └──────┘ └──────┘     │
│   ┌──────┐ ┌──────┐     │
│   │Habit3│ │Habit4│     │
│   └──────┘ └──────┘     │
│                         │
├─────────────────────────┤
│ [Back]      [Continue →]│ ← Footer
└─────────────────────────┘
```

## 💻 Desktop Layout (≥ 1024px)

```
┌────────────────┬──────────────────────────────┐
│                │  Set Your Goal               │
│  PodLink       │  What would you like...      │
│                ├──────────────────────────────┤
│  Progress 83%  │                              │
│  ━━━━━━━━━░░░  │   ┌──────────┐ ┌──────────┐ │
│                │   │   Quit   │ │  Build   │ │
│  ✓ Step 1      │   │  Habit   │ │  Habit   │ │
│  ● Step 2      │   └──────────┘ └──────────┘ │
│  ○ Step 3      │                              │
│  ○ Step 4      │   Describe your goal         │
│  ○ Step 5      │   ┌──────────────────────┐   │
│  ○ Step 6      │   │ Textarea             │   │
│                │   │                      │   │
│  🔒 Secure     │   └──────────────────────┘   │
│                │                              │
│                │   Popular Habits to Build    │
│                │   ┌─────┐ ┌─────┐ ┌─────┐   │
│                │   │Hab1 │ │Hab2 │ │Hab3 │   │
│                │   └─────┘ └─────┘ └─────┘   │
│                │   ┌─────┐ ┌─────┐ ┌─────┐   │
│                │   │Hab4 │ │Hab5 │ │Hab6 │   │
│                │   └─────┘ └─────┘ └─────┘   │
│                │                              │
│                ├──────────────────────────────┤
│                │ [← Back]      [Continue →]  │
└────────────────┴──────────────────────────────┘
```

## 🎨 Color Palette (Clean & Professional)

### Before (Too Colorful)
```
❌ bg-red-500 (Quit Habit)
❌ bg-green-500 (Build Habit)
❌ text-red-100, text-green-100
❌ border-red-400, border-green-400
```

### After (Unified & Clean)
```
✅ bg-primary (Brand color for all CTAs)
✅ bg-white (Clean backgrounds)
✅ bg-slate-50 (Subtle contrast)
✅ text-slate-600, text-slate-900 (Readable text)
✅ border-slate-200 (Soft borders)
✅ Subtle shadows for depth
```

## 📏 Spacing Scale

| Screen | Padding | Gap | Text |
|--------|---------|-----|------|
| Mobile | p-4 | gap-2 | text-xs |
| SM | p-6 | gap-3 | text-sm |
| LG | p-8 | gap-6 | text-base |
| XL | p-10 | gap-8 | text-lg |

## 🔧 Key Responsive Classes Used

```css
/* Popular Habits Grid - FIXED! */
grid-cols-1              /* Mobile: Stack */
xs:grid-cols-2          /* XS: 2 columns */
sm:grid-cols-2          /* SM: 2 columns */
lg:grid-cols-3          /* Desktop: 3 columns */

/* Text Sizes */
text-xs sm:text-sm      /* Small text */
text-sm sm:text-base    /* Body text */
text-lg sm:text-xl      /* Headings */

/* Spacing */
space-y-4 sm:space-y-6  /* Vertical spacing */
gap-2 sm:gap-3          /* Grid gaps */
p-4 sm:p-6 lg:p-8       /* Padding */

/* Layout */
flex-col sm:flex-row    /* Stack on mobile */
hidden lg:flex          /* Desktop only */
lg:hidden               /* Mobile only */
```

## 🎯 Button States

```css
/* Primary Button */
Default:  bg-primary text-white
Hover:    bg-primary/90 shadow-md
Active:   scale-[0.98]
Disabled: opacity-50 cursor-not-allowed

/* Outline Button */
Default:  border-2 hover:border-primary/50
Hover:    bg-primary/5
Active:   scale-[0.98]
```

## ✨ Animation Timings

```css
Transitions: duration-200 (buttons/hovers)
             duration-300 (page changes)
             duration-500 (content fade-in)

Easing: ease-in-out (smooth)
        ease-out (progress bar)
```

## 🚀 Performance Tips

1. **Images**: Use next/image for optimization
2. **Animations**: GPU-accelerated (transform, opacity)
3. **Lazy Load**: AnimatePresence mode="wait"
4. **Overflow**: Proper scroll containers
5. **Touch**: touch-manipulation for snappy taps

## 📱 Touch Target Sizes

```css
Minimum: 44x44px (Apple HIG)
Buttons: h-11 (44px) on mobile
         h-12 on desktop
Icons:   h-4 w-4 (16px) on mobile
         h-5 w-5 (20px) on desktop
```

## 🎉 User Experience Wins

1. ✅ No horizontal scroll on any device
2. ✅ All content readable without zooming
3. ✅ Large, tappable buttons on mobile
4. ✅ Clear visual hierarchy
5. ✅ Smooth transitions
6. ✅ Instant feedback on interactions
7. ✅ Progress always visible
8. ✅ Clean, distraction-free design

---

**Test Your Changes**:
1. Open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone SE, iPad, Desktop
4. Verify all buttons are tappable
5. Check popular habits are visible
6. Ensure smooth scrolling
