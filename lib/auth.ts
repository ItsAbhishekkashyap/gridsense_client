import { authApi, setAccessToken } from './api';
import { User } from '../types';

export async function loginUser(email: string, password: string): Promise<{ user: User; accessToken: string }> {
  const response = await authApi.login({ email, password });
  const { user, accessToken } = response.data.data;
  setAccessToken(accessToken);
  return { user, accessToken };
}

export async function signupUser(name: string, email: string, password: string): Promise<{ user: User; accessToken: string }> {
  const response = await authApi.signup({ name, email, password });
  const { user, accessToken } = response.data.data;
  setAccessToken(accessToken);
  return { user, accessToken };
}

export async function logoutUser(): Promise<void> {
  try {
    await authApi.logout();
  } finally {
    setAccessToken(null);
  }
}

export async function tryRefreshToken(): Promise<{ user: User; accessToken: string } | null> {
  try {
    const refreshResponse = await authApi.refresh();
    const { accessToken } = refreshResponse.data.data;
    setAccessToken(accessToken);

    const meResponse = await authApi.me();
    const { user } = meResponse.data.data;
    return { user, accessToken };
  } catch {
    setAccessToken(null);
    return null;
  }
}
