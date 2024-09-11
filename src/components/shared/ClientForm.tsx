import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Client, ClientFormData } from '../../types';
import { validateAge, validateDate, validateEmail } from '../../utils/validators';
import { HelperText, TextInput } from 'react-native-paper';
import useClients from '../../hooks/useClients';
import moment from 'moment';

interface ClientFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: ClientFormData) => void;
  client: Client | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ visible, onClose, onSubmit, client }) => {
  const [formData, setFormData] = useState<ClientFormData>({
    nombre: '',
    apellidos: '',
    numero_documento: '',
    direccion: '',
    email: '',
    edad: '',
    telefono: '',
    fecha_nacimiento: '',
    pais: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCountries, setShowCountries] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { countries } = useClients();



  useEffect(() => {
    if (client) {
      const fechaFormateada = client.fecha_nacimiento ? moment(client.fecha_nacimiento).format('DD/MM/YYYY') : '';

      setFormData({
        nombre: client.nombre || '',
        apellidos: client.apellidos || '',
        direccion: client.direccion || '',
        numero_documento: client.numero_documento || '',
        email: client.email || '',
        edad: client.edad || '',
        telefono: client.telefono || '',
        fecha_nacimiento: fechaFormateada || '',
        pais: client.pais || '',
      });
    } else {
      setFormData({
        nombre: '',
        apellidos: '',
        direccion: '',
        numero_documento: '',
        email: '',
        edad: '',
        telefono: '',
        fecha_nacimiento: '',
        pais: '',
      });
    }
    setErrors({});
  }, [client, visible]);


  const handleChange = (name: keyof ClientFormData, value: string) => {
    const numericFields = ['numero_documento', 'edad', 'telefono'];
    const newValue = numericFields.includes(name) ? parseInt(value, 10) || '' : value;
    setFormData({ ...formData, [name]: newValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };


  const validateForm = () => {
    const error: { [key: string]: string } = {};
    if (!formData.nombre) {error.nombre = 'El nombre es requerido';}
    if (!formData.apellidos) {error.apellidos = 'Los apellidos son requeridos';}
    if (!formData.numero_documento) {error.numero_documento = 'El número de documento es requerido';}
    if (!formData.email) {
      error.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      error.email = 'El email no es válido';
    }
    if (!formData.edad) {
      error.edad = 'La edad es requerida';
    } else if (!validateAge(formData.edad, client ? 0 : 18)) {
      error.edad = client ? 'La edad debe ser mayor a 0' : 'El cliente debe ser mayor de 18 años';
    }
    if (formData.telefono && formData.telefono.toString().length < 9) {
      error.telefono = 'El teléfono debe tener al menos 7 dígitos';
    }

    if (formData.numero_documento && formData.numero_documento.toString().length !== 8) {
      error.numero_documento = 'El número de documento debe tener 8 dígitos.';
    }
    if (formData.fecha_nacimiento && formData.fecha_nacimiento.length > 0) {
      const date = moment(formData.fecha_nacimiento, 'DD/MM/YYYY', true);
      if (!date.isValid()) {
        error.fecha_nacimiento = 'Fecha inválida. Use DD/MM/YYYY';
      }
    }

    setErrors(error);
    return Object.keys(error).length === 0;
  };


  const handleDateChange = (text: string) => {
    const value = text.replace(/[^0-9]/g, '');
    let formatted = '';

    if (value.length > 0) {
      formatted += value.substr(0, 2);
      if (value.length > 2) {
        formatted += '/' + value.substr(2, 2);
        if (value.length > 4) {
          formatted += '/' + value.substr(4, 4);
        }
      }
    }

    handleChange('fecha_nacimiento', formatted);
    const errorMessage = validateDate(formatted);
    setErrors((prevErrors) => ({
      ...prevErrors,
      fecha_nacimiento: errorMessage || '',
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchText.toLowerCase())
  );




  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView  style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>{client ? 'Editar Cliente' : 'Agregar Cliente'}</Text>
          <TextInput
          style={styles.input}
            mode="outlined"
            label="Nombre (*)"
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
            error={!!errors.nombre}
          />
          <HelperText type="error" visible={!!errors.nombre}>
            {errors.nombre}
          </HelperText>

            <TextInput
          style={styles.input}
            mode="outlined"
            label="Apellidos (*)"
            value={formData.apellidos}
            onChangeText={(text) => handleChange('apellidos', text)}
            error={!!errors.apellidos}
          />
          <HelperText type="error" visible={!!errors.apellidos}>
            {errors.apellidos}
          </HelperText>

          <TextInput
          style={styles.input}
            mode="outlined"
            label="Número de Documento (*)"
            value={formData.numero_documento.toString()}
            onChangeText={(text) => handleChange('numero_documento', text)}
            keyboardType="numeric"
            maxLength={8}
            error={!!errors.numero_documento}
          />
          <HelperText type="error" visible={!!errors.numero_documento}>
            {errors.numero_documento}
          </HelperText>

          <TextInput
           style={styles.input}
            mode="outlined"
            label="Dirección  (?)"
            value={formData.direccion}
            onChangeText={(text) => handleChange('direccion', text)}
            error={!!errors.direccion}
          />
          <HelperText type="error" visible={!!errors.direccion}>
            {errors.direccion}
          </HelperText>

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Correo electrónico (*)"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            error={!!errors.email}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
          style={styles.input}
            mode="outlined"
            label="Edad (*)"
            value={formData.edad.toString()}
            onChangeText={(text) => handleChange('edad', text)}
            keyboardType="numeric"
            maxLength={3}
            error={!!errors.edad}
          />
          <HelperText type="error" visible={!!errors.edad}>
            {errors.edad}
          </HelperText>

          <TextInput
           style={styles.input}
            mode="outlined"
            label="Teléfono  (?)"
            value={formData.telefono.toString()}
            onChangeText={(text) => handleChange('telefono', text)}
            keyboardType="phone-pad"
            maxLength={9}
            error={!!errors.telefono}
          />
          <HelperText type="error" visible={!!errors.telefono}>
            {errors.telefono}
          </HelperText>

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Fecha de Nacimiento (?)"
            value={formData.fecha_nacimiento}
            onChangeText={handleDateChange}
            placeholder="DD/MM/YYYY"
            keyboardType="numeric"
            maxLength={10}
            error={!!errors.fecha_nacimiento}
          />
          <HelperText type="error" visible={!!errors.fecha_nacimiento}>
            {errors.fecha_nacimiento}
          </HelperText>

          <TouchableOpacity onPress={() => setShowCountries(!showCountries)}>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="País (?)"
                value={formData.pais}
                editable={false}
                error={!!errors.pais}
              />
            </TouchableOpacity>
            <HelperText type="error" visible={!!errors.pais}>
              {errors.pais}
            </HelperText>

            {showCountries && (
              <View>
                <TextInput
                mode="outlined"
                  style={styles.searchInput}
                  placeholder="Buscar país..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <ScrollView style={styles.countryList} nestedScrollEnabled={true}>
                  {filteredCountries.map((country, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        handleChange('pais', country);
                        setShowCountries(false);
                        setSearchText('');
                      }}
                      style={styles.countryItem}
                    >
                      <Text>{country}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '85%',
    maxHeight: '90%',
    paddingVertical: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    marginTop: 0,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#657BEA',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF7575',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  countryList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
    padding: 5,
  },
  countryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    borderRadius: 5,
    height: 40,
  },
});

export default ClientForm;
