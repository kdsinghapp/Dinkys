import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import ProfileHeader from '../../components/ProfileHeader';
import { DOMAIN } from '../../services/Config';
import { useDispatch, useSelector } from 'react-redux';
import { SuccessToast } from 'react-native-toast-message';
import { successToast } from '../../utils/customToast';


export default function AddCertificate() {
  const A4_WIDTH = 2480; // Width in pixels for 300 DPI A4 paper
  const A4_HEIGHT = 3508; // Height in pixels for 300 DPI A4 paper
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const route = useRoute()
const {vehicleDetails} = route.params
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [licenseImage, setLicenseImage] = useState(null);
  const [peopleTransportImage, setPeopleTransportImage] = useState(null);
  const userDetailData = useSelector((state) => state.user.user)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  useFocusEffect(
    React.useCallback(() => {
       
        _get_profile()
    }, [])
)
  const openImagePicker = (setImage) => {
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
        setImage(newImage);
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

  const Add_Vehical_details =()=>{
   
    if(!insuranceImage || !peopleTransportImage ||!licenseImage) {
      return errorToast('Please Upload All Document')
  
  }

setLoading(true)
var formdata = new FormData();
formdata.append("driver_id", user?.driver_data?.driver_id);
formdata.append("vehicle_service_type", vehicleDetails.serviceType);
formdata.append("vehicle_brand", vehicleDetails.brand);
formdata.append("vehicle_model", vehicleDetails.model);
formdata.append("vehicle_buy_date", vehicleDetails.manufacturer);
formdata.append("vehicle_number_plate", vehicleDetails.numberPlate);
formdata.append("vehicle_color", vehicleDetails.color);
formdata.append("driving_license_image", licenseImage);
formdata.append("transport_license_image", peopleTransportImage);
formdata.append("insurance_image", insuranceImage);
formdata.append("vehicle_image", vehicleDetails.vehicleImage);
const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
};
fetch(`${DOMAIN}save-driver-details`, requestOptions)
    .then((response) => response.json())
    .then(async (res) => {
        if (res.status == "1") {
            console.log('res.status',res.status);
            successToast("Driver Details registered successfully!",3000)
            navigation.navigate('TabNavigator')
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
      {/* {isLoading && <Loading />}
    */}

      <ProfileHeader name="Add Certificate" Dwidth="36%" />

      <TouchableOpacity
        style={styles.uploadContainer}
        onPress={() => openImagePicker(setInsuranceImage)}
      >
        {insuranceImage ? (
          <Image source={{ uri: insuranceImage.uri }} style={styles.uploadedImage} resizeMode='contain'/>
        ) : (
          <>
            <Image source={require('../../assets/dinkyimg/Upload.png')} style={styles.uploadIcon}  />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadText}>Upload Insurance</Text>
            </View>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.uploadContainer}
        onPress={() => openImagePicker(setLicenseImage)}
      >
        {licenseImage ? (
          <Image source={{ uri: licenseImage.uri }} style={styles.uploadedImage} resizeMode='contain'/>
        ) : (
          <>
            <Image source={require('../../assets/dinkyimg/Upload.png')} style={styles.uploadIcon} />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadText}>Upload Driving License</Text>
            </View>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.uploadContainer}
        onPress={() => openImagePicker(setPeopleTransportImage)}
      >
        {peopleTransportImage ? (
          <Image source={{ uri: peopleTransportImage.uri }} style={styles.uploadedImage}  resizeMode='contain'/>
        ) : (
          <>
            <Image source={require('../../assets/dinkyimg/Upload.png')} style={styles.uploadIcon} />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadText}>Transport of People License</Text>
            </View>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: hp(7) }} />
      <TouchableOpacity 
      onPress={()=>{
        Add_Vehical_details()
       
      }}
      style={styles.continueButton}>
       {loading?<ActivityIndicator  size={30} color={'#fff'} />:  <Text style={styles.continueButtonText}>Go Home</Text>}
      </TouchableOpacity>
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
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  iosHeaderSpacing: {
    height: 68,
  },
  androidHeaderSpacing: {
    height: 10,
  },
  uploadContainer: {
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
    width:300,
    borderRadius: 10,
  },
});
