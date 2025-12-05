

export interface AuthResponse {
  success: boolean;
  user?: {
    name: string;
    email: string;
    role: 'student' | 'admin';
    token: string;
  };
  error?: string;
}

// Local Storage Key
const STORAGE_KEY = 'neurocalm_users_db';

// Default Users (Always available if storage is empty)
const DEFAULT_USERS = [
  { email: 'admin@gmail.com', password: 'admin', name: 'System Admin', role: 'admin' },
  { email: 'student@gmail.com', password: 'password', name: 'Demo Student', role: 'student' }
];

// Load Users from Local Storage or use Defaults
const loadUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load users from storage", e);
  }
  return [...DEFAULT_USERS]; // Return copy of defaults
};

// Initialize Database
const MOCK_USERS = loadUsers();

// Helper to save to storage
const saveUsers = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
  } catch (e) {
    console.error("Failed to save users to storage", e);
  }
};

// Mock Google Identity API Configuration
const GOOGLE_IDENTITY_API_KEY = "AIzaSyD-Mock-ApiKey-For-NeuroCalm";
const API_ENDPOINT = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  
  /**
   * Check if a user exists in the database
   */
  checkUserExists: async (email: string): Promise<boolean> => {
    await delay(800); // Simulate network lookup
    const lowerEmail = email.toLowerCase().trim();
    return MOCK_USERS.some((u: any) => u.email === lowerEmail);
  },

  /**
   * Simulates a secure login via Google Identity Platform
   * Requires a valid Google Email and Password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulate API Network Latency
    await delay(1500); 

    console.log(`[AuthService] Authenticating with Google Identity Platform...`);
    console.log(`[AuthService] Endpoint: ${API_ENDPOINT}?key=${GOOGLE_IDENTITY_API_KEY}`);

    const lowerEmail = email.toLowerCase().trim();
    
    // 1. API-Side Strict Validation (Simulating Cloud Function)
    if (!lowerEmail.endsWith('@gmail.com')) {
      return { 
        success: false, 
        error: 'API Error: INVALID_EMAIL_DOMAIN. Only @gmail.com is supported.' 
      };
    }

    // 2. Database Lookup (Simulating Firebase Auth)
    const user = MOCK_USERS.find((u: any) => u.email === lowerEmail && u.password === password);

    if (user) {
      console.log(`[AuthService] User verified: ${user.role}`);
      return {
        success: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role as 'student' | 'admin',
          token: `google-oauth-token-${Date.now()}-${GOOGLE_IDENTITY_API_KEY.substring(0,8)}`
        }
      };
    }

    // 3. Error Handling
    return { 
      success: false, 
      error: 'API Error: INVALID_PASSWORD. Credentials do not match.' 
    };
  },

  /**
   * Simulates Google OAuth 2.0 Flow
   * Accepts email from the frontend modal simulation
   */
  googleLogin: async (email?: string): Promise<AuthResponse> => {
    const userEmail = email || 'google_user@gmail.com';
    const lowerEmail = userEmail.toLowerCase();
    
    // Check if user exists in our local DB
    let user = MOCK_USERS.find((u: any) => u.email === lowerEmail);
    
    // AUTO-REGISTRATION: If user doesn't exist, create them instantly
    if (!user) {
      console.log(`[AuthService] New Google User detected. Auto-registering: ${lowerEmail}`);
      
      const newName = lowerEmail.split('@')[0].split('.').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      
      user = {
        email: lowerEmail,
        password: 'google-oauth-managed', // Placeholder
        name: newName,
        role: 'student',
        usn: `GOOGLE-${Date.now().toString().slice(-4)}`
      };
      
      MOCK_USERS.push(user);
      saveUsers();
    }

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role as 'student' | 'admin', 
        token: `oauth2-token-${Date.now()}`
      }
    };
  },

  /**
   * Simulates Registration via Google Identity
   */
  register: async (name: string, usn: string, email: string, password: string): Promise<AuthResponse> => {
    await delay(1500);

    const lowerEmail = email.toLowerCase().trim();

    // Strict Domain Check
    if (!lowerEmail.endsWith('@gmail.com')) {
      return { success: false, error: 'Registration Error: Domain restricted to @gmail.com.' };
    }

    if (MOCK_USERS.find((u: any) => u.email === lowerEmail)) {
      return { success: false, error: 'API Error: EMAIL_EXISTS. User already registered.' };
    }

    // "Save" to mock database
    MOCK_USERS.push({
      email: lowerEmail,
      password,
      name,
      role: 'student', // Default role
      usn // Store USN (optional based on schema, but good to have)
    });
    
    // Persist to Local Storage
    saveUsers();

    return {
      success: true,
      user: {
        name,
        email: lowerEmail,
        role: 'student',
        token: `jwt-token-${Date.now()}`
      }
    };
  }
};
