import React from 'react';
import { View, StyleSheet } from 'react-native';
import Star from '../../assets/svg/star.svg';
import BStar from '../../assets/svg/StarBlack.svg';

const Ratting = ({ Ratting }) => {


  return (
    <View style={styles.container}>
      {StarData.map((item, index) => (
        <React.Fragment key={item.id}>
          {index + 1 < Ratting ? (
            <Star height={15} width={15} marginLeft={5} />
          ) : (
            <BStar height={15} width={15} marginLeft={5} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Ensuring horizontal arrangement
    alignItems: 'center', // Align items in the row
  },
});

export default Ratting;

const StarData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
