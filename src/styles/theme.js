/* Ikki mavzu: light (och) va dark (qorong'i). Kalitlar bir xil —
   komponentlar faqat theme.colors.* dan foydalanadi. */
const base = {
  radius: { sm: '8px', md: '12px', lg: '18px', pill: '999px' },
  sidebar: { width: '272px', collapsed: '84px' },
  bp: { md: '900px', sm: '600px' },
};

export const lightTheme = {
  ...base,
  mode: 'light',
  colors: {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primarySoft: '#EAF1FF',
    primaryFaint: '#F5F8FF',
    ink: '#0B1220',
    black: '#0B1220',
    text: '#0B1220',
    gray: '#667085',
    grayLight: '#98A2B3',
    grayBg: '#F2F4F7',
    border: '#E3E8EF',
    bg: '#F4F6FA',
    white: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.85)',
    danger: '#E5484D',
    dangerSoft: '#FFF0F0',
    dangerBorder: '#FFD5D5',
    success: '#12A150',
    successSoft: '#E7F8EE',
    // Sidebar — light rejimda oq
    side: '#FFFFFF',
    sideBorder: '#E3E8EF',
    sideText: '#475467',
    sideMuted: '#98A2B3',
    sideStrong: '#0B1220',
    sideHover: '#F2F5FA',
    sideCard: '#F4F6FA',
  },
  shadow: {
    sm: '0 1px 2px rgba(12, 27, 46, 0.04)',
    md: '0 8px 24px -12px rgba(12, 27, 46, 0.12)',
    lg: '0 24px 60px -20px rgba(12, 27, 46, 0.28)',
  },
};

export const darkTheme = {
  ...base,
  mode: 'dark',
  colors: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primarySoft: 'rgba(59, 130, 246, 0.16)',
    primaryFaint: 'rgba(59, 130, 246, 0.07)',
    ink: '#E8EDF7',
    black: '#2B3A57',
    text: '#E8EDF7',
    gray: '#98A3B8',
    grayLight: '#667089',
    grayBg: '#1B253A',
    border: '#243049',
    bg: '#0A0F1B',
    white: '#111A2B',
    glass: 'rgba(17, 26, 43, 0.85)',
    danger: '#F2555A',
    dangerSoft: 'rgba(242, 85, 90, 0.12)',
    dangerBorder: 'rgba(242, 85, 90, 0.35)',
    success: '#22C55E',
    successSoft: 'rgba(34, 197, 94, 0.12)',
    // Sidebar — dark rejimda to'q
    side: '#0D1424',
    sideBorder: '#1C2740',
    sideText: 'rgba(255, 255, 255, 0.66)',
    sideMuted: 'rgba(255, 255, 255, 0.34)',
    sideStrong: '#FFFFFF',
    sideHover: 'rgba(255, 255, 255, 0.06)',
    sideCard: 'rgba(255, 255, 255, 0.05)',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 10px 28px -12px rgba(0, 0, 0, 0.6)',
    lg: '0 24px 60px -20px rgba(0, 0, 0, 0.75)',
  },
};

export default lightTheme;
