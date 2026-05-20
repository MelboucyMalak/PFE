import axios from 'axios';

const API_URL = "https://torbati.onrender.com/api";
///const API_URL = "http://127.0.0.1:8000/api";


// NORMAL AUTHENTICATION
export const signUpUser = async (userData) => {
  try { 
    const response = await axios.post(`${API_URL}/sign-up`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data;

  } catch (error) {
    // --- C'EST ICI QU'ON CHERCHE L'ERREUR ---
    
    const data = error.response?.data; // 1. On regarde ce que le serveur a renvoyé
    let finalMessage = "Erreur inconnue";

    if (data) {
      // 2. On prend la première clé (ex: "username" ou "password")
      const firstErrorField = Object.keys(data)[0];
      
      // 3. On prend le message d'erreur
      const errorValue = data[firstErrorField];

      // Si c'est une liste (ex: ["Ce champ est requis"]), on prend le premier texte
      if (Array.isArray(errorValue)) {
        finalMessage = errorValue[0];
      } else {
        finalMessage = errorValue;
      }
    }

    // 4. On envoie le message propre au composant
    throw new Error(finalMessage);
  }
};


export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    // Django returns: { message, token, admin }
    return response.data; // { message: "Login Success", token: "abc123", admin: true/false }

  } catch (error) {
    
    const finalMessage = error.response?.data?.error || "Erreur inconnue";
    throw new Error(finalMessage);
  }
};

// FOEGOT PASSWORD RELATED THINGS 
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data; // { status: "OK" }
  } catch (error) {
    const data = error.response?.data;
    const finalMessage =
      data?.email?.[0] ||
      data?.error ||
      "Erreur inconnue";

    throw new Error(finalMessage);
  }
};

export const verifyCode = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/verify-password`, { code });
    return response.data; 
  } catch (error) {
    const finalMessage = error.response?.data?.error || "Erreur inconnue";
    throw new Error(finalMessage);
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, password });
    return response.data;
  } catch (error) {
    const finalMessage = error.response?.data?.error || "Erreur inconnue";
    throw new Error(finalMessage);
  }
};