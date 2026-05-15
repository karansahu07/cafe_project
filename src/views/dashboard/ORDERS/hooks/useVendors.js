import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllVendors } from '../../../../services/apiService';

const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        };
        // Try /vendors/list, fallback to /users/fetchuser and filter for vendors
        let vendorsList = [];
        try {
          // const res = await axios.get(`${API_URL}/vendors/list`, config);
          await getAllVendors(true).then((response) => {
            if (response.success && Array.isArray(response.data)) {
              vendorsList = response.data.map((v) => ({ id: v.vendor_id, name: v.store_name }));
            }
          });
          console.log(vendorsList);

          // vendorsList = res.data.vendors || [];
        } catch {
          // fallback
          const res = await axios.get(`${API_URL}/users/fetchuser`, config);
          vendorsList = (res.data || []).filter((u) => u.role_id === 4); // 4 = vendor
        }
        setVendors(vendorsList);
      } catch (err) {
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [API_URL, token]);

  return { vendors, loading };
};

export default useVendors;
