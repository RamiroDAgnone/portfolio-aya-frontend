import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback
} from "react";

import {
  saveAccessToken,
  clearTokens
} from "./tokenStorage";

import { API_URL } from "./constants";

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  saveUser: () => {},
  getUser: () => null,
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function requestNewAccessToken() {
    try {
      const response = await fetch(`${API_URL}/refreshtoken`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) return null;

      const json = await response.json();
      return json.accessToken || null;

    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  // Obtiene info usuario usando token
  async function getUserInfo(accessToken) {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });

      if (!response.ok) return null;

      return await response.json();

    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }

  // Verificar sesion activa
  const checkAuth = useCallback(async () => {
    const newAccessToken = await requestNewAccessToken();

    if (!newAccessToken) {
      //clearTokens();
      setIsLoading(false);
      return;
    }

    saveAccessToken(newAccessToken);

    const userInfo = await getUserInfo(newAccessToken);
    if (!userInfo) {
      clearTokens();
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);
    setUser(userInfo);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // usar al hacer login
  function saveUser({ user, accessToken }) {
    saveAccessToken(accessToken);
    setUser(user);
    setIsAuthenticated(true);
  }

  function getUser() {
    return user;
  }

  // logout 
  async function signOut() {
    try {
      await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        credentials: "include"
      });
    } catch {
    }

    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        saveUser,
        getUser,
        signOut,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const UseAuth = () => useContext(AuthContext);

export default AuthContext;