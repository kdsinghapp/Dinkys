import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/auth/Splash';
import Login from '../screens/auth/Login';
import Bottomtab from '../screens/BottomTab';
import ChooseLanguage from '../screens/auth/ChooseLanguage';
import Privacy from '../screens/profile/Privacy';
import TermAndCondition from '../screens/profile/TermAndCondition';
import About from '../screens/profile/About';
import EditProfile from '../screens/profile/EditProfile';
import Notification from '../screens/profile/Notification';
import ResetPassByNumber from '../screens/auth/ResetPassByNumber';
import Otp from '../screens/auth/Otp';
import NewPassword from '../screens/auth/NewPassword';
import AllCategories from '../screens/Home/AllCategories';
import Favrotie from '../screens/Home/Favrotie';
import SettingScreen from "../screens/profile/SettingScreen"
import ChangePassword from '../screens/profile/ChangePassword';
import ShippingAddress from '../screens/profile/ShippingAddress';
import FAQ from '../screens/profile/FAQ';
import BallanceHistory from '../screens/profile/BallanceHistory';
import Wallet from '../screens/profile/Wallet';
import BankScreen from '../screens/profile/BankScreen';
import Sales from '../screens/profile/Sales';
import Purchases from '../screens/profile/Purchases';
import ProductDetails from '../screens/Home/ProductDetails';
import Delivery from '../screens/Home/Delivery';
import Map from '../screens/Home/Map';
import Summary from '../screens/Home/Summary';
import ChattingScreen from '../screens/Home/ChattingScreen';
import Register from '../screens/auth/Register';
import ProductList from '../screens/Home/ProductList';
import AddProduct from '../screens/Home/AddProduct';
import WebViewScreen from '../screens/Home/WebView';
import WalletAmount from '../screens/profile/WalletAmount';
import AddAddress from '../screens/profile/AddAddress';
import AddCardDetails from '../screens/profile/AddCardDetails';
import { notificationListener, requestUserPermission } from '../utils/Notification';
import DeliveryScreen from '../screens/Delivery/Delivery';
import VehicleDetails from '../screens/Delivery/VehicleDetails';
import AddCertificate from '../screens/Delivery/AddCretificate';
import TabNavigator from '../screens/Delivery/BottomTab/TabNavigator';
import OrderDetails from '../screens/Delivery/OrderDetails';
import MapPickup from '../screens/Delivery/MapPickup';
import MapDeliverd from '../screens/Delivery/MapDeliverd';
import DriverDocument from '../screens/Delivery/DriverDocument';
import DriverCertificate from '../screens/Delivery/DriverCertificate';
import DriverProfile from '../screens/Delivery/DriverProfile';
import MapPicker from '../components/MapPicker';
import UserProfile from '../screens/Home/UserProfile';
import MeetAndPay from '../screens/Home/MeetAndPay';
import MyaddressModal from '../components/MyaddressModal';
import PersionPayment from '../screens/Home/PersionPayment';
import Help from '../components/Help';
import BankDetails from '../screens/Home/AddBankDetails';
import Metting from '../screens/profile/Metting';
import MeetingInforMation from '../screens/profile/MeetingInformation';
import CreateMettingScreen from '../screens/Home/CreateMettingScreen';
import AddBankDetails from '../screens/Home/AddBankAccount';
import AdsPlan from '../screens/Home/AdsPlan';
import ViewCart from '../screens/Home/AdsCart';
import AdsWebview from '../screens/Home/AdsWebview';
import SelectLocation from '../screens/Location/SelectLocation';
import AddPickupPoint from '../screens/Delivery/AddPickupPoint';
const Stack = createStackNavigator();
export default function Navigation() {

    React.useEffect(() => {
        notificationListener();
        requestUserPermission();
      }, []);

    const screenOptions = {
        headerShown: false,
        cardStyle: { backgroundColor: '#f7f7f7' },
        ...TransitionPresets.SlideFromRightIOS
    }
    const verticalAnimation = {
        headerShown: false,
        cardStyle: { backgroundColor: '#f7f7f7' },
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS
    }
    const verticalAnimationTransparent = {
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
    }
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Splash"} screenOptions={screenOptions} >
                <Stack.Screen name="Splash" component={Splash} options={verticalAnimationTransparent} />
                <Stack.Screen name="Register" component={Register} options={verticalAnimationTransparent} />
                <Stack.Screen name="Login" component={Login} options={verticalAnimationTransparent} />
                <Stack.Screen name="Otp" component={Otp} options={verticalAnimationTransparent} />
                <Stack.Screen name="ResetPassByNumber" component={ResetPassByNumber} options={verticalAnimationTransparent} />
                <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} options={verticalAnimationTransparent} />
                <Stack.Screen name="NewPassword" component={NewPassword} options={verticalAnimationTransparent} />
                <Stack.Screen name="Bottomtab" component={Bottomtab} options={verticalAnimationTransparent} />
                <Stack.Screen name="AllCategories" component={AllCategories} options={verticalAnimationTransparent} />
                <Stack.Screen name="Favrotie" component={Favrotie} options={verticalAnimationTransparent} />
                <Stack.Screen name="SettingScreen" component={SettingScreen} options={verticalAnimationTransparent} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} options={verticalAnimationTransparent} />
                <Stack.Screen name="ShippingAddress" component={ShippingAddress} options={verticalAnimationTransparent} />
                <Stack.Screen name="Notification" component={Notification} options={verticalAnimationTransparent} />
                <Stack.Screen name="FAQ" component={FAQ} options={verticalAnimationTransparent} />
                <Stack.Screen name="BallanceHistory" component={BallanceHistory} options={verticalAnimationTransparent} />
                <Stack.Screen name="Wallet" component={Wallet} options={verticalAnimationTransparent} />
                <Stack.Screen name="BankScreen" component={BankScreen} options={verticalAnimationTransparent} />
                <Stack.Screen name="Sales" component={Sales} options={verticalAnimationTransparent} />
                <Stack.Screen name="Purchases" component={Purchases} options={verticalAnimationTransparent} />
                <Stack.Screen name="ProductDetails" component={ProductDetails} options={verticalAnimationTransparent} />
                <Stack.Screen name="Delivery" component={Delivery} options={verticalAnimationTransparent} />
                <Stack.Screen name="Map" component={Map} options={verticalAnimationTransparent} />
                <Stack.Screen name="Summary" component={Summary} options={verticalAnimationTransparent} />
                <Stack.Screen name="ChattingScreen" component={ChattingScreen} options={verticalAnimationTransparent} />
                <Stack.Screen name="Privacy" component={Privacy} options={verticalAnimationTransparent} />
                <Stack.Screen name="TermAndCondition" component={TermAndCondition} options={verticalAnimationTransparent} />
                <Stack.Screen name="About" component={About} options={verticalAnimationTransparent} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={verticalAnimationTransparent} />
                <Stack.Screen name="ProductList" component={ProductList} options={verticalAnimationTransparent} />
                <Stack.Screen name="AddProduct" component={AddProduct} options={verticalAnimationTransparent} />
                <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={verticalAnimationTransparent} />
                <Stack.Screen name="WalletAmount" component={WalletAmount} options={verticalAnimationTransparent} />
                <Stack.Screen name="AddAddress" component={AddAddress} options={verticalAnimationTransparent} />
                <Stack.Screen name="AddCardDetails" component={AddCardDetails} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="DeliveryScreen" component={DeliveryScreen} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="VehicleDetails" component={VehicleDetails} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="AddCertificate" component={AddCertificate} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="TabNavigator" component={TabNavigator} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="OrderDetails" component={OrderDetails} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="MapPickup" component={MapPickup} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="MapDeliverd" component={MapDeliverd} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="DriverDocument" component={DriverDocument} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="DriverCertificate" component={DriverCertificate} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="DriverProfile" component={DriverProfile} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="MapPicker" component={MapPicker} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="UserProfile" component={UserProfile} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="MeetAndPay" component={MeetAndPay} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="MyaddressModal" component={MyaddressModal} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="PersionPayment" component={PersionPayment} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="Help" component={Help} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="BankDetails" component={BankDetails} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="Metting" component={Metting} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="MeetingInforMation" component={MeetingInforMation} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="CreateMettingScreen" component={CreateMettingScreen} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="AddBankDetails" component={AddBankDetails} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="AdsPlan" component={AdsPlan} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="ViewCart" component={ViewCart} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="AdsWebview" component={AdsWebview} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="SelectLocation" component={SelectLocation} options={verticalAnimationTransparent} />
           
                <Stack.Screen name="AddPickupPoint" component={AddPickupPoint} options={verticalAnimationTransparent} />
           
            </Stack.Navigator>
        </NavigationContainer>
    );
}
