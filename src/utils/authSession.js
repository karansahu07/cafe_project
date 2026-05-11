import { jwtDecode } from 'jwt-decode';
import { getRolebyid } from '../services/utils/role_manager';

export const getStoredToken = () => localStorage.getItem('token') || '';

export const decodeStoredToken = () => {
  const token = getStoredToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getResolvedRoleId = () => {
  const decoded = decodeStoredToken();
  const decodedRoleId = Number(decoded?.role_id);
  if (!Number.isNaN(decodedRoleId) && decodedRoleId > 0) return decodedRoleId;

  const localRoleId = Number(localStorage.getItem('role_id'));
  if (!Number.isNaN(localRoleId) && localRoleId > 0) return localRoleId;

  return null;
};

export const getResolvedRole = () => {
  const decoded = decodeStoredToken();
  if (decoded?.role) return decoded.role;

  const roleId = getResolvedRoleId();
  if (roleId) return getRolebyid(roleId);

  const localRole = localStorage.getItem('role');
  return localRole || null;
};

export const getHomeRouteFromRoleId = (roleId) => {
  return Number(roleId) === 3 ? '/new-home' : '/dashboard';
};

export const getResolvedHomeRoute = () => {
  const roleId = getResolvedRoleId();
  return getHomeRouteFromRoleId(roleId);
};

export const getResolvedUserId = () => {
  const decoded = decodeStoredToken();
  const decodedUserId = decoded?.user_id ?? decoded?.id;
  if (decodedUserId !== undefined && decodedUserId !== null && String(decodedUserId).trim() !== '') {
    return String(decodedUserId);
  }

  const localUserId = localStorage.getItem('user_id');
  if (localUserId && String(localUserId).trim() !== '') {
    return String(localUserId);
  }

  return null;
};

export const getResolvedVendorId = () => {
  const decoded = decodeStoredToken();
  const decodedVendorId = decoded?.vendor_id;
  if (decodedVendorId !== undefined && decodedVendorId !== null && String(decodedVendorId).trim() !== '') {
    return String(decodedVendorId);
  }

  const resolvedUserId = getResolvedUserId();
  if (resolvedUserId) {
    return String(resolvedUserId);
  }

  const localVendorId = localStorage.getItem('vendor_id');
  if (localVendorId && String(localVendorId).trim() !== '') {
    return String(localVendorId);
  }

  return null;
};
