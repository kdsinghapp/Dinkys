import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';

const PayinPersonModal = ({ modalVisible, setModalVisible }) => {
    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Pay in person</Text>
              <Text style={styles.modalText}>1. Open a chat and meet with the seller.</Text>
              <Text style={styles.modalText}>
                2. When you are with the seller, return to this screen and click "Pay in person" to purchase the item.
              </Text>
              <Text style={styles.modalText}>
                3. Complete the payment by showing the seller the QR code you’ll see on the screen.
              </Text>
    
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    };
    
    const styles = StyleSheet.create({
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalView: {
        width: '90%',
        paddingVertical:60,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000',
      },
      modalText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
      },
      button: {
       position:'absolute',
       right:15,
       top:10,

      },
      buttonText: {
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
      },
    });
    

export default PayinPersonModal;
