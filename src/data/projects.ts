export interface MediaItem {
  src: string;
  alt: string;
  w: number;
  h: number;
  type: 'image' | 'video';
  title: string;
  caption: string;
  tags: string[];
  project?: string;
  projectSlug?: string;
}

// ── Definitive tag list ──
// Tools: Figma, SwiftUI, Procreate, Illustrator, Framer, Fusion 360
// Categories: Product Design, Fine Art, UX/UI, Photography, Branding
// Media: Graphite, Paint
// Content type (skills page only): Video, Photo
export const ALL_TAGS = [
  'Figma',
  'SwiftUI',
  'Procreate',
  'Illustrator',
  'Framer',
  'Fusion 360',
  'Product Design',
  'Fine Art',
  'UX/UI',
  'Graphite',
  'Paint',
  'Photography',
  'Branding',
  'InDesign',
  'Illustration',
  'AI Generation',
  'Claude',
  'Gemini',
  'Video',
  'Photo',
] as const;

// Tags that should only appear on the /skills filter page, not in lightbox pills
export const HIDDEN_PILL_TAGS = ['Video', 'Photo'] as const;

export const media: MediaItem[] = [
  // ═══════════════════════════════════════
  // UX/UI VIDEOS — Dossi
  // ═══════════════════════════════════════
  { src: '/videos/uxui/dossi-welcome-flow-1a.mp4', alt: 'Welcome flow', w: 886, h: 1920, type: 'video',
    title: 'Welcome Flow', caption: 'First-launch onboarding sequence that introduces core features and collects user health preferences.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/cgm-selection-1b.mp4', alt: 'CGM Selection', w: 886, h: 1920, type: 'video',
    title: 'CGM Selection', caption: 'Device pairing flow that guides users through selecting and connecting their continuous glucose monitor.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/insights-scroll-3a.mp4', alt: 'Insights Scroll', w: 886, h: 1920, type: 'video',
    title: 'Insights Feed', caption: 'Scrollable feed of personalized glucose insights, surfacing patterns and trends.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/quick-action-bolus-3b.mp4', alt: 'Quick Action Bolus', w: 886, h: 1920, type: 'video',
    title: 'Quick Action Bolus', caption: 'One-tap bolus logging with haptic confirmation.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/notifications-toggle-3c.mp4', alt: 'Notifications Toggle', w: 886, h: 1920, type: 'video',
    title: 'Notifications', caption: 'Granular notification controls for alert types, thresholds, and quiet hours.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/ai-chat-text-5b.mp4', alt: 'AI Chat — Text', w: 886, h: 1920, type: 'video',
    title: 'AI Chat — Text', caption: 'Conversational AI interface for health questions and personalized guidance.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Gemini', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/ai-chat-photo-5a.mp4', alt: 'AI Chat — Photo', w: 886, h: 1920, type: 'video',
    title: 'AI Chat — Photo', caption: 'Photo-based meal logging — snap a photo for estimated nutritional data.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Gemini', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/ai-chat-insights-5c.mp4', alt: 'AI Chat — Insights', w: 886, h: 1920, type: 'video',
    title: 'AI Chat — Insights', caption: 'AI-generated insights connecting glucose patterns to meals, activity, and dosing.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Gemini', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/nutrition-page-scroll-4a.mp4', alt: 'Nutrition Page', w: 886, h: 1920, type: 'video',
    title: 'Nutrition Page', caption: 'Daily nutrition summary with macros, meal timeline, and glucose overlay.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/meal-entry-scroll-4b.mp4', alt: 'Meal Entry', w: 886, h: 1920, type: 'video',
    title: 'Meal Entry', caption: 'Streamlined meal logging with search, recent meals, and portion adjustment.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/dossi-metabolic-profile-8a.mp4', alt: 'Metabolic Profile', w: 886, h: 1920, type: 'video',
    title: 'Metabolic Profile', caption: 'User health profile with key metabolic metrics and treatment settings.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/dossi-onboarding-8b.mp4', alt: 'Dossi Onboarding', w: 886, h: 1920, type: 'video',
    title: 'Onboarding', caption: 'Setup flow collecting diabetes type, treatment method, and target ranges.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/uxui/dossi-account-8c.mp4', alt: 'Dossi Account', w: 886, h: 1920, type: 'video',
    title: 'Account Settings', caption: 'Profile editing, data export, and connected device management.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/dossi/landscape.mp4', alt: 'Dashboard', w: 1920, h: 1080, type: 'video',
    title: 'Dashboard', caption: 'Real-time glucose monitoring with contextual factor cards.',
    tags: ['SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/videos/dossi/11a.mov', alt: 'AI chat', w: 886, h: 1920, type: 'video',
    title: 'AI Chat', caption: 'Natural language meal logging powered by Gemini.',
    tags: ['SwiftUI', 'UX/UI', 'Video'], project: 'Dossi', projectSlug: 'dossi' },

  // ═══════════════════════════════════════
  // UX/UI VIDEOS — Rewired
  // ═══════════════════════════════════════
  { src: '/videos/uxui/rewired-value-props-2a.mp4', alt: 'Value props', w: 886, h: 1920, type: 'video',
    title: 'Value Propositions', caption: 'Animated onboarding cards communicating core benefits.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/uxui/rewired-onboarding-2b.mp4', alt: 'Onboarding', w: 886, h: 1920, type: 'video',
    title: 'Onboarding Flow', caption: 'Multi-step onboarding assessing mental wellness goals.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/uxui/rewired-questions-7a.mp4', alt: 'Questions', w: 886, h: 1920, type: 'video',
    title: 'Daily Check-in', caption: 'Interactive questionnaire tracking mood and cognitive state.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/uxui/rewired-finished-7b.mp4', alt: 'Finished', w: 886, h: 1920, type: 'video',
    title: 'Lesson Complete', caption: 'Completion screen with progress visualization.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/uxui/rewired-lesson-7c.mp4', alt: 'Lesson flow', w: 886, h: 1920, type: 'video',
    title: 'Lesson View', caption: 'Guided lesson with step-by-step cognitive behavioral exercises.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/uxui/avatar-selection-6a.mp4', alt: 'Avatar selection', w: 886, h: 1920, type: 'video',
    title: 'Avatar Selection', caption: 'Users choose from 97 unique avatars during onboarding.',
    tags: ['SwiftUI', 'UX/UI', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/uxui/ai-orb-6b.mp4', alt: 'AI Orb', w: 886, h: 1920, type: 'video',
    title: 'AI Orb', caption: 'Animated orb coaching interaction — pulses and shifts color.',
    tags: ['SwiftUI', 'Procreate', 'UX/UI', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/uxui/rewired-website-scroll.mp4', alt: 'Website', w: 1920, h: 1080, type: 'video',
    title: 'Marketing Website', caption: 'Single-page experience with scroll-triggered animations.',
    tags: ['Framer', 'UX/UI', 'Branding', 'Video'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/videos/rewired/animation-process.mp4', alt: 'Animation process', w: 1920, h: 1080, type: 'video',
    title: 'Animation Process', caption: 'Creating onboarding illustrations frame by frame in Procreate.',
    tags: ['Procreate', 'Video'], project: 'Rewired', projectSlug: 'rewired' },

  // ═══════════════════════════════════════
  // DOSSI SCREENS
  // ═══════════════════════════════════════
  { src: '/images/dossi/screens/1b.png', alt: 'Redesign', w: 870, h: 1603, type: 'image',
    title: 'Before & After', caption: 'Complete redesign — every screen rethought for warmth and ease of use.',
    tags: ['Figma', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/create-account-3.jpg', alt: 'Sign-up directions', w: 1280, h: 2778, type: 'image',
    title: 'Sign-Up Page', caption: 'Five directions exploring tone, hierarchy, and warmth vs. credibility.',
    tags: ['Figma', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/figma-workspace-1.png', alt: 'Figma workspace', w: 3184, h: 2232, type: 'image',
    title: 'Figma Workspace', caption: 'Full screen inventory with every component and interaction.',
    tags: ['Figma', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/icons/icon-01.jpg', alt: 'App icons', w: 4267, h: 4267, type: 'image',
    title: 'App Icon Exploration', caption: '16 directions testing gradient treatments and orb forms.',
    tags: ['Figma', 'Illustrator', 'Branding', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/welcome.png', alt: 'Welcome', w: 1170, h: 2532, type: 'image',
    title: 'Welcome Screen', caption: 'Sets the tone with Dossi\'s purple gradient and a clear call to action.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/aichat.jpg', alt: 'AI Chat', w: 1170, h: 2532, type: 'image',
    title: 'AI Chat', caption: 'Conversational meal logging and insulin guidance powered by Gemini.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/nutrition.png', alt: 'Nutrition', w: 1170, h: 2532, type: 'image',
    title: 'Nutrition', caption: 'Macro breakdown and meal history with running daily totals.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/insights.png', alt: 'Insights', w: 1170, h: 2532, type: 'image',
    title: 'Insights', caption: 'Glucose score, time in range, and pattern analysis.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/quickaction.png', alt: 'Quick Action', w: 1170, h: 2532, type: 'image',
    title: 'Quick Bolus', caption: 'Fast insulin delivery with safety confirmation and biometric auth.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/omnipod.png', alt: 'Omnipod', w: 1170, h: 2532, type: 'image',
    title: 'Omnipod Management', caption: 'Pod status, remaining insulin, and direct Bluetooth controls.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/settings.png', alt: 'Settings', w: 1170, h: 2532, type: 'image',
    title: 'Settings', caption: 'Therapy parameters, device connections, and notification preferences.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },
  { src: '/images/dossi/screens/dash.png', alt: 'Dashboard', w: 1170, h: 2532, type: 'image',
    title: 'Dashboard', caption: 'Real-time glucose with prediction curve and contextual factors.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Dossi', projectSlug: 'dossi' },

  // ═══════════════════════════════════════
  // REWIRED SCREENS
  // ═══════════════════════════════════════
  { src: '/images/rewired/screenshots/welcome.png', alt: 'Welcome', w: 1242, h: 2688, type: 'image',
    title: 'Welcome Screen', caption: 'The rewired brain hero illustration — warm and grounded in neuroscience.',
    tags: ['SwiftUI', 'Procreate', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/npi.png', alt: 'Assessment', w: 1242, h: 2688, type: 'image',
    title: 'Assessment', caption: 'Behavioral pattern questions that surface core limiting beliefs.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/results.png', alt: 'Results', w: 1242, h: 2688, type: 'image',
    title: 'Results', caption: 'AI analysis of core themes and belief patterns.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/dashboard.png', alt: 'Dashboard', w: 1242, h: 2688, type: 'image',
    title: 'Dashboard', caption: 'Daily dashboard — session, belief focus, streak tracking, and progress.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/profile.png', alt: 'Neuroprofile', w: 1242, h: 2688, type: 'image',
    title: 'Neuroprofile', caption: 'Ideal self, core traits, and growth tracking.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/lessonintro.png', alt: 'Lesson intro', w: 1242, h: 2688, type: 'image',
    title: 'Lesson Intro', caption: 'Session introduction with progress tracking and belief focus.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/lesson.png', alt: 'Lesson', w: 1242, h: 2688, type: 'image',
    title: 'Lesson', caption: 'Psychoeducation content — awareness, practice, and integration phases.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/aichattext.png', alt: 'AI Coach', w: 1242, h: 2688, type: 'image',
    title: 'AI Coach', caption: 'Personalized guidance grounded in CBT and neuroplasticity principles.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/notifications.png', alt: 'Notifications', w: 1242, h: 2688, type: 'image',
    title: 'Notifications', caption: 'Session reminders and check-in preferences.',
    tags: ['SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/screenshots/screen1.png', alt: 'Onboarding', w: 1242, h: 2688, type: 'image',
    title: 'Onboarding', caption: 'First screen of the onboarding flow.',
    tags: ['Figma', 'SwiftUI', 'UX/UI', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/orbs/orb-01.png', alt: 'Orb frames', w: 350, h: 350, type: 'image',
    title: 'Orb Animation Frames', caption: '36 individually created frames with hue rotation and shifting light.',
    tags: ['Procreate', 'Branding', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/illustrations/brain-tree.png', alt: 'Illustrations', w: 1024, h: 1024, type: 'image',
    title: 'Illustration Library', caption: '60+ original AI-generated illustrations refined in Illustrator.',
    tags: ['AI Generation', 'Illustration', 'Illustrator', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },
  { src: '/images/rewired/avatars/avatar_009.png', alt: 'Avatars', w: 376, h: 435, type: 'image',
    title: 'Avatar Library', caption: '97 unique avatar illustrations in the app\'s signature purple palette.',
    tags: ['Procreate', 'Branding', 'Photo'], project: 'Rewired', projectSlug: 'rewired' },

  // ═══════════════════════════════════════
  // PRODUCT DESIGN
  // ═══════════════════════════════════════
  { src: '/images/product/2.jpg', alt: 'Step Stool — In Context', w: 795, h: 1200, type: 'image',
    title: 'Step Stool', caption: 'CNC-cut Baltic birch plywood step stool with pull-out table for the laundry room. Modeled in Fusion 360.',
    tags: ['Product Design', 'Fusion 360', 'Photo'] },
  { src: '/images/product/Studio_3.jpeg', alt: 'Step Stool — Studio', w: 900, h: 1200, type: 'image',
    title: 'Step Stool — Studio', caption: 'Studio shot showing finger joint construction and clean geometry.',
    tags: ['Product Design', 'Fusion 360', 'Photo'] },
  { src: '/images/product/Detail_1.jpeg', alt: 'Step Stool — Detail', w: 900, h: 1200, type: 'image',
    title: 'Step Stool — Detail', caption: 'Detail of the finger joint and pull-out tray mechanism.',
    tags: ['Product Design', 'Fusion 360', 'Photo'] },

  // ═══════════════════════════════════════
  // FINE ART — Graphite / Charcoal
  // ═══════════════════════════════════════
  { src: '/images/art/bird1.jpeg', alt: 'American Kestrel', w: 989, h: 1200, type: 'image',
    title: 'American Kestrel', caption: 'Charcoal and colored pencil on toned paper, 2022. Brandywine Zoo endangered bird series.',
    tags: ['Fine Art', 'Graphite', 'Photo'] },
  { src: '/images/art/bird2.jpeg', alt: 'Black-crowned Night-Heron', w: 933, h: 1200, type: 'image',
    title: 'Black-crowned Night-Heron', caption: 'Charcoal and colored pencil on toned paper, 2022. Brandywine Zoo series.',
    tags: ['Fine Art', 'Graphite', 'Photo'] },
  { src: '/images/art/bird3.jpeg', alt: 'Red Knot', w: 1200, h: 981, type: 'image',
    title: 'Red Knot', caption: 'Charcoal and colored pencil on toned paper, 2022. Brandywine Zoo series.',
    tags: ['Fine Art', 'Graphite', 'Photo'] },
  { src: '/images/art/treasured.jpeg', alt: 'Treasured', w: 3292, h: 4907, type: 'image',
    title: 'Treasured', caption: 'Charcoal, 2023. Featured in College Board\'s AP Art & Design Exhibit.',
    tags: ['Fine Art', 'Graphite', 'Photo'] },
  { src: '/images/art/delicate.png', alt: 'Delicate', w: 3563, h: 2670, type: 'image',
    title: 'Delicate', caption: 'Graphite, 2022. National Silver Medal, Scholastic Art & Writing Awards.',
    tags: ['Fine Art', 'Graphite', 'Photo'] },
  { src: '/images/art/portrait-study.jpg', alt: 'Portrait Study', w: 1056, h: 1439, type: 'image',
    title: 'Portrait Study', caption: 'Graphite, 2023. Drawn from a Library of Congress archival photograph.',
    tags: ['Fine Art', 'Graphite', 'Photo'] },
  { src: '/images/art/hold-the-phone.jpeg', alt: 'Hold the Phone', w: 4513, h: 2957, type: 'image',
    title: 'Hold the Phone', caption: 'Graphite, 2023. A study in soft light, fabric texture, and quiet intimacy.',
    tags: ['Fine Art', 'Graphite', 'Photo'] },

  // ═══════════════════════════════════════
  // FINE ART — Oil paintings
  // ═══════════════════════════════════════
  { src: '/images/art/lemons-and-antlers.jpg', alt: 'Still Life with Antlers', w: 2123, h: 2503, type: 'image',
    title: 'Still Life with Antlers', caption: 'Oil on canvas, 2023. Organic forms against patterned draped fabric.',
    tags: ['Fine Art', 'Paint', 'Photo'] },
  { src: '/images/art/sargent-study.jpg', alt: 'After Sargent', w: 1892, h: 2763, type: 'image',
    title: 'After Sargent', caption: 'Oil on canvas, 2023. Master copy after John Singer Sargent.',
    tags: ['Fine Art', 'Paint', 'Photo'] },

  // ═══════════════════════════════════════
  // FINE ART — Digital
  // ═══════════════════════════════════════
  { src: '/images/art/beach-digital.jpg', alt: 'Riviera', w: 2295, h: 2994, type: 'image',
    title: 'Riviera', caption: 'Digital, 2023. Aerial beach scene created in Procreate.',
    tags: ['Fine Art', 'Procreate', 'Photo'] },

  // ═══════════════════════════════════════
  // PHOTOGRAPHY
  // ═══════════════════════════════════════
  { src: '/images/art/boy-drinking-soda.jpeg', alt: 'Fanta Break — Kenya, 2024', w: 716, h: 1200, type: 'image',
    title: 'Fanta Break', caption: 'Kenya, 2024. A boy mid-sip in the afternoon sun.',
    tags: ['Photography', 'Photo'] },
  { src: '/images/art/basket-of-mangos.jpeg', alt: 'The Harvest — Kenya, 2024', w: 675, h: 1200, type: 'image',
    title: 'The Harvest', caption: 'Kenya, 2024. A child holds a basin of freshly picked mangoes outside a school gate.',
    tags: ['Photography', 'Photo'] },
  { src: '/images/art/girl-with-water.jpg', alt: 'Water Carry — Kenya, 2024', w: 675, h: 1200, type: 'image',
    title: 'Water Carry', caption: 'Kenya, 2024. A girl stands with a jerry can in the midday heat.',
    tags: ['Photography', 'Photo'] },
  { src: '/images/art/sink.jpeg', alt: 'Wash — Kenya, 2024', w: 737, h: 1200, type: 'image',
    title: 'Wash', caption: 'Kenya, 2024. Two children at a hand-washing station.',
    tags: ['Photography', 'Photo'] },
  { src: '/images/art/portrait.jpg', alt: 'Hands to Heart — Kenya, 2024', w: 719, h: 1200, type: 'image',
    title: 'Hands to Heart', caption: 'Kenya, 2024. Hands pressed to chest, eyes steady.',
    tags: ['Photography', 'Photo'] },
  { src: '/images/art/supersonic.jpg', alt: 'Window Seat — Kenya, 2024', w: 1067, h: 1200, type: 'image',
    title: 'Window Seat', caption: 'Kenya, 2024. Reading by the glow of an airplane window.',
    tags: ['Photography', 'Photo'] },
  { src: '/images/art/zebrastripe.jpg', alt: 'The Herd — Kenya, 2024', w: 5884, h: 1533, type: 'image',
    title: 'The Herd', caption: 'Kenya, 2024. Zebras grazing on the Maasai Mara.',
    tags: ['Photography', 'Photo'] },
];

export function getAllTags(): string[] {
  return [...ALL_TAGS];
}

export function getMediaByTags(tags: string[]): MediaItem[] {
  if (tags.length === 0) return [];
  return media.filter((m) =>
    tags.some((tag) =>
      m.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    ),
  );
}

export function slugify(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function findTagBySlug(slug: string): string | undefined {
  return ALL_TAGS.find((t) => slugify(t) === slug);
}
