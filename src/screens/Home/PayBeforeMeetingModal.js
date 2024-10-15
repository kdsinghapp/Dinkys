import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PayBeforeMeetingModal = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Pay before meeting</Text>

          <Text style={styles.modalText}>
            1. Upon payment, you’ll send a purchase <Text style={styles.boldText}>request</Text> to the seller.
          </Text>
          <Text style={styles.modalText}>
            2. If the seller accepts it, the item will be <Text style={styles.boldText}>reserved</Text>. If not, you’ll receive a refund.
          </Text>
          <Text style={styles.modalText}>
            3. The seller will only receive the payment when you confirm that you have received the product.
          </Text>

          <Text style={styles.modalText}>
            If you change your mind, you can cancel the purchase and receive a refund.
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
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

export default PayBeforeMeetingModal;
