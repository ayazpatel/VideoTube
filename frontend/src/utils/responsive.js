// Mobile responsiveness utilities
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px'
};

export const isMobile = () => {
  return window.innerWidth < 768;
};

export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 992;
};

export const isDesktop = () => {
  return window.innerWidth >= 992;
};

// Touch device detection
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Format text for mobile display
export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Format numbers for display
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Get responsive grid columns
export const getResponsiveColumns = (itemCount = 12) => {
  if (isMobile()) {
    return { xs: 6, sm: 6 }; // 2 columns on mobile
  } else if (isTablet()) {
    return { xs: 6, sm: 6, md: 4 }; // 3 columns on tablet
  } else {
    return { xs: 6, sm: 6, md: 4, lg: 3, xl: 2 }; // Up to 6 columns on desktop
  }
};
