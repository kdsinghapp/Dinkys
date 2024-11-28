import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import MyStatusBar from "../../elements/MyStatusBar";
import HeaderTwo from "../../components/Header";
import { DOMAIN } from "../../services/Config";

const ViewCart = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const userDetails = useSelector((state) => state?.user?.user);
  const Wallet = useSelector((state) => state?.user?.wallet);

  const { cartData } = route.params;
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card"); // Default to card payment

  const item = cartData.normal[0];
  const totalPrice = quantity * parseFloat(item.price);

  const payment_handler_web = () => {
    setLoading(true);
    var formdata = new FormData();
    formdata.append("email", userDetails?.email);
    formdata.append("price", item.price);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    fetch(`${DOMAIN}create-checkout-session`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {

        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        formdata.append("ads_id", item.id);
        formdata.append("total_amount", item.price);
        formdata.append("payment_intent", "WALLET");

        if (res?.data?.url) {
          navigation.navigate("AdsWebview", {
            details: item,
            url: res?.data?.url,
       
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const payment_wallet = () => {
    if (Number(item.price) > Wallet) {
      console.log("Please Add Money in Wallet");
    }
     else 
     
     {
      setLoading(true);
      var formdata = new FormData();
      formdata.append("user_id", userDetails?.id);
      formdata.append("ads_id", item.id);
      formdata.append("total_amount", item.price);
      formdata.append("payment_intent", "WALLET");
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      fetch(`${DOMAIN}buy_ads`, requestOptions)
        .then((response) => response.json())
        .then(async (res) => {
          if (res?.status === "1") {
            console.log("Payment Successful");
            navigation.navigate("Bottomtab");
          }
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "card") {
      payment_handler_web();
    } else if (paymentMethod === "wallet") {
      payment_wallet();
    }
  };

  return (
    <SafeAreaView style={styles.container}>

        {loading?<ActivityIndicator size={20} color={'#0BD89E'} />:null}
      <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
      <HeaderTwo navigation={navigation} title={"View Cart"} />

      <View style={{ padding: 20 }}>
        {/* Cart Item */}
        <View style={styles.cartItem}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.description}</Text>
            <Text style={styles.itemLimit}>Ad Limit: {item.limit}</Text>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.itemPrice}>₹ {item.price}</Text>
        </View>

        {/* Price Details */}
        <View style={styles.priceDetails}>
          <Text style={styles.priceTitle}>PRICE DETAIL</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>₹ {item.price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Discount</Text>
            <Text style={styles.priceValue}>₹ 0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelTotal}>Total</Text>
            <Text style={styles.priceValueTotal}>₹ {totalPrice}</Text>
          </View>
        </View>

        {/* Payment Options */}
        <View style={styles.paymentOptions}>
          <Text style={styles.paymentTitle}>Select Payment Method</Text>
          <TouchableOpacity
            style={[
              styles.radioButton,
              paymentMethod === "card" && styles.radioSelected,
            ]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text style={styles.radioText}>Card</Text>
          {paymentMethod === "card" &&  <View style={{
                height:15,width:15,borderRadius:7,backgroundColor:'#0BD89E'
            }} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              paymentMethod === "wallet" && styles.radioSelected,
            ]}
            onPress={() => setPaymentMethod("wallet")}
          >
            <Text style={styles.radioText}>Wallet</Text>
            {paymentMethod === "wallet" &&  <View style={{
                height:15,width:15,borderRadius:7,backgroundColor:'#0BD89E'
            }} />}
          </TouchableOpacity>
        </View>

        {/* Pay Button */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>
            Pay ₹ {totalPrice} ({paymentMethod.toUpperCase()})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // (Keep existing styles here)
  paymentOptions: {
    marginVertical: 16,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0D1F3C",
    marginBottom: 8,
  },
  radioButton: {
    flexDirection:'row',justifyContent:'space-between',
    padding: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  radioSelected: {
    borderColor: "#0D1F3C",
    borderWidth: 2,
  },
  radioText: {
    fontSize: 14,
    color: "#0D1F3C",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",

  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  itemDetails: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D1F3C",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#6D6D6D",
    marginBottom: 4,
  },
  itemLimit: {
    fontSize: 12,
    color: "#6D6D6D",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 14,
    color: "#000000",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D1F3C",
    textAlign: "right",
  },
  priceDetails: {
    marginBottom: 24,
  },
  priceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0D1F3C",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6D6D6D",
  },
  priceValue: {
    fontSize: 14,
    color: "#000000",
  },
  priceLabelTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  priceValueTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  payButton: {
    backgroundColor: "#0BD89E",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default ViewCart;
