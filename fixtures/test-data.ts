export const credentials = {
  valid: {
    username: 'Admin',
    password: 'admin123',
  },
  invalid: {
    username: 'invalidUser',
    password: 'wrongPassword',
  },
  emptyPassword: {
    username: 'Admin',
    password: '',
  },
};

export const alertPayloads = {
  severeWeather: {
    title: 'Severe Weather Alert',
    body: 'Tornado warning in effect for Austin, TX area. Seek shelter immediately.',
    userId: 1,
  },
  officeClosure: {
    title: 'Office Closure Notice',
    body: 'All offices will be closed this Friday for scheduled maintenance.',
    userId: 1,
  },
  itMaintenance: {
    title: 'IT System Maintenance',
    body: 'Scheduled downtime Saturday 2AM-6AM for server upgrades.',
    userId: 2,
  },
};

export const alertTemplates = [
  {
    id: 1,
    name: 'Severe Weather Alert',
    priority: 'high',
    channels: ['sms', 'email', 'push'],
  },
  {
    id: 2,
    name: 'Office Closure Notice',
    priority: 'medium',
    channels: ['email', 'push'],
  },
  {
    id: 3,
    name: 'IT System Maintenance',
    priority: 'low',
    channels: ['email'],
  },
];

export const recipientGroups = [
  { name: 'All Employees', size: 500 },
  { name: 'Engineering Team', size: 50 },
  { name: 'Executives', size: 10 },
];
