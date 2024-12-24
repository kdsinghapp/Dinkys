import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import Back from '../../assets/svg/Back.svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import { errorToast } from '../../utils/customToast';
import { useDispatch, useSelector } from 'react-redux';
import { DOMAIN } from '../../services/Config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import localizationStrings from '../Localization/Localization';
const DeliveryScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
  // State management for TextInput fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [homeAddress1, setHomeAddress1] = useState('');
  const [homeAddress2, setHomeAddress2] = useState('');
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()
  const userDetailData = useSelector((state) => state.user.user)
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [cifNif, setCifNif] = useState('');

  // State management for the profile image
  const [profileImage, setProfileImage] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
       
        _get_profile()
    }, [])
)
  useEffect(()=>{
    requestGalleryPermission()
  },[])
  const requestGalleryPermission = async () => {
    const permissionType =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY;

    const result = await request(permissionType);

    if (result === 'granted') {
     console.log('granted');
    } else {
      //Alert.alert('Permission Denied', 'You need to give permission to access the gallery.');
    }
  };
  // Function to open the image picker
  const openImagePicker = () => {

    ImagePicker.openPicker({
      width: 900,
      height: 900,
      cropping: true,
    })
      .then(image => {
        const newImage = {
          uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
          type: image.mime,
          name: `${Date.now()}.png`,
        };
        setProfileImage(newImage);
      })
      .catch(err => {
        console.log(err);
      });
  };

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


  const checkAllFileld =()=>{
if(!firstName || !lastName || !mobileNumber ||!city||  !homeAddress2 ||!email || !cifNif ||!companyName ) {
    return errorToast('all fields are mandatory')

}
if(!profileImage  ) {
    return errorToast('Profile photo is require')

}
setLoading(true)
var formdata = new FormData();
formdata.append("user_id", user?.id);
formdata.append("driver_first_name", firstName);
formdata.append("driver_last_name", lastName);
formdata.append("driver_address_1", homeAddress1?.place?homeAddress1?.place:'');
formdata.append("driver_address_2", homeAddress2);
formdata.append("driver_mobile_number", mobileNumber);
formdata.append("driver_city", city);
formdata.append("driver_lat", homeAddress1?.lat?homeAddress1?.lat:'');
formdata.append("driver_long", homeAddress1?.lng?homeAddress1?.lat:'');
formdata.append("driver_email", email);
formdata.append("driver_company_name", companyName);
formdata.append("driver_cif_nif", cifNif);
formdata.append("driver_images", profileImage);
const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
};
fetch(`${DOMAIN}register-driver`, requestOptions)
    .then((response) => response.json())
    .then(async (res) => {
        if (res.status == "1") {
            console.log('res.status',res.status);
            navigation.navigate('VehicleDetails')
            setLoading(false)
        } else {
            errorToast(res?.message, 3000)
        }
    }).catch((err) => {
        console.log("err", err)
    }).finally(() => {
        setLoading(false)
    })

  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', marginTop: 10 }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Back />
        </TouchableOpacity>

        <Text style={styles.title}>{localizationStrings.deliver}</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={profileImage ? { uri: profileImage.uri } : require('../../assets/dinkyimg/dp.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity 
          style={styles.cameraIconContainer} 
          onPress={openImagePicker}
        >
          <Image
            source={require('../../assets/dinkyimg/Camera.png')}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>
      <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F8F8F8',
                        borderRadius: 12,
                        borderColor: "#EBEBEB",
                        borderWidth: 1,
                    }}>

                    <GooglePlacesAutocomplete
                        scrollEnabled={false}
                        fetchDetails={true}
                        GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                        placeholder={"Home Address 1"}
                        onPress={(data, details = null) => {
                            setHomeAddress1({ ...homeAddress1, lat: details?.geometry?.location?.lat, lng: details?.geometry?.location?.lng, place: data.description });
                        }}
                        styles={{
                        textInputContainer:{
                        backgroundColor:'#F8F8F8'
                        },
                            description: {
                                fontWeight: 'bold',
                                color: 'black',
                                width: '100%',
                              
                            },
                            container: {
                                padding:5,
                               
                            },
                            textInput: {
                                fontSize: 13,
                                color: '#000',
                                height: '100%',
                                width: '100%',
                            },
                        }}
                        textInputProps={{
                            placeholderTextColor: "#000"
                        }}
                        query={{
                            key: 'AIzaSyBQDSvBppnW59UJ0ALOlGV5aMiJl6bgk70',
                            language: 'en',
                        }}
                    />
                </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      <TextInput 
        style={styles.input} 
        placeholder={localizationStrings.first_name}
        value={firstName} 
        onChangeText={setFirstName} 
        placeholderTextColor={"#000"}
      />
      <TextInput 
        style={styles.input} 
        placeholder={localizationStrings.last_name}
        value={lastName} 
        onChangeText={setLastName} 
        placeholderTextColor={"#000"}
      />
      <TextInput
          style={styles.input}
          placeholder={localizationStrings.Company_applicable}
          value={companyName}
          onChangeText={setCompanyName}
          placeholderTextColor="#000"
        />
        <TextInput
          style={styles.input}
          placeholder={localizationStrings.email}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#000"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="CIF/NIF"
          value={cifNif}
          onChangeText={setCifNif}
          placeholderTextColor="#000"
        />
      <TextInput 
        style={styles.input} 
        placeholder={localizationStrings.mobile_number}
        value={mobileNumber} 
        onChangeText={setMobileNumber} 
        placeholderTextColor={"#000"}
        keyboardType="phone-pad" 
      />
      <TextInput 
        style={styles.input} 
        placeholderTextColor={"#000"}
        placeholder={localizationStrings.city}
        value={city} 
        onChangeText={setCity} 
      />
         
      <TextInput 
        style={styles.input} 
        placeholder={localizationStrings.home_ad1}
        placeholderTextColor={"#000"}
        value={homeAddress2} 
        onChangeText={setHomeAddress2} 
      />

      <TouchableOpacity 
        onPress={() => {
            checkAllFileld()
        }} 
        style={styles.continueButton}
      >
       {loading?<ActivityIndicator  size={30} color={'#fff'} />: <Text style={styles.continueButtonText}>{localizationStrings.continue}</Text>}
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: '33%',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginVertical: 35,
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0', // Placeholder background color
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: -15,
    width: 40,
    height: 40,
    borderRadius: 15,
    right: 0,
  },
  cameraIcon: {
    width: 30,
    height: 30,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    color:'#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
    marginTop: 10,
  },
  continueButton: {
    height: 55,
    backgroundColor: '#0BD89E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    
    bottom: 10,
    width: '100%',
    alignSelf: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeliveryScreen;
