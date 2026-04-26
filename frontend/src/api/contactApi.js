import axios from "axios";

const CONTACT_API_URL = "http://localhost:8000/api/contacto/";

export const enviarMensajeContacto = async (payload) => {
  const response = await axios.post(CONTACT_API_URL, payload);
  return response.data;
};