export interface Credentials {
  username: string;
  password: string;
}

export interface AlertPayload {
  title: string;
  body: string;
  userId: number;
}

export const credentials: { valid: Credentials; invalid: Credentials } = {
  valid: {
    username: 'Admin',
    password: 'admin123',
  },
  invalid: {
    username: 'invalidUser',
    password: 'wrongPassword',
  },
};

export const alertPayloads: { severeWeather: AlertPayload; officeClosure: AlertPayload } = {
  severeWeather: {
    title: 'Severe Weather Alert',
    body: 'Tornado warning in effect for Austin, TX area.',
    userId: 1,
  },
  officeClosure: {
    title: 'Office Closure Notice',
    body: 'All offices closed Friday for maintenance.',
    userId: 1,
  },
};
