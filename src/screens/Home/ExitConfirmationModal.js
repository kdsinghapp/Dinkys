// ExitConfirmationModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Navigation from '../../navigation/Index';
import { useNavigation } from '@react-navigation/native';

const ExitConfirmationModal = ({ modalVisible, setModalVisible }) => {

    const navigation = useNavigation()
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Image/Icon */}
          <Image 
            source={require('../../assets/exit.png')} 
            style={styles.exitImage} 
          />

          {/* Title */}
          <Text style={styles.modalTitle}>Are you sure you want to exit?</Text>

          {/* Description */}
          <Text style={styles.modalDescription}>
            You will be taken back to the previous page.
          </Text>

          {/* Buttons */}
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={() => {setModalVisible(false)}}
          >
            <Text style={styles.continueButtonText}>Continue to payment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.exitButton} 
            onPress={() => {
                navigation.goBack()
            }}
          >
            <Text style={styles.exitButtonText}>Yes, exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  exitImage: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  continueButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    color: '#000',
  },
  exitButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#0BD89E',
    borderRadius: 5,
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ExitConfirmationModal;
