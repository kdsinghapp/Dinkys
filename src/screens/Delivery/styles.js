import { StyleSheet } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    marginTop:hp(7),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: hp(8),
      },
      title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0BD89E',
        lineHeight: 25,
      },
      status: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 21,
      },
    txtHeading:{
fontWeight:'700',
fontSize:24,
lineHeight:36,
color:'#000'
    },
    txtsubHeading:{
        fontWeight:'400',
        fontSize:16,
        lineHeight:24,
        color:'#9DB2BF'
    },
    tabBtn:{
        height:60,

        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 60,

       
        width: '100%',
      
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,

        elevation: 1,
        backgroundColor: '#352C48',
      },
      
      shadow:{shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      
      elevation: 5,
    }
})