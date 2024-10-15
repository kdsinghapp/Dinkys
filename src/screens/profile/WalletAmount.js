/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { TextInput, View, Text, Modal, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core'

const AddMoneyModal = ({ modalVisible, setModalVisible, amount, setAmount, loading, add_wallet }) => {
  const navigation = useNavigation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          {/* Icon */}
          <View style={styles.iconWrapper}>
            <Image source={require('../../assets/wallet.png')} style={{ height: 40, width: 40 }} />
          </View>

          {/* Title */}
          <Text style={styles.modalTitle}>Add Money</Text>

          {/* Amount Input */}
          <TextInput
            value={amount}
            keyboardType="default"
            onChangeText={setAmount}
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#ccc"
          />

          {/* Message Input */}
          <TextInput placeholder="Message" style={styles.input} placeholderTextColor="#ccc" />

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.yesButton} onPress={add_wallet}>
              {loading ? <ActivityIndicator size={20} color="#fff" /> : <Text style={styles.buttonText}>Yes</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.noButton}
              onPress={() => {
                setModalVisible(false);
              
              }}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 10,
    backgroundColor: '#0BD89E',
    padding: 15,
    borderRadius: 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 5,
    fontSize: 16,
    color:'#000'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  yesButton: {
    flex: 1,
    backgroundColor: '#0BD89E',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  noButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddMoneyModal;
