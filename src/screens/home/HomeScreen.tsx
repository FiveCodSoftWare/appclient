import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ClientList from '../../components/shared/ClientList';
import { Client, ClientFormData } from '../../types';
import useClients from '../../hooks/useClients';
import ClientForm from '../../components/shared/ClientForm';
import FloatingActionButton from '../../components/shared/FloatingActionButton';
import { Button, Dialog, Snackbar, Text } from 'react-native-paper';

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);



  const { clients, loading, totalRecords,
    currentPage, fetchClients, loadMoreClients, addClient, updateClient, deleteClient, toggleClientStatus } = useClients();



  const handleAddClient = () => {
    setSelectedClient(null);
    setModalVisible(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setModalVisible(true);
  };

  const handleFormSubmit = async (formData: ClientFormData) => {
    if (selectedClient) {
      await updateClient(selectedClient.id, formData);
    } else {
      await addClient(formData);
    }
    setModalVisible(false);
    fetchClients();
  };


  const handleDeleteClient = (client: Client) => {
    if (client.edad <= 80) {
      setSnackbarMessage('No se puede eliminar un cliente de 80 años o menos.');
      setSnackbarVisible(true);
    } else {
      setClientToDelete(client);
      setDialogVisible(true);
    }
  };

  const confirmDeleteClient = async () => {
    if (clientToDelete) {
      await deleteClient(clientToDelete);
      setDialogVisible(false);
    }
  };

  const cancelDelete = () => {
    setDialogVisible(false);
    setClientToDelete(null);
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

  return (
    <View style={styles.container}>
      <ClientList
        clients={clients}
        loading={loading}
        onRefresh={fetchClients}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        onToggleStatus={toggleClientStatus}
        onLoadMore={loadMoreClients}
        totalRecords={totalRecords}
        currentPage={currentPage}

      />
      <FloatingActionButton onPress={handleAddClient} />
      <ClientForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        client={selectedClient}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={handleSnackbarDismiss}
        duration={Snackbar.DURATION_SHORT}
        action={{
          label: 'OK',
          onPress: () => handleSnackbarDismiss(),
        }}>
        {snackbarMessage}
      </Snackbar>

      <Dialog visible={dialogVisible} onDismiss={cancelDelete}>
        <Dialog.Title>Confirmación</Dialog.Title>
        <Dialog.Content>
          <Text>¿Estás seguro de que quieres eliminar este cliente?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={[styles.button, styles.buttonEdit]} onPress={cancelDelete}> <Text style={styles.buttonText}>{'Cancelar'}</Text></Button>
          <Button style={[styles.button, styles.buttonDelete]} onPress={confirmDeleteClient}> <Text style={styles.buttonText}>{'Eliminar'}</Text></Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    color: 'white',
    textAlign: 'center',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonEdit: {
    color: 'white',
    backgroundColor: '#657BEA',
  },

  buttonDelete: {
    color: 'white',
    backgroundColor: '#FF6161',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default HomeScreen;
