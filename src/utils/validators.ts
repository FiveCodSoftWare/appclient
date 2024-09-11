import moment from 'moment';

export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

export const validateAge = (age: number, minAge: number): boolean => {
  return age >= minAge;
};

export const validateDate = (dateString: string): string | null => {
  const date = moment(dateString, 'DD/MM/YYYY', true);
  return date.isValid() ? null : 'Fecha inválida. Use DD/MM/YYYY';
};
