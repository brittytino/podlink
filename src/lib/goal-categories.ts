// Goal categories for matching users with similar goals

export const BAD_HABITS_TO_QUIT = [
  { id: 'quit_social_media', label: 'Social Media Addiction', description: 'Instagram, TikTok, Facebook scrolling' },
  { id: 'quit_procrastination', label: 'Procrastination & Time Wasting', description: 'Stop putting off important tasks' },
  { id: 'quit_junk_food', label: 'Junk Food & Unhealthy Eating', description: 'Eat healthier, avoid processed foods' },
  { id: 'quit_gaming', label: 'Excessive Gaming', description: 'Reduce gaming time' },
  { id: 'quit_smoking', label: 'Smoking & Vaping', description: 'Quit tobacco products' },
  { id: 'quit_alcohol', label: 'Alcohol Consumption', description: 'Reduce or quit drinking' },
  { id: 'quit_pornography', label: 'Pornography & Adult Content', description: 'Break the addiction' },
  { id: 'quit_nail_biting', label: 'Nail Biting', description: 'Stop biting nails' },
  { id: 'quit_negative_self_talk', label: 'Negative Self-Talk', description: 'Build positive self-image' },
  { id: 'quit_overspending', label: 'Overspending & Impulsive Shopping', description: 'Control spending habits' },
  { id: 'quit_late_night_phone', label: 'Late Night Phone Usage', description: 'Better sleep hygiene' },
  { id: 'quit_binge_watching', label: 'Binge Watching TV/Netflix', description: 'Reduce screen time' },
  { id: 'quit_oversleeping', label: 'Oversleeping & Snoozing Alarms', description: 'Wake up on time' },
  { id: 'quit_gossip', label: 'Gossip & Toxic Conversations', description: 'Avoid negative talk' },
  { id: 'quit_energy_drinks', label: 'Energy Drink Addiction', description: 'Reduce caffeine dependency' },
  { id: 'quit_gambling', label: 'Gambling', description: 'Stop gambling' },
  { id: 'quit_lying', label: 'Lying & Dishonesty', description: 'Build honesty' },
  { id: 'quit_anger', label: 'Anger & Aggression', description: 'Manage emotions better' },
  { id: 'quit_jealousy', label: 'Jealousy & Comparison', description: 'Focus on self-growth' },
  { id: 'quit_avoiding_responsibilities', label: 'Avoiding Responsibilities', description: 'Take ownership' },
];

export const GOOD_HABITS_TO_BUILD = [
  { id: 'build_exercise', label: 'Daily Exercise & Fitness', description: '30+ minutes daily' },
  { id: 'build_meditation', label: 'Meditation & Mindfulness', description: 'Daily meditation practice' },
  { id: 'build_reading', label: 'Reading Books', description: '30 minutes daily' },
  { id: 'build_journaling', label: 'Journaling & Gratitude Practice', description: 'Daily reflection' },
  { id: 'build_early_wake', label: 'Early Morning Wake Up', description: '5-6 AM wake time' },
  { id: 'build_water', label: 'Drinking 8 Glasses of Water Daily', description: 'Stay hydrated' },
  { id: 'build_healthy_eating', label: 'Healthy Eating & Meal Prep', description: 'Nutritious meals' },
  { id: 'build_learning', label: 'Learning a New Skill', description: 'Coding, language, instrument' },
  { id: 'build_cold_showers', label: 'Cold Showers', description: 'Build mental resilience' },
  { id: 'build_sleep_schedule', label: 'Consistent Sleep Schedule', description: '7-8 hours nightly' },
  { id: 'build_prayer', label: 'Prayer & Spiritual Practice', description: 'Daily spiritual time' },
  { id: 'build_planning', label: 'Daily Planning & Goal Setting', description: 'Plan each day' },
  { id: 'build_saving', label: 'Saving Money Regularly', description: 'Build financial security' },
  { id: 'build_family_calls', label: 'Calling Parents/Family Weekly', description: 'Stay connected' },
  { id: 'build_compliments', label: 'Complimenting Others', description: 'Spread positivity' },
  { id: 'build_helping', label: 'Helping Someone Daily', description: 'Acts of kindness' },
  { id: 'build_digital_detox', label: 'Digital Detox', description: '1 hour daily without devices' },
  { id: 'build_stretching', label: 'Stretching & Yoga', description: 'Daily flexibility work' },
  { id: 'build_creative', label: 'Creative Work', description: 'Writing, art, music' },
  { id: 'build_relationships', label: 'Building Meaningful Relationships', description: 'Deep connections' },
];

// Map goal categories for matching similar goals
export const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  // Social media related
  'quit_social_media': ['quit_social_media', 'quit_late_night_phone', 'quit_binge_watching'],
  'quit_late_night_phone': ['quit_social_media', 'quit_late_night_phone', 'quit_binge_watching'],
  'quit_binge_watching': ['quit_social_media', 'quit_late_night_phone', 'quit_binge_watching'],
  
  // Health related
  'quit_junk_food': ['quit_junk_food', 'quit_energy_drinks', 'build_healthy_eating'],
  'quit_energy_drinks': ['quit_junk_food', 'quit_energy_drinks', 'quit_alcohol'],
  'build_healthy_eating': ['quit_junk_food', 'build_healthy_eating', 'build_water'],
  
  // Exercise related
  'build_exercise': ['build_exercise', 'build_stretching', 'build_cold_showers'],
  'build_stretching': ['build_exercise', 'build_stretching', 'build_yoga'],
  
  // Mental health
  'quit_negative_self_talk': ['quit_negative_self_talk', 'quit_jealousy', 'build_meditation'],
  'build_meditation': ['build_meditation', 'build_journaling', 'quit_negative_self_talk'],
  'build_journaling': ['build_journaling', 'build_meditation', 'build_planning'],
  
  // Productivity
  'quit_procrastination': ['quit_procrastination', 'quit_avoiding_responsibilities', 'build_planning'],
  'quit_avoiding_responsibilities': ['quit_procrastination', 'quit_avoiding_responsibilities', 'build_planning'],
  'build_planning': ['build_planning', 'quit_procrastination', 'build_early_wake'],
};

/**
 * Get similar goal categories for matching
 */
export function getSimilarGoalCategories(goalCategory: string): string[] {
  return GOAL_CATEGORY_MAP[goalCategory] || [goalCategory];
}

/**
 * Get goal category by ID
 */
export function getGoalCategoryById(id: string, goalType: 'QUIT_HABIT' | 'BUILD_HABIT') {
  const categories = goalType === 'QUIT_HABIT' ? BAD_HABITS_TO_QUIT : GOOD_HABITS_TO_BUILD;
  return categories.find(cat => cat.id === id);
}

