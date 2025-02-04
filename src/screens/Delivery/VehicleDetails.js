import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Share
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


import ImagePicker from 'react-native-image-crop-picker';
import ProfileHeader from '../../components/ProfileHeader';
import localizationStrings from '../Localization/Localization';
import { DOMAIN } from '../../services/Config';
import { useDispatch, useSelector } from 'react-redux';
import MapPickerModal from '../../components/MapPicker';
import { errorToast, successToast } from '../../utils/customToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PickupSeller from './PickupSeller';

export default function VehicleDetails({ navigation }) {
  const [validationStatus, setValidationStatus] = useState({
    professionalSellers: 0,
    pickupPoints: 0,
    appShares: 0,
  });
  const dispatch = useDispatch()
  const [sellersListVisible, setSellersListVisible] = useState(false);
  const [pickupPointsListVisible, setPickupPointsListVisible] = useState(false);
  const [user, setUser] = useState(null)

const [loading,setLoading] = useState(false)

  const [pickupModalVisible, setpickupModalVisible] = useState(false)
  const [sellerModalVisible, setsellerModalVisible] = useState(false)
  const [PickupLocation, setPickupLocation] = useState('')
  const [PickupLocationName, setPickupLocationName] = useState(false)

  const [pickupPoints, setpickupPoints] = useState([])
  const [sellers, setsellers] = useState([])
  const [AppshareCount, setAppSharecount] = useState(0)
  const userDetailData = useSelector((state) => state.user.user)


  useFocusEffect(
    React.useCallback(() => {

      _get_profile()
    }, [])
  )

  const get_update_count = async () => {
    const AppShare = await AsyncStorage.getItem('appShares')


    setAppSharecount(AppShare)
  }

  useEffect(() => {
    get_pickupPoint()
    get_saller_list()
  }, [user, sellerModalVisible])

  const _get_profile = async () => {

    const AppShare = await AsyncStorage.getItem('appShares')


    setAppSharecount(AppShare)
    console.log('getAppShare', AppShare);

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


  const get_pickupPoint = () => {
    const formdata = new FormData();
    formdata.append("driver_id", user?.driver_data?.driver_id);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://panel.dkyss.es/api/get-pickup-points", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result)
        setpickupPoints(res.data);

      })
      .catch((error) => console.error(error));
  }
  const get_saller_list = () => {
    const formdata = new FormData();
    formdata.append("driver_id", user?.driver_data?.driver_id);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://panel.dkyss.es/api/get-professional-sellers-connect", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result)
        setsellers(res.data);

      })
      .catch((error) => console.error(error));
  }





  useEffect(() => {

    _add_pickup_points()
  }, [pickupModalVisible])
  const _add_pickup_points = async () => {
    console.log('AddressLocation', PickupLocation);


    if (!PickupLocation?.latitude || !PickupLocation?.longitude) return
    const formdata = new FormData();
    formdata.append("driver_id", user?.driver_data?.driver_id);
    formdata.append("location", PickupLocationName);
    formdata.append("lat", PickupLocation?.latitude);
    formdata.append("long", PickupLocation?.longitude);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://panel.dkyss.es/api/add-pickup-points", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result)

        if (res.status == '1') {

          get_pickupPoint()
          successToast("Pickup Points Added Succussfully")
        }

      })
      .catch((error) => console.error(error));

  }


  const handleValidationUpdate2 = async (key) => {
    try {
      const currentCount = await AsyncStorage.getItem(key);
      const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
      await AsyncStorage.setItem(key, newCount.toString());
      console.log(`${key} updated:`, newCount);
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out this amazing app! Download it here: https://yourwebsite.com/yourapp',
      });

      if (result.action === Share.sharedAction) {
        if (!result.activityType) {
          console.log('App link shared');
          handleValidationUpdate2('appShares'); // Track the share locally
          get_update_count()
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing app link:', error);
    }
  };

  const check_validation_process = () => {

    if (sellers?.length < 7) return errorToast('Please Add 7 Sellers First')
    if (pickupPoints?.length < 7) return errorToast('Please Add 7 Pickup Point  First')
    if (AppshareCount < 100) return errorToast('Please Share 100 User First')
      setLoading(true)


    const formdata = new FormData();
    formdata.append("driver_id", user?.driver_data?.driver_id);
    formdata.append("driver_details", "true");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://panel.dkyss.es/api/update_driver_data", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result)
        if (res.status == '1') {
      
          successToast('Validation Process Successfully Complete')
          navigation.navigate('TabNavigator')
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error(error)
      
  });
  }



  return (
    <View style={styles.container}>
      {/* {isLoading ? <Loading /> : null}
      */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader name={localizationStrings.validation_process} Dwidth={'42%'} />




        <View style={styles.validation}>
          {/* Professional Sellers Validation */}
          <View style={[styles.validationItem, { padding: 15, borderRadius: 15 }]}>
            <Text style={{ fontWeight: '600', fontSize: 16, color: '#000' }}>
             {localizationStrings.professional_sellers}: {sellers?.length}/7
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={() => setSellersListVisible(!sellersListVisible)}
              >
                <Text style={styles.buttonText}>
                  {sellersListVisible ?  `${localizationStrings.hide_list}` : `${localizationStrings.see_list}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={() => {
                  setsellerModalVisible(true)
                  //  handleValidationUpdate('professionalSellers')

                }}
              >
                <Text style={styles.buttonText}>{localizationStrings.add}</Text>
              </TouchableOpacity>
            </View>

            {sellersListVisible && <>
              {sellers?.length > 0 ? (
                <View style={styles.expandableList}>
                  {sellers.map((seller, index) => (
                    <View style={{
                      paddingVertical: 10, marginTop: 25, borderRadius: 5, backgroundColor: '#fff',
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      flexDirection: 'row',
                      alignItems: 'center',

                      elevation: 5,
                      paddingHorizontal: 10

                    }}>
                      <Image
                        source={{
                          uri: `https://panel.dkyss.es/uploads/${seller?.professional_seller?.driver_images}`,
                        }}
                        style={styles.sellerImage}
                      />
                      <View style={{ width: '80%' }}>
                        <Text key={index} style={{ fontWeight: '600', fontSize: 12, color: '#000' }}>
                          {seller?.professional_seller?.driver_first_name} {seller?.professional_seller?.driver_last_name}
                        </Text>
                        <Text style={styles.sellerCompany}>{seller?.professional_seller?.driver_company_name}</Text>
                        <Text style={styles.sellerCity}>{seller?.professional_seller?.driver_address_1}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : <Text style={{ fontSize: 14, fontWeight: '600', alignSelf: 'center', marginTop: 20 }}>{localizationStrings.no_data_here}</Text>}

            </>
            }
          </View>

          {/* Pickup Points Validation */}
          <View style={[styles.validationItem, { padding: 15, borderRadius: 15 }]}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: '#000' }}>
            {localizationStrings.pickup_points}: {pickupPoints?.length}/7
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={() => setPickupPointsListVisible(!pickupPointsListVisible)}
              >
                <Text style={styles.buttonText}>
                  {pickupPointsListVisible ? `${localizationStrings.hide_list}` : `${localizationStrings.see_list}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={() => {
                  setpickupModalVisible(true)
                  //handleValidationUpdate('pickupPoints')
                }}
              >
                <Text style={styles.buttonText}>{localizationStrings.add}</Text>
              </TouchableOpacity>
            </View>
            {pickupPointsListVisible && <>
              {pickupPoints?.length > 0 ? (
                <View style={{ marginTop: 15 }}>
                  {pickupPoints.map((pickup, index) => (

                    <View style={{
                      paddingVertical: 10, marginTop: 5, borderRadius: 5, backgroundColor: '#fff',
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                      paddingHorizontal: 10

                    }}>
                      <Text key={index} style={{ fontWeight: '600', fontSize: 12, color: '#000' }}>
                        {pickup?.location}
                      </Text>

                    </View>
                  ))}
                </View>
              ) : <Text style={{ fontSize: 14, fontWeight: '600', alignSelf: 'center', marginTop: 20 }}>{localizationStrings.no_pic_add}</Text>}

            </>}
          </View>

          {/* App Shares */}
          <View style={[styles.validationItem, { padding: 15, borderRadius: 15 }]}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: '#000' }}>
              {localizationStrings.app_shares}: {AppshareCount}/100
            </Text>
            <TouchableOpacity
              style={[styles.validateButton, { marginTop: 15 }]}
              onPress={() => {
                shareApp()
              }
              }
            >
              <Text style={styles.buttonText}>{localizationStrings.share}</Text>
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView>
      <MapPickerModal setModalVisible={setpickupModalVisible}
        modalVisible={pickupModalVisible}

        driver={true}
        sendLocation={setPickupLocation}
        setLocationName={setPickupLocationName} />
      <PickupSeller setModalVisible={setsellerModalVisible}
        modalVisible={sellerModalVisible}
        driverId={user?.driver_data?.driver_id}
      />

      <TouchableOpacity
        onPress={() => {

          check_validation_process()
        }}
        style={[styles.continueButton, {
          backgroundColor:
            sellers?.length >= 7 &&
              pickupPoints?.length >= 7 &&
              AppshareCount >= 100
              ? '#0BD89E'
              : 'grey',
        }]}>
       {loading?<ActivityIndicator size={25} color={'#fff'} />:<Text style={styles.continueButtonText}>{localizationStrings.validate}</Text>}
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  sellerCompany: {
    fontSize: 14,
    color: 'gray',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#f0f0f0'
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  validation: {
    marginTop: 20,
  },
  validationItem: {

    justifyContent: "center",
    marginBottom: 16,
  },
  validateButton: {
    backgroundColor: '#0BD89E',
    padding: 8,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueButton: {
    height: 55,

    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

    bottom: 10,
    width: '100%',
    alignSelf: 'center'
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
    height: 150,
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
  sellerCity: {
    fontSize: 12,
    color: 'darkgray',
  },
  nextButtonText: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 25.5,
  },
});
