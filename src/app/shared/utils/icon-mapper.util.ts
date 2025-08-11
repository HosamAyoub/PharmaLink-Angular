export const iconMap: Record<string, string> = {
  // Medicines
  'pills': 'fa-solid fa-pills',
  'medication': 'fa-solid fa-pills',
  'prescription': 'fa-solid fa-prescription-bottle-medical',
  
  // Alerts
  'triangle-exclamation': 'fa-solid fa-triangle-exclamation',
  'warning': 'fa-solid fa-triangle-exclamation',
  
  // Finance
  'money-bill-wave': 'fa-solid fa-money-bill-wave',
  'revenue': 'fa-solid fa-money-bill-trend-up',
  'dollar-sign': 'fa-solid fa-dollar-sign',
  
  // Users
  'users': 'fa-solid fa-users',
  'user-group': 'fa-solid fa-user-group',
  
  // Shopping
  'cart-shopping': 'fa-solid fa-cart-shopping',
  'basket-shopping': 'fa-solid fa-basket-shopping',
  
  // Default fallback
  'default': 'fa-solid fa-circle-question'
};
export function getIconClass(iconName: string): string {
  return iconMap[iconName] || iconMap['default'];
}
