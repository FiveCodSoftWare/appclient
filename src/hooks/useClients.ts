import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types';
import * as api from '../services/api';
import moment from 'moment';

const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const pageSize = 10;

  const fetchClients = useCallback(async (search = '', page = 0, loadMore = false) => {
    if (!loadMore) {
      setLoading(true);
    }
    try {
        const start = page * pageSize;
        const { data: fetchedClients, meta } = await api.fetchClients(search, start, pageSize);

        setClients(prevClients => {
            if (!loadMore || page === 0) {
                return fetchedClients;
            } else {
                const existingIds = new Set(prevClients.map(client => client.id));
                const newClients = fetchedClients.filter(client => !existingIds.has(client.id));
                return [...prevClients, ...newClients];
            }
        });

        setTotalRecords(meta.recordsTotal);
        setCurrentPage(page);
        setSearchQuery(search);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
}, []);



  const fetchCountries = async () => {
    try {
      const fetchedCountries = await api.getCountries();
      setCountries(fetchedCountries);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchClients();
    fetchCountries();
  }, [fetchClients]);


  const loadMoreClients = () => {
    if (clients.length < totalRecords && !loading) {
      fetchClients(searchQuery, currentPage + 1, true);
    }
  };

  const addClient = async (clientData: ClientFormData) => {
    try {

      const formattedData: ClientFormData = {
        ...clientData,
        telefono: clientData.telefono || null,
        fecha_nacimiento: clientData.fecha_nacimiento
        ? moment(clientData.fecha_nacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      };

      await api.addClient(formattedData);
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const updateClient = async (id: number, clientData: ClientFormData) => {
    try {

      const formattedData: ClientFormData = {
        ...clientData,
        telefono: clientData.telefono || null,
        fecha_nacimiento: clientData.fecha_nacimiento
        ? moment(clientData.fecha_nacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      };

      await api.updateClient(id, formattedData);
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteClient = async (client: Client) => {
    try {
      await api.deleteClient(client.id);
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleClientStatus = async (client: Client) => {
    try {
      await api.toggleClientStatus(client.id, client.habilitado);
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    clients,
    countries,
    loading,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
    totalRecords,
    currentPage,
    loadMoreClients,
  };
};

export default useClients;

