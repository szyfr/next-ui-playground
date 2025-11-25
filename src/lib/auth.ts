import apiClient from './api';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user?: User;
    message?: string;
}

/**
 * Initialize CSRF cookie before making authenticated requests
 */
export async function initCsrf(): Promise<void> {
    await apiClient.get('/sanctum/csrf-cookie');
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<User> {
    // First, get CSRF cookie
    await initCsrf();

    // Then attempt login
    const response = await apiClient.post<AuthResponse>('/login', credentials);

    // Fetch user data after successful login
    const user = await getCurrentUser();
    return user;
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
    await apiClient.post('/logout');
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/user');
    return response.data;
}
