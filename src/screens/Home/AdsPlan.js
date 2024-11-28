import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import MyStatusBar from "../../elements/MyStatusBar";
import HeaderTwo from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../utils/Constant";
import { errorToast } from "../../utils/customToast";

const AdsPlan = () => {
  const [adsPackages, setAdsPackages] = useState({
    normal: [],
    premium: [],
  });
  const [loading, setLoading] = useState(false);
  const [cartData, setcartData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const navigation = useNavigation();

  // Function to fetch data
  const fetchAdsPackages = async () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch("https://panel.dkyss.es/api/ads_packages", requestOptions);
      const result = await response.json();

      if (result.status === "1") {
        setAdsPackages({
          normal: result.data.normal || [],
          premium: result.data.primium || [],
        });
      } else {
        console.error("Failed to fetch ads packages.");
      }
    } catch (error) {
      console.error("Error fetching ads packages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAdsPackages();
  }, []);

  // Render ad package card
  const renderAdCard = ({ item }) => (
    <TouchableOpacity
    onPress={()=>{
        setcartData({normal:[item]})
        setSelectedId(item.id)
    }}
    style={[styles.adCard,{borderColor:selectedId==item.id?'#0BD89E':'#FFFFFF'}]}>
      <Text style={styles.adTitle}>{item.title}</Text>
      <Text style={styles.adDescription}>{item.description}</Text>
      <Text style={styles.adLimit}>Limit: {item.limit} Ads</Text>
      <Text style={styles.adPrice}>₹ {item.price}</Text>
    </TouchableOpacity>
  );


  

  return (
    <ScrollView style={styles.container}>
      <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
      <HeaderTwo navigation={navigation} title={"Ads Plan"} />

      <View style={{ padding: 16 }}>
        {/* Section Header */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>POST MORE ADS</Text>

        </View>

        {/* Show loading indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {/* Normal Ads Packages */}
            <Text style={styles.subHeader}>Normal Packages</Text>
            <FlatList
              data={adsPackages.normal}
              numColumns={2}
              renderItem={renderAdCard}
              keyExtractor={(item) => item.id}
            />

            {/* Premium Ads Packages */}
            <Text style={styles.subHeader}>Premium Packages</Text>
            <FlatList
              data={adsPackages.premium}
              numColumns={2}
              renderItem={renderAdCard}
              keyExtractor={(item) => item.id}
            />
          </>
        )}

        {/* Footer Button */}
        <TouchableOpacity 
        onPress={()=>{

            if(cartData){

                navigation.navigate('ViewCart',{cartData })
            }else{

                errorToast('Please Select a Plan')
            }
        }}
        style={[styles.cartButton,{    backgroundColor:cartData? '#0BD89E':"#E0E0E0",}]}>
          <Text style={[styles.cartButtonText,{color:cartData? '#fff':"#000",}]}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#263238",
  },
  subText: {
    fontSize: 12,
    color: "#6D6D6D",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#263238",
    marginVertical: 10,
  },
  adCard: {
    width: "45%",
    margin: 5,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth:2,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  adTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#263238",
  },
  adDescription: {
    fontSize: 12,
    color: "#6D6D6D",
    marginVertical: 4,
    textAlign: "center",
  },
  adLimit: {
    fontSize: 12,
    color: "#263238",
    marginVertical: 4,
  },
  adPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#263238",
  },
  cartButton: {

    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6D6D6D",
  },
});

export default AdsPlan;
