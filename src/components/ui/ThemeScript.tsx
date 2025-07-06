/**
 * Theme initialization script to prevent flash of unstyled content (FOUC)
 * This runs before React hydration to set the correct theme immediately
 */
export default function ThemeScript() {
  const script = `
    (function() {
      try {
        // Get theme from localStorage or default to system
        const savedTheme = localStorage.getItem('upsc-theme');
        const userProfile = localStorage.getItem('upsc-user-profile');
        let theme = 'system';
        
        if (savedTheme) {
          theme = savedTheme;
        } else if (userProfile) {
          try {
            const profile = JSON.parse(userProfile);
            theme = profile.preferences?.theme || 'system';
          } catch (e) {
            console.warn('Failed to parse user profile for theme');
          }
        }
        
        // Apply theme immediately
        const root = document.documentElement;
        
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // System theme
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (systemDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
        
        // Save the resolved theme to localStorage for next-themes
        if (!savedTheme) {
          localStorage.setItem('upsc-theme', theme);
        }
      } catch (error) {
        console.warn('Theme initialization failed:', error);
        // Fallback to light mode
        document.documentElement.classList.remove('dark');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
