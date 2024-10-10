import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity,Image, StyleSheet } from 'react-native';

import Star from '../../assets/svg/star.svg';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ProductReview({ data,count }) {

    
  const [showAll, setShowAll] = useState(false);
  const topReviews = showAll ? data : data?.slice(0,3);






  const RenderReviewList = ({ item }) => {
    return (
      <View
        style={[
          styles.shadow,
          {
            paddingHorizontal: 10,
            backgroundColor: '#FFFFFF',
            marginHorizontal: 5,
          paddingVertical:5,
            marginVertical: 5,
            borderRadius:15,
          },
        ]}>
        <View style={{ flexDirection: 'row',alignItems:'center',paddingVertical:5 }}>
         
            <Image
              source={{ uri: item.user_data?.image }}
              style={{
                height:30,
                width:30,
                borderRadius: 20,
                borderColor: '#7756FC',
              }}
              resizeMode="cover"
            />
      

          <View
            style={{
            
         marginLeft:10,
         paddingVertical:5,
              width: '82%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems:'center'
              }}>
                <View style={{ width: '85%',}}>
              <Text
                style={{
                  fontSize:12,
                  fontWeight: '700',
            
                  color: '#000000',
                }}>
               {item.user_data?.user_name}
              </Text>
              <Text
            style={{
              fontSize:11,
              fontWeight: '500',
    
              color: '#677294',
            }}>
            {item.message}
          </Text>
          </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E79B3F',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  width: '20%',
                  justifyContent: 'space-between',
                  paddingHorizontal: 14,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    lineHeight: 24,
                    color: '#E79B3F',
                  }}>
                  {item.rating}
                </Text>
                <Star />
              </View>
            </View>
          </View>
        </View>
       
      </View>
    );
  };

  const handleSeeAll = () => {
    setShowAll(showAll=>!showAll);
  };

  return (
    <View style={{flex:1}}>
      <FlatList
        data={data?.slice(0,count)}
        renderItem={RenderReviewList}
        keyExtractor={item => item.id.toString()}
      
        showsHorizontalScrollIndicator={false}
      />
   
      
      
    </View>
  );
}


const styles =  StyleSheet.create({
    shadow:{shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation:2,
  }

})