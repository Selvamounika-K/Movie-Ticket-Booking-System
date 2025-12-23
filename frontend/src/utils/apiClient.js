// frontend/src/utils/apiClient.js
import axios from "axios";

const baseURL = "http://localhost:5000/api"; // FORCE LOCAL BACKEND FOR DEV

export const api = axios.create({
  baseURL
});