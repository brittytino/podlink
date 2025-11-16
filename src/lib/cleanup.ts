'use client';

// Clear old localStorage data that might interfere with new user flow
export function clearOldUserData() {
  if (typeof window !== 'undefined') {
    try {
      // Remove old onboarding completion markers
      localStorage.removeItem('podlink_onboarding_complete');
      localStorage.removeItem('podlink_pod_id');
      
      // Clear any other cached user data that might interfere
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('podlink_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Could not clear localStorage:', error);
    }
  }
}

// Call this when user logs out
export function clearUserSession() {
  clearOldUserData();
}