import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import HeaderTwo from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyButton from '../../elements/MyButton';
import { hp } from '../../utils/Constant';
import { errorToast } from '../../utils/customToast';
import PayinPersonModal from './PayinpersonModal';

import PayBeforeMeetingModal from './PayBeforeMeetingModal';
import PersonPaymentModal from './PersonPaymentModal';
import localizationStrings from '../Localization/Localization';

const MeetAndPay = () => {
  const [selectedOption, setSelectedOption] = useState(null);
const route = useRoute()
const [payInpersonModal,setpayInpersonModal] = useState(false)
const [payBeforemetting,setpayBeforemetting] = useState(false)
const [AmoutModalVisible,setAmoutModalVisible] = useState(false)

const {details, address ,shipping_charge } = route.params
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  const navigation = useNavigation()



  const _next = () => {


    if(selectedOption !== 'beforeMeeting'){

      setAmoutModalVisible(true)
    }
    else{

      navigation.navigate("PersionPayment", { details, address,shipping_charge })
    }


}
  
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <HeaderTwo navigation={navigation} title={localizationStrings.buy_in_per} />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>

        <Text style={styles.subHeader}>{localizationStrings.when_would}</Text>

        {/* Option 1: Pay Before Meeting */}
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === 'beforeMeeting' && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect('beforeMeeting')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.iconAndText}>
              <Image
              source={require('../../assets/paymetting.png')} // replace with actual icon
              style={styles.icon}
            />
              <Text style={styles.optionTitle}>
               {localizationStrings.pay_before}
              </Text>
            </View>
            <Text style={styles.radioButton}>
              {selectedOption === 'beforeMeeting' ? '●' : '○'}
            </Text>
          </View>
          <Text style={styles.optionText}>
            • {localizationStrings.pay_before_details1}
          </Text>
          <Text style={styles.optionText}>
            •  {localizationStrings.pay_before_details2}
          </Text>
          <Text style={styles.optionText}>
            •  {localizationStrings.pay_before_details}
          </Text>
          <View style={[styles.iconAndText,{marginTop:10}]}>
          <Pressable
            onPress={()=>{
              setpayBeforemetting(true)
            }}
            >
              <Image
              source={require('../../assets/letteri.png')}
              style={{height:20,width:20}}
            />
            </Pressable>
                   <Text style={styles.moreInfo}>{localizationStrings.more_info}</Text>
            </View>
        </TouchableOpacity>

        {/* Option 2: Pay In Person */}
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === 'inPerson' && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect('inPerson')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.iconAndText}>
              <Image
              source={require('../../assets/paypersion.png')}
              style={styles.icon}
            />
              <Text style={styles.optionTitle}>{localizationStrings.pay_per}</Text>
            </View>
            <Text style={styles.radioButton}>
              {selectedOption === 'inPerson' ? '●' : '○'}
            </Text>
          </View>
          <Text style={styles.optionText}>
            • {localizationStrings.pay_in_per_xt1}
          </Text>
          <Text style={styles.optionText}>
            • {localizationStrings.pay_in_per_xt2}
          </Text>
          <Text style={styles.optionText}>
            • {localizationStrings.pay_in_per_xt3}
          </Text>

          
          <View style={[styles.iconAndText,{marginTop:10}]}>
            <Pressable
            onPress={()=>{
              setpayInpersonModal(true)
            }}
            >

              <Image
              source={require('../../assets/letteri.png')}
              style={{height:20,width:20}}
              />
              </Pressable>
                   <Text style={styles.moreInfo}>{localizationStrings.more_info}</Text>
            </View>
     
        </TouchableOpacity>

        {/* Product Info */}
        <View style={styles.productInfo}>
        <View style={{ width:80, height:80, borderRadius: 12, overflow: "hidden" }}>
                        <Image source={{ uri: details?.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                    </View>
                    <View style={{marginLeft:15}}>
                    <Text  style={{ color: "#000",fontWeight:'700',fontSize:16 }}>
                            {details?.title}
                        </Text >
                      
                        <Text  style={{ color: "#C3C6C9",fontWeight:'500',fontSize:14 }}>
                            Colour: {details?.color}
                        </Text >
                 
                        <Text  style={{ color: "#04CFA4",fontWeight:'700',fontSize:16 }}>
                            € {details?.price}
                        </Text >
                    </View>
        </View>

        {/* Continue Button */}
        <MyButton onPress={_next} title={localizationStrings.continue} style={{ borderRadius: 12, marginVertical:10, width: "95%", alignSelf: "center" }} />
      </View>

      <PayinPersonModal    modalVisible={payInpersonModal}  setModalVisible={setpayInpersonModal}/>
      <PayBeforeMeetingModal    modalVisible={payBeforemetting}  setModalVisible={setpayBeforemetting}/>
      <PersonPaymentModal modalVisible={AmoutModalVisible} setModalVisible={setAmoutModalVisible}  price={199}
      withdraw={false}
      data={{ details, address,shipping_charge }}/>

      <View  style={{height:hp(5)}}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: 'white',
  
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000'
  },
  optionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  selectedOption: {
    borderColor: '#007bff',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  icon: {
    width: 40,
    height: 40,
    marginTop:5,
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',

  },
  newTag: {
    backgroundColor: '#f75883',
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 5,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  moreInfo: {
    color: '#007bff',
    fontSize: 14,
marginLeft:10
  },
  radioButton: {
    fontSize: 40,
    color: '#43ccbb'
  },
  productInfo: {
    flexDirection: 'row',
    paddingHorizontal:10,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor:'#eceff1',
    borderRadius:15,
    marginVertical:20,
    marginTop:hp(10),
    paddingVertical:10

  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  productDetails: {

borderRadius:20,
padding:10,

  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  continueButton: {
    
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MeetAndPay;
