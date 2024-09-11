import axios from 'axios';
import { Client, ClientFormData } from '../types';

const API_URL = 'http://192.168.1.3:8080/client';
const API_URL_PAIS = 'https://restcountries.com/v3.1';


export const getCountries = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL_PAIS}/all`);
    return response.data.map((country: any) => country.name.common).sort();
  } catch (error) {
    console.error('Error al obtener los paises:', error);
    throw error;
  }
};

export const fetchClients = async (search = '', start = 0, length = 10): Promise<{ data: Client[], meta: { recordsFiltered: number, recordsTotal: number } }> => {
  try {
    const response = await axios.get(`${API_URL}?search=${search}&start=${start}&length=${length}`);
    return response.data;
  } catch (error) {
    let errorMessage = 'Ocurrió un error al listar el cliente.';
    if (axios.isAxiosError(error) && error.response) {
      const serverError = error.response.data;
      if (serverError.error) {
        errorMessage = serverError.error;
      }
    }

    throw new Error(errorMessage);
  }
};

export const addClient = async (clientData: ClientFormData): Promise<Client> => {
  try {
    const response = await axios.post(API_URL, clientData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Ocurrió un error al agregar el cliente.';
    if (axios.isAxiosError(error) && error.response) {
      const serverError = error.response.data;
      if (serverError.error) {
        errorMessage = serverError.error;
      }
    }

    throw new Error(errorMessage);
  }
};

export const updateClient = async (id: number, clientData: ClientFormData): Promise<Client> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, clientData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Ocurrió un error al actualizar el cliente.';
    if (axios.isAxiosError(error) && error.response) {
      const serverError = error.response.data;
      if (serverError.error) {
        errorMessage = serverError.error;
      }
    }

    throw new Error(errorMessage);
  }
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    let errorMessage = 'Ocurrió un error al eliminar el cliente.';
    if (axios.isAxiosError(error) && error.response) {
      const serverError = error.response.data;
      if (serverError.error) {
        errorMessage = serverError.error;
      }
    }

    throw new Error(errorMessage);
  }
};

export const toggleClientStatus = async (id: number, currentStatus: boolean): Promise<Client> => {
  try {
    const endpoint = currentStatus ? 'deshabilitar' : 'habilitar';
    const response = await axios.patch(`${API_URL}/${id}/${endpoint}`);
    return response.data;
  } catch (error) {
    let errorMessage = 'Ocurrió un error al habilitar/deshabilitar el cliente.';
    if (axios.isAxiosError(error) && error.response) {
      const serverError = error.response.data;
      if (serverError.error) {
        errorMessage = serverError.error;
      }
    }

    throw new Error(errorMessage);
  }
};
