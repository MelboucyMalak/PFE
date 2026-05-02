import axios from 'axios';

const API_URL = "https://torbati.onrender.com/api";

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