 


 import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  StyleSheet
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


import ImagePicker from 'react-native-image-crop-picker';
import ProfileHeader from '../../components/ProfileHeader';
import { DOMAIN } from '../../services/Config';
import { useDispatch, useSelector } from 'react-redux';
import localizationStrings from '../Localization/Localization';

export default function DriverDocument() {
  const [serviceType, setServiceType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [color, setColor] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null);
  const [urlImage, setUrlImage] = useState('');
  const [validationError, setValidationError] = useState({});
  const A4_WIDTH = 2480; // Width in pixels for 300 DPI A4 paper
  const A4_HEIGHT = 3508; // Height in pixels for 300 DPI A4 paper
  const [user, setUser] = useState(null)
  const isLoading = false;
  const navigation = useNavigation();
  const userDetailData = useSelector((state) => state.user.user)

  const dispatch = useDispatch()

  useFocusEffect(
    React.useCallback(() => {
       
        _get_profile()
    }, [])
)

useEffect(()=>{
   
    if(user){
 
        setVehicleImage({uri:user?.driver_details_data?.vehicle_image})
        setServiceType(user?.driver_details_data?.vehicle_service_type)
        setBrand(user?.driver_details_data?.vehicle_brand)
        setModel(user?.driver_details_data?.vehicle_model)
        setManufacturer(user?.driver_details_data?.vehicle_buy_date)
        setNumberPlate(user?.driver_details_data?.vehicle_number_plate)
        setColor(user?.driver_details_data?.vehicle_color)
        setUrlImage(user?.driver_details_data?.vehicle_image)
     
    }
  },[user])


const _get_profile = () => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    fetch(`${DOMAIN}get-profile`, requestOptions)
        .then((response) => response.json())
        .then(async (res) => {
            if (res.status == "1") {
                dispatch({ type: "WALLET", payload: res?.data?.wallet });
                setUser(res?.data)
            }
        }).catch((err) => {
            console.log("err", err)
        })
}
  const handleNextPress = () => {
    const errors = {};
    if (!serviceType) errors.serviceType = true;
    if (!brand) errors.brand = true;
    if (!model) errors.model = true;
    if (!manufacturer) errors.manufacturer = true;
    if (!numberPlate) errors.numberPlate = true;
    if (!color) errors.color = true;
    if (!vehicleImage) errors.vehicleImage = true;

    if (Object.keys(errors).length > 0) {
      setValidationError(errors);
    } else {
      const vehicleDetails = {
        serviceType,
        brand,
        model,
        manufacturer,
        numberPlate,
        color,
        vehicleImage,
      };
      navigation.navigate('DriverCertificate', { vehicleDetails });
    }
  };

  const openImageLibrary = () => {
    ImagePicker.openPicker({
      width: A4_WIDTH,
    height: A4_HEIGHT,
    cropping: true,
    compressImageMaxWidth: A4_WIDTH,
    compressImageMaxHeight: A4_HEIGHT,
    compressImageQuality: 0.8,
    })
      .then(image => {
        const newImage = {
          uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
          type: image.mime,
          name: `${Date.now()}.png`,
        };
        setVehicleImage(newImage);
        setUrlImage(image.path);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      {/* {isLoading ? <Loading /> : null}
      */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader name={localizationStrings.vehicle_details}  />
        <TouchableOpacity
          style={[
            styles.imageUploadContainer,
            validationError.vehicleImage && styles.errorBorder,
          ]}
          onPress={openImageLibrary}
        >
          {urlImage ? (
            <Image source={{ uri: urlImage }} style={styles.uploadedImage} resizeMode='contain' />
          ) : (
            <>
              <Image
                source={require('../../assets/dinkyimg/Upload.png')}
                style={styles.uploadIcon}
              />
              <View style={styles.uploadTextContainer}>
                <Text style={styles.uploadText}>Upload Vehicle Picture</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.inputFieldsContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Type</Text>
            <TextInput
              placeholder="Service Type"
              placeholderTextColor={'#ADA4A5'}
              style={[
                styles.textInput,
                validationError.serviceType && styles.errorBorder,
              ]}
              value={serviceType}
              onChangeText={setServiceType}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              placeholder="Brand (Auto Suggestion)"
              placeholderTextColor={'#ADA4A5'}
              style={[
                styles.textInput,
                validationError.brand && styles.errorBorder,
              ]}
              value={brand}
              onChangeText={setBrand}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              placeholder="Model (Auto Suggestion)"
              placeholderTextColor={'#ADA4A5'}
              style={[
                styles.textInput,
                validationError.model && styles.errorBorder,
              ]}
              value={model}
              onChangeText={setModel}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Manufacturer</Text>
            <TextInput
              placeholder="Manufacturer (Auto Suggestion)"
              placeholderTextColor={'#ADA4A5'}
              style={[
                styles.textInput,
                validationError.manufacturer && styles.errorBorder,
              ]}
              value={manufacturer}
              onChangeText={setManufacturer}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number Plate</Text>
            <TextInput
              placeholder="Number Plate"
              placeholderTextColor={'#ADA4A5'}
              style={[
                styles.textInput,
                validationError.numberPlate && styles.errorBorder,
              ]}
              value={numberPlate}
              onChangeText={setNumberPlate}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Color</Text>
            <TextInput
              placeholder="Color"
              placeholderTextColor={'#ADA4A5'}
              style={[
                styles.textInput,
                validationError.color && styles.errorBorder,
              ]}
              value={color}
              onChangeText={setColor}
            />
          </View>
        </View>

        <TouchableOpacity 
      onPress={()=>{

        handleNextPress()
      }}
      style={styles.continueButton}>
        <Text style={styles.continueButtonText}>{localizationStrings.next}</Text>
      </TouchableOpacity>

        <View  style={{height:20}}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    continueButton: {
        height: 55,
        backgroundColor: '#0BD89E',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      
        bottom:10,
        width:'100%',
        alignSelf:'center'
      },
      continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  iosHeaderSpacing: {
    height: 68,
  },
  androidHeaderSpacing: {
    height: 10,
  },
  imageUploadContainer: {
    backgroundColor: '#F7F8F8',
    height: hp(22),
    marginTop: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    height: 45,
    width: 45,
  },
  uploadTextContainer: {
    marginTop: 15,
  },
  uploadText: {
    color: '#949494',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  uploadedImage: {
    height:150,
    width: 350,
    borderRadius: 10,
  },
  inputFieldsContainer: {
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#F7F8F8',
    paddingHorizontal: 15,
    height: 66,
    borderRadius: 40,
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  nextButton: {
    backgroundColor: '#5A67D8',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  nextButtonText: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 25.5,
  },
});
