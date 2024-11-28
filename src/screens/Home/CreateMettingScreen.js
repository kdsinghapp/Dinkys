import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform, Pressable ,ActivityIndicator} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderTwo from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapPickerModal from '../../components/MapPicker';
import { useSelector } from 'react-redux';
import { errorToast, successToast } from '../../utils/customToast';

const CreateMettingScreen = () => {
    // State to hold the address, date, time, and participant info
    const route = useRoute()
    const { details,  shipping_charge ,amount } = route.params
    const [address, setAddress] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [pickupModalVisible, setpickupModalVisible] = useState(false)
    const [PickupLocation, setPickupLocation] = useState('')
    const [PickupLocationName, setPickupLocationName] = useState(false)
    const [loading, setloading] = useState(false)
    const userDetails = useSelector((state) => state.user.user)


    // Handlers for date and time pickers
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    // Handler for submitting the form
    const handleSubmit = async() => {

        if(!PickupLocation?.latitude && !PickupLocation?.longitude ) return errorToast("Please Select Metting Address")
        if(!date && !time ) return errorToast("Please Date or Time")
        setloading(true)
        const formdata = new FormData();
formdata.append("user_id", userDetails?.id);
formdata.append("product_id", details?.id);
formdata.append("title", details?.title);
formdata.append("date_time", `${date},${time}`);
formdata.append("location", PickupLocationName);
formdata.append("product_owner_id", details?.user_data?.id);
formdata.append("lat",PickupLocation?.latitude);
formdata.append("long", PickupLocation?.longitude);
formdata.append("price_offer", amount);

const requestOptions = {
  method: "POST",
  body: formdata,
  redirect: "follow"
};

await fetch("https://panel.dkyss.es/api/create_meeting", requestOptions)
  .then((response) => response.text())
  .then((result) => {
const res = JSON.parse(result)

if(res?.status == '1'){
successToast('Metting Request Send Successfully')
navigation.replace('Metting')
setloading(false)

}
else{
    errorToast(res?.message)
    setloading(false)
}

  })
  .catch((error) =>{
    setloading(false)

 console.error(error)
});

        
    };

    const navigation = useNavigation()


    return (
        <View style={styles.container}>
            <HeaderTwo navigation={navigation} title={"Create Meeting"} Metting={true} />
            <View style={{ backgroundColor: '#5B2C83', flex: 1, padding: 20, }}>

                <Text style={styles.title}>Create Meeting</Text>

                {/* Address input */}

                <Pressable
                    style={{ backgroundColor: '#fff', borderRadius: 10, marginVertical: 20, paddingVertical: 10 }}
                    onPress={() => {
                        setpickupModalVisible(true)
                    }}
                >


                    <Text style={[styles.dateTimeText, { fontSize: 14, fontWeight: '600', color: '#000' }]}>{PickupLocationName ? PickupLocationName : "Enter meeting address"}</Text>
                </Pressable>
                {/* Date Picker */}
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
                    <Text style={styles.dateTimeText}>📅 {date.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}

                {/* Time Picker */}
                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
                    <Text style={styles.dateTimeText}>🕒 {time.toLocaleTimeString()}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={onChangeTime}
                    />
                )}



                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                   {loading?<ActivityIndicator size={20}  color={'#fff'} />: <Text style={styles.submitButtonText}>Send Meeting Request</Text>}
                </TouchableOpacity>
            </View>

            <MapPickerModal setModalVisible={setpickupModalVisible} modalVisible={pickupModalVisible} sendLocation={setPickupLocation} setLocationName={setPickupLocationName} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
        ,backgroundColor:'#fff'
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,

        marginTop: 30
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    dateTimeButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        justifyContent: 'center',
    },
    dateTimeText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
    listTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    socialList: {
        flexDirection: 'column',
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    socialText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    checkMark: {
        color: '#2ECC71', // Green color
        fontSize: 20,
    },
    submitButton: {
        backgroundColor: '#2ECC71', // Green color
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});


export default CreateMettingScreen;

