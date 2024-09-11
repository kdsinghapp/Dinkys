import { SET_USER, TOKEN, USERINFO, APPUPDATE, GENERAL, SOUND, VIBRATE, NEWTIP, WALLET } from './userType';

const initialState = {
  loginType: false,
  user: {},
  token: '',
  general: false,
  sound: false,
  vibrate: false,
  appupdate: false,
  newTip: false,
  wallet: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERINFO:
      return { ...state, loginType: action.payload };
    case SET_USER:
      return { ...state, user: action.payload };
    case TOKEN:
      return { ...state, token: action.payload };
    case GENERAL:
      return { ...state, general: action.payload };
    case SOUND:
      return { ...state, sound: action.payload };
    case VIBRATE:
      return { ...state, vibrate: action.payload };
    case APPUPDATE:
      return { ...state, appupdate: action.payload };
    case NEWTIP:
      return { ...state, newTip: action.payload };
    case WALLET:
      return { ...state, wallet: action.payload };
    default:
      return state;
  }
};
export default userReducer;
