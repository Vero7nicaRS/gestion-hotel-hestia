import axios from 'axios';

const API_URL = "http://localhost:8000/api/admin";

export const getReservas = async (estado = null) => {
  try {
    const url = estado ? `${API_URL}/reservas/?estado=${estado}` : `${API_URL}/reservas/`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const getReservaDetalle = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/reservas/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    throw error;
  }
};

export const cambiarEstadoReserva = async (id, estado) => {
  try {
    const response = await axios.patch(`${API_URL}/reservas/${id}/estado/`, {
      estado: estado
    });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    throw error;
  }
};
