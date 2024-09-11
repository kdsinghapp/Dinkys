import React, { useState } from 'react';
import { Image, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Home from './Home/Home';
import HomeColorSvg from "../assets/svg/homeColor.svg"
import HomeBlackSvg from "../assets/svg/homeBlack.svg"
import FavColorSvg from "../assets/svg/FavoritesColor.svg"
import FavBlackSvg from "../assets/svg/FavoritesBlack.svg"
import MainColorSvg from "../assets/svg/Main.svg"
import ChatColorSvg from "../assets/svg/ChatsColor.svg"
import ChatBlackSvg from "../assets/svg/ChatsBlack.svg"
import ProfileColorSvg from "../assets/svg/ProfileColor.svg"
import ProfileBlackSvg from "../assets/svg/ProfileBlack.svg"
import MyText from '../elements/MyText';
import Favrotie from './Home/Favrotie';
import Profile from './profile/Profile';
import ChatScreen from './Home/ChatScreen';
import Uploaded from './Home/Uploaded';

export default function TabScreen({ navigation }) {
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {currentPage == 0 ? (
                <Home navigation={navigation} />
            ) : currentPage == 1 ? (
                <Favrotie navigation={navigation} />
            ) : currentPage == 2 ? (
                <Uploaded navigation={navigation} />
            ) : currentPage == 3 ? (
                <ChatScreen navigation={navigation} />
            ) :
                <Profile navigation={navigation} />
            }
            <View
                style={{
                    flexDirection: 'row',
                    padding: Platform.OS == "android" ? 5 : 15,
                    justifyContent: "space-between",
                    alignItems: 'center',
                    width: "100%",
                    elevation: 5,
                    backgroundColor: "#fff"
                }}>
                <TouchableOpacity
                    onPress={() => setCurrentPage(0)}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "20%"

                    }}>
                    {currentPage == 0
                        ? <HomeColorSvg width={24} height={24} />
                        : <HomeBlackSvg width={24} height={24} />
                    }
                    <Text style={{ color: currentPage == 0 ? "#04CFA4" : "#000", marginTop: 5,fontWeight:'600',fontSize:12}} >Home</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCurrentPage(1)}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "20%"

                    }}>
                    {currentPage == 1
                        ? <FavColorSvg width={24} height={24} />
                        : <FavBlackSvg width={24} height={24} />
                    }
                    <Text style={{ color: currentPage == 1 ? "#04CFA4" : "#000", marginTop: 5,fontWeight:'600',fontSize:12}} >Favorites</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCurrentPage(2)}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: "center",
                        width: "20%",
                        marginTop: Platform.OS == "android" ? -40 : -60

                    }}>
                    <MainColorSvg width={52} height={52} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCurrentPage(3)}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "20%"

                    }}>
                    {currentPage == 3
                        ? <ChatColorSvg width={24} height={24} />
                        : <ChatBlackSvg width={24} height={24} />
                    }
 <Text style={{ color: currentPage == 3 ? "#04CFA4" : "#000", marginTop: 5,fontWeight:'600',fontSize:12}} >Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCurrentPage(4)}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "20%"

                    }}>
                    {currentPage == 4
                        ? <ProfileColorSvg width={24} height={24} />
                        : <ProfileBlackSvg width={24} height={24} />
                    }
                    <Text style={{ color: currentPage == 4 ? "#04CFA4" : "#000", marginTop: 5,fontWeight:'600',fontSize:12}} >Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

