import { getResolvedUserId, getResolvedVendorId } from '../../../utils/authSession';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zcafe.ekarigar.com';

const getAuthToken = () =>
  localStorage.getItem('token') ||
  localStorage.getItem('user_token') ||
  localStorage.getItem('vendor_ini_token') ||
  '';

export const getVendorUserId = () => {
  return getResolvedUserId() || getResolvedVendorId() || localStorage.getItem('user_id') || '';
};

const persistNewTokenIfAny = (data) => {
  const nextToken = data?.token || data?.data?.token;
  if (!nextToken) return;

  localStorage.setItem('token', nextToken);
  localStorage.setItem('user_token', nextToken);
  localStorage.setItem('vendor_ini_token', nextToken);
};

export const callVendorJson = async (endpoint, payload = {}, method = 'POST') => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: method === 'GET' ? undefined : JSON.stringify(payload)
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  persistNewTokenIfAny(data);
  return data;
};

export const callVendorForm = async (endpoint, formData, method = 'PUT') => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  persistNewTokenIfAny(data);
  return data;
};

export const loadVendorProfile = async () => {
  const userId = getVendorUserId();
  const res = await callVendorJson('/vendors/vendor-profile', {
    user_id: userId,
    role_id: 3
  });

  const profile = res?.data || res?.vendor || res || {};
  return {
    ...profile,
    user_id: profile?.user_id || userId,
    store_address: profile?.store_address || profile?.address || ''
  };
};

export const updateVendorProfileData = async (payload) => {
  const userId = getVendorUserId();
  const formData = new FormData();
  formData.append('role_id', '3');
  formData.append('user_id', String(userId));

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  return callVendorForm('/vendors/update-vendorProfile', formData, 'PUT');
};

export const updateVendorProfilePicture = async (file) => {
  const userId = getVendorUserId();
  const formData = new FormData();
  formData.append('user_id', String(userId));
  formData.append('role_id', '3');
  formData.append('worker_profilePic', file);

  return callVendorForm('/vendors/update-vendorProfile', formData, 'PUT');
};

export const changeVendorPassword = async (oldPassword, newPassword) => {
  const userId = getVendorUserId();
  return callVendorJson('/vendors/change-vendorPwd', {
    user_id: Number(userId),
    old_password: oldPassword,
    new_password: newPassword
  }, 'PUT');
};

export const updateShopProfileData = async (payload, file) => {
  const userId = getVendorUserId();
  const formData = new FormData();
  formData.append('user_id', String(userId));
  formData.append('role_id', '3');
  formData.append('store_name', payload?.store_name || '');
  formData.append('store_address', payload?.store_address || '');
  formData.append('business_reg_number', payload?.business_reg_number || '');
  formData.append('sin_code', payload?.sin_code || '');

  if (file) {
    formData.append('store_image', file);
  }

  return callVendorForm('/vendors/update-store', formData, 'PUT');
};

export const updateShopStatusData = async (status, startTime, closeTime) => {
  const userId = getVendorUserId();
  return callVendorJson('/vendors/vendor-status', {
    user_id: Number(userId),
    role_id: 3,
    status: Number(status),
    start_time: startTime,
    close_time: closeTime
  }, 'POST');
};

export const loadBankDetails = async () => {
  const userId = getVendorUserId();
  const res = await callVendorJson('/vendors/vendor-bankdetails', {
    user_id: Number(userId),
    role_id: 3
  }, 'POST');

  return res?.data || {};
};

export const saveBankDetails = async (bankData) => {
  const userId = getVendorUserId();
  return callVendorJson('/vendors/store-bank-details', {
    user_id: Number(userId),
    role_id: 3,
    bank_name: bankData?.bank_name || '',
    account_holder_name: bankData?.account_holder_name || '',
    transit_number: bankData?.transit_number || '',
    institution_number: bankData?.institution_number || '',
    account_number: bankData?.account_number || ''
  }, 'POST');
};
