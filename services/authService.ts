
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

// Simulated User Database (Cloud Firestore Mock)
const MOCK_USERS = [
  { email: 'admin@gmail.com', password: 'admin', name: 'System Admin', role: 'admin' },
  { email: 'student@gmail.com', password: 'password', name: 'Demo Student', role: 'student' }
];

// Mock Google Identity API Configuration
const GOOGLE_IDENTITY_API_KEY = "AIzaSyD-Mock-ApiKey-For-NeuroCalm";
const API_ENDPOINT = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  
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
    const user = MOCK_USERS.find(u => u.email === lowerEmail && u.password === password);

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
   */
  googleLogin: async (): Promise<AuthResponse> => {
    await delay(2000); // Simulate popup and consent screen

    // Simulating a successful OAuth response
    const isSuccess = true;

    if (isSuccess) {
      return {
        success: true,
        user: {
          name: 'Google User',
          email: 'google_user@gmail.com',
          role: 'student', // Default new users to student
          token: `oauth2-token-${Date.now()}`
        }
      };
    }

    return { success: false, error: 'OAuth Error: Google Sign-In failed.' };
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

    if (MOCK_USERS.find(u => u.email === lowerEmail)) {
      return { success: false, error: 'API Error: EMAIL_EXISTS. User already registered.' };
    }

    // "Save" to mock database
    MOCK_USERS.push({
      email: lowerEmail,
      password,
      name,
      role: 'student'
    });

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
