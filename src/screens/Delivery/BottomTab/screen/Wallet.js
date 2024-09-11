import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function Wallet() {
  const navigation = useNavigation();


  const isFocused = useIsFocused();

//   useEffect(() => {
//     if (user) {
//       getCompleteOrder();
//     }
//   }, [user, isFocused]);

//   const getCompleteOrder = () => {
//     if (user?.token) {
//       const params = {
//         token: user.token,
//       };
//       dispatch(get_wallet_details(params)).catch(err => {
//         console.error('Failed to fetch wallet details:', err);
//       });
//     }
//   };

//   const addWithdraw = () => {
//     try {
//       if (user?.token) {
//         const params = {
//           token: user.token,
//         };
//         dispatch(payment_withdraw(params)).then(() => {
//           getCompleteOrder();
//         }).catch(err => {
//           console.error('Failed to withdraw payment:', err);
//         });
//       }
//     } catch (err) {
//       console.error('Error in addWithdraw:', err);
//     }
//   };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderItem = ({ item }) => (
    <View style={{ height: hp(12), paddingHorizontal: 5, justifyContent: 'center' }}>
      <View style={{ height: 40, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ justifyContent: 'space-between', marginLeft: 5 }}>
          <Text style={styles.amountText}>£ {item.payment_amount}</Text>
          <Text style={[styles.paymentTypeText, { color: item.payment_type === 'Debit' ? '#F44336' : '#4CAF50' }]}>
            {item.payment_type}
          </Text>
        </View>
        <View>
          <Image
            source={item.payment_type === 'Debit' ? require('../../../../assets/dinkyimg/Iconred3x.png') : require('../../../../assets/dinkyimg/Icongreenreceived3x.png')}
            style={styles.paymentIcon}
          />
          <Text style={styles.dateText}>{formatDate(item.payment_date)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <View style={{ height: 10, backgroundColor: '#fff' }} />}
      {/* {isLoading && <Loading />} */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Wallet</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabelText}>Your Available Balance</Text>
        <Text style={styles.balanceText}>£ 10000.00</Text>
        <TouchableOpacity onPress={()=>{}} style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.historyHeader}>
        <Text style={styles.historyHeaderText}>Payment History</Text>
      </View>
      {payments && (
        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={payments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
  },
  header: {
    marginTop: 30,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '700',
    color: '#000000',
  },
  balanceContainer: {
    backgroundColor: '#0BD89E',
    height: hp(20),
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabelText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  balanceText: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  withdrawButton: {
    height: 45,
    backgroundColor: '#352C48',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  withdrawButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 25.5,
    marginLeft: 10,
  },
  historyHeader: {
    height: hp(5),
    marginTop: 10,
    justifyContent: 'center',
  },
  historyHeaderText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: '#000',
  },
  amountText: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 18,
    alignItems: 'center',
    color: '#000000',
  },
  paymentTypeText: {
    fontWeight: '400',
    fontSize: 12,
    marginTop: 10,
    lineHeight: 14,
    alignItems: 'center',
  },
  paymentIcon: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
  },
  dateText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight:14,
    alignItems: 'center',
    color: '#000',
    marginTop: 10,
  },
});


const  payments = [
  {
      "id": 49,
      "driver_id": 1,
      "payment_amount": 2,
      "payment_date": "2024-09-02 10:57:57",
      "payment_method": null,
      "created_at": "2024-09-02T10:57:57.000000Z",
      "updated_at": "2024-09-02T10:57:57.000000Z",
      "user_id": null,
      "payment_type": "Debit",
      "delivery_amount": 2,
      "order_id": null
  },
  {
      "id": 48,
      "driver_id": 1,
      "payment_amount": 2,
      "payment_date": "2024-08-31 16:30:30",
      "payment_method": null,
      "created_at": "2024-08-31T16:30:30.000000Z",
      "updated_at": "2024-08-31T16:30:30.000000Z",
      "user_id": null,
      "payment_type": "Credit",
      "delivery_amount": 2,
      "order_id": null
  },
  {
      "id": 48,
      "driver_id": 1,
      "payment_amount": 2,
      "payment_date": "2024-08-31 16:30:30",
      "payment_method": null,
      "created_at": "2024-08-31T16:30:30.000000Z",
      "updated_at": "2024-08-31T16:30:30.000000Z",
      "user_id": null,
      "payment_type": "Debit",
      "delivery_amount": 2,
      "order_id": null
  },
  {
      "id": 48,
      "driver_id": 1,
      "payment_amount": 2,
      "payment_date": "2024-08-31 16:30:30",
      "payment_method": null,
      "created_at": "2024-08-31T16:30:30.000000Z",
      "updated_at": "2024-08-31T16:30:30.000000Z",
      "user_id": null,
      "payment_type": "Credit",
      "delivery_amount": 2,
      "order_id": null
  }
]