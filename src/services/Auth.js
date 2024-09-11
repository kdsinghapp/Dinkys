import axios from 'axios';
import { DOMAIN, parseResponse } from './Config';

const authAxios = axios.create();

authAxios.interceptors.request.use(
  async config => {
    let user = "fgegeg";
    if (user) {
      user = JSON.parse(user);
      config.headers.authorization = `Bearer ${user.token}`;
    }
    if (config.method === 'post' && config.data?.Data) {
      config.data.Data = await config.data.Data;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

authAxios.interceptors.response.use(res => {
  return parseResponse(res.data);
});

export const login = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'Login';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const signup = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'Register';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const forgot_password = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'Password-Reset';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const check_otp = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'check_otp';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};


export const resetPassword = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'reset_password';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const getProfile = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'get_profile';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const update_profile = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'update_profile';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const update_password = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'change_password';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};


export const file_upload = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'add_document';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const sendMessage = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'insert_chat';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const _get_Chat = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'get_chat';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const get_Convertion = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'get_conversation';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const _notification = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'update_notification_status';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const add_rating = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'add_rating';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const get_category = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'get_category';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const get_document = async postdata => {
  const URL = DOMAIN + `get_document?user_id=${postdata}`;
  return authAxios.get(URL)
};

export const get_country = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'get_country';
  return authAxios.get(URL, postdata, {
    headers: headers,
  });
};
export const get_state = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'get_state';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const request_send = async postdata => {
  const URL = DOMAIN + `send_request_by_doctor?consultant_id=${postdata?.consultant_id}&doctor_id=${postdata?.doctor_id}&message=${postdata.message}`;
  return authAxios.post(URL)
};

export const get_request = async postdata => {
  const URL = DOMAIN + `get_doctor_request?consultant_id=${postdata.user_id}&status=${postdata.status}`;
  return authAxios.get(URL)
};

export const request_accepte = async postdata => {
  const URL = DOMAIN + `accept_reject_request?consultant_id=${postdata?.consultant_id}&request_id=${postdata?.id}&status=Accepted`;
  return authAxios.post(URL)
};

export const request_reject = async postdata => {
  const URL = DOMAIN + `accept_reject_request?consultant_id=${postdata?.consultant_id}&request_id=${postdata?.id}&status=Rejected`;
  return authAxios.post(URL)
};

export const get_doctorList = async postdata => {
  const URL = DOMAIN + `get_doctor?type=${postdata?.type}&user_id=${postdata?.user_id}`;
  return authAxios.get(URL)
};

export const get_notification = async postdata => {
  const URL = DOMAIN + `get_notifications?user_id=${postdata}`;
  return authAxios.get(URL)
};

export const get_card_details = async postdata => {
  const URL = DOMAIN + `get_card_detail?user_id=${postdata}`;
  return authAxios.get(URL)
};

export const add_card = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'add_card';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const update_card = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'update_card';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const report = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'add_reason_for_complaint';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const add_payment_request = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'add_payment_request';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const payment_request_status = async postdata => {
  const headers = { 'Content-Type': 'multipart/form-data' };
  const URL = DOMAIN + 'payment_request_status';
  return authAxios.post(URL, postdata, {
    headers: headers,
  });
};

export const get_card_token = async postdata => {
  const URL = DOMAIN + `get_token?card_number=${postdata?.card_number}&expiry_date=${postdata?.expiry_date}&expiry_month=${postdata?.expiry_month}&cvc_code=${postdata?.cvc_code}`;
  return authAxios.get(URL)
};

export const delete_card = async postdata => {
  const URL = DOMAIN + `delete_card_detail?card_id=${postdata}`;
  return authAxios.post(URL)
};

export const delete_account = async postdata => {
  const URL = DOMAIN + `delete_account?user_id=${postdata.user_id}&password=${postdata?.password}`;
  return authAxios.post(URL)
};

export const _payment_done = async postdata => {
  const URL = DOMAIN + `stripe_payment?doctor_id=${postdata?.doctor_id}&consultant_id=${postdata?.consultant_id}&payment_method=stripe&total_amount=${postdata?.total_amount}&token=${postdata?.token}&currency=USD`;
  // console.log("YRL", URL)
  return authAxios.get(URL)
};

export const delete_document = async postdata => {
  const URL = DOMAIN + `delete_document?document_id=${postdata}`;
  return authAxios.get(URL)
};

export const get_payment_request = async postdata => {
  const URL = DOMAIN + `get_payment_request?doctor_id=${postdata?.doctor_id}&consultant_id=${postdata?.consultant_id}`;
  return authAxios.get(URL)
};
