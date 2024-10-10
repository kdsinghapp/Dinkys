import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import HeaderTwo from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';

const PersionPayment = () => {
const navigation = useNavigation()
const route = useRoute()

const {details, address ,shipping_charge } = route.params

    return (
        <View style={styles.container}>
             <HeaderTwo navigation={navigation} title={"Payment"} />
             <View style={styles.walletSection}>
             <Image source={require('../../assets/wallet.png')} style={styles.walletIcon} /> 
  
               <Text style={styles.walletText}>When you have balance in the wallet, you can pay with it.</Text>
           </View>

           <View style={styles.cardSection}>
                <View style={styles.cardInfo}>
                   
                   <Image source={require('../../assets/card.png')} style={styles.walletIcon} /> 
                    <Text style={styles.cardText}>Card €0.12</Text>
                </View>
                <TouchableOpacity style={styles.addCardButton}>
                    <Text style={styles.addCardText}>Add card</Text>
                </TouchableOpacity>
            </View>
    

         

       
        


        

           
            <View style={styles.productSummary}>
            <Image source={{uri:details?.product_images?.[0].image}} style={{height:80,width:80,borderRadius:15}} /> 
                <View style={{marginLeft:15}}>
                    <Text style={styles.productName}>{details?.title}</Text>
                    <Text style={styles.totalText}>Total: €{details?.price}</Text>
                    <Text style={styles.feeText}>It includes payment fees.</Text>
                </View>
            </View>
      
            
            <TouchableOpacity style={styles.continueButton} 
            
            >
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity> 
         
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backText: {
        fontSize: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    helpText: {
        fontSize: 16,
        color: '#00AAFF',
    },
    walletSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
    },
    walletIcon: {
        width:40,
        height:40,
        marginRight: 12,
    },
    walletText: {
        width:'80%',
        fontSize: 14,
        color: '#333',
       
    },
    cardSection: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginBottom: 24,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
    addCardButton: {
        marginTop: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#0BD89E',
        borderRadius: 6,
        alignItems: 'center',
    },
    addCardText: {
        color: '#0BD89E',
        fontSize: 14,
        fontWeight:'500'
    },
    productSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        marginBottom: 24,
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalText: {
        fontSize: 16,
        color: '#333',
    },
    feeText: {
        fontSize: 12,
        color: '#888',
    },
    continueButton: {
        backgroundColor: '#0BD89E',
        paddingVertical: 16,
        borderRadius:30,
        alignItems: 'center',
        marginTop:60
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight:'600'
    },
});

export default PersionPayment;
