import { validate as isUuid } from 'uuid';
import { User } from './types';

export const validateUserPayload = (
  payload: any
): { valid: boolean; message?: string } => {
  if (payload == null || typeof payload !== 'object')
    return { valid: false, message: 'Request body must be a JSON object' };

  const { username, age, hobbies } = payload;

  if (typeof username !== 'string' || username.trim().length === 0)
    return {
      valid: false,
      message: 'Field "username" is required and must be a non-empty string',
    };
  if (typeof age !== 'number' || !Number.isFinite(age))
    return {
      valid: false,
      message: 'Field "age" is required and must be a number',
    };
  if (!Array.isArray(hobbies))
    return {
      valid: false,
      message: 'Field "hobbies" is required and must be an array',
    };
  if (!hobbies.every((h) => typeof h === 'string'))
    return { valid: false, message: 'Each hobby must be a string' };

  return { valid: true };
};

export const validateUserId = (
  id: string
): { valid: boolean; message?: string } => {
  if (!isUuid(id))
    return { valid: false, message: 'Invalid userId: must be a valid UUID' };
  return { valid: true };
};
