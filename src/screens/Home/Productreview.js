import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity,Image, StyleSheet } from 'react-native';

import Star from '../../assets/svg/star.svg';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
const data = [
    {
        "resrev_id": 34,
        "resrev_user_id": 5,
        "resrev_review_text": "Lorem ipsum dolor sit amet consectetur. Amet non elementum fermentum eu non nisi vestibulum. Lectus phasellus libero hendrerit nibh euismod arcu at. Egestas lacinia ut hendrerit etiam id sollicitudin.",
        "resrev_rating": 5,
        "resrev_created_at": "2024-08-31 17:53:36",
        "resrev_updated_at": "2024-08-31 17:53:36",
        "resrev_deleted_at": null,
        "resrev_restaurants_id": 18,
        "full_name": "edqowu",
        "images": "https://loveeatsdb.com/storage/app/users/51Ucg1RCjx_1724247566.png"
    }
]
export default function ProductReview({  }) {

    
  const [showAll, setShowAll] = useState(false);
  const topReviews = showAll ? data : data.slice(0,3);






  const RenderReviewList = ({ item }) => {
    return (
      <View
        style={[
          styles.shadow,
          {
            paddingHorizontal: 10,
            backgroundColor: '#FFFFFF',
            marginHorizontal: 5,
            paddingVertical: 10,
            marginVertical: 5,
            borderRadius:15,
          },
        ]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ height: 45, width: 45 }}>
            <Image
              source={{ uri: item.images }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                borderColor: '#7756FC',
              }}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              paddingVertical: 5,
              marginLeft: 10,
              width: '82%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize:14,
                  fontWeight: '700',
                  lineHeight: 24,
                  color: '#000000',
                }}>
                {item.full_name}
              </Text>
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
                  {item.resrev_rating}
                </Text>
                <Star />
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 5, marginHorizontal: 5 }}>
          <Text
            style={{
              fontSize:12,
              fontWeight: '500',
              lineHeight: 15,
              color: '#677294',
            }}>
            {item.resrev_review_text}
          </Text>
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
        data={topReviews}
        renderItem={RenderReviewList}
        keyExtractor={item => item.resrev_id.toString()}
        showsHorizontalScrollIndicator={false}
      />
   
        {/* <TouchableOpacity onPress={handleSeeAll}>
          <Text style={{ color: '#E79B3F', textAlign: 'center', marginTop: 10 ,fontSize:16}}>
            {showAll?'less all reviews':'See all reviews'}
          </Text>
        </TouchableOpacity> */}
      
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