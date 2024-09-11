import React, { useState } from 'react';
import { FlatList, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ClientItem from './ClientItem';
import { Client } from '../../types';
import { ActivityIndicator } from 'react-native-paper';

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  onRefresh: (search?: string) => void;
  onLoadMore: () => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onToggleStatus: (client: Client) => void;
  totalRecords: number;
  currentPage: number;
}

const ClientList: React.FC<ClientListProps> = ({   clients,
  loading,
  onRefresh,
  onLoadMore,
  onEdit,
  onDelete,
  onToggleStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onRefresh(searchQuery);
  };

  const renderItem = ({ item }: { item: Client }) => (
    <ClientItem
      client={item}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item)}
      onToggleStatus={() => onToggleStatus(item)}
    />
  );

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholderTextColor="#888"
          placeholder="Buscar clientes"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={clients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={() => onRefresh(searchQuery)}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fafafa',
  },
  searchButton: {
    color: '#fff',
    backgroundColor: '#657BEA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ClientList;
