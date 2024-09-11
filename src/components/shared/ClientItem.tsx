import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Client } from '../../types';
import moment from 'moment';

interface ClientItemProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const ClientItem: React.FC<ClientItemProps> = ({ client, onEdit, onDelete, onToggleStatus }) => {
  const fechaFormateada = client.fecha_nacimiento ? moment(client.fecha_nacimiento).format('DD/MM/YYYY') : '';
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{`${client.nombre.charAt(0)}${client.apellidos.charAt(0)}`}</Text>
          <Text style={styles.age}>{client.edad}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{`${client.nombre} ${client.apellidos}`}</Text>
          <Text style={styles.infoText}>N°: {client.numero_documento}</Text>
          {client.direccion && <Text style={styles.infoText}>{client.direccion}</Text>}
          <View style={styles.contactInfo}>
            <Text style={styles.email}>{client.email}</Text>
            {client.telefono && <Text style={styles.phone}>{client.telefono}</Text>}
            {fechaFormateada && <Text style={styles.birthDate}>{fechaFormateada}</Text>}
            {client.pais &&  <Text style={styles.country}>{client.pais}</Text>}
          </View>
        </View>
        <View style={styles.status}>
          <TouchableOpacity onPress={onToggleStatus} style={[styles.statusButton, client.habilitado ? styles.enabled : styles.disabled]}>
            <Text style={styles.statusText}>{client.habilitado ? 'Habilitado' : 'Deshabilitado'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.buttonEdit]} onPress={onEdit}>
          <Text style={styles.buttonText}>{'Editar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={onDelete}>
          <Text style={styles.buttonText}>{'Eliminar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

 avatar: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#3BC09B',
    borderRadius: 50,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 40,
  },

  age: {
    color: '#FFFFFF',
    backgroundColor: '#657BEA',
    marginTop: 4,
    fontSize: 12,
    padding: 4,
    borderRadius: 3,
  },

  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  infoText: {
    fontSize: 12,
    color: '#666',
  },

  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  email: {
    marginRight: 10,
    borderRadius: 5,
    padding: 4,
    backgroundColor: '#DFDFDF',
    fontSize: 12,
    color: '#657BEA',
    marginTop: 5,
  },

  phone: {
    marginRight: 10,
    borderRadius: 5,
    padding: 4,
    backgroundColor: '#DFDFDF',
    fontSize: 12,
    color: '#657BEA',
  },

  birthDate: {
    borderRadius: 5,
    padding: 4,
    backgroundColor: '#DCDADA',
    fontSize: 12,
    marginRight: 5,
    color: '#555B79',
  },

  country: {
    marginTop: 5,
    borderRadius: 5,
    padding: 4,
    backgroundColor: '#8FC7C2',
    fontSize: 12,
    color: '#555B79',
  },
  status: {
    alignSelf: 'flex-start',
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  enabled: {
    backgroundColor: '#3BC09B',
  },
  disabled: {
    backgroundColor: '#FF7575',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },

  button: {
    padding: 3,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    margin: 5,
  },

  buttonEdit: {
    backgroundColor: '#657BEA',
  },

  buttonDelete: {
    backgroundColor: '#FF6161',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ClientItem;
