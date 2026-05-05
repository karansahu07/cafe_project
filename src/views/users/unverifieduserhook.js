import { useState, useEffect, useCallback } from 'react';
import { getAllUnverifiedUsers, verifyUser } from '../../services/apiService';

export default function useUnverifiedUsers(user) {
  console.log(user);
  
  const [vendors, setVendors] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [userType, setUserType] = useState(user ||'vendors');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllUnverifiedUsers();
      if (response.success) {
        setVendors(response.vendors || []);
        setDeliveryPartners(response.delivery_partners || []);
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
setUserType(user)
  }, [user]);

  // Filtered users by type and search
  const filteredUsers = (userType === 'vendors' ? vendors : deliveryPartners).filter(user => {
    const name = userType === 'vendors' ? (user.storename || (user.firstname + ' ' + user.lastname)) : (user.firstname + ' ' + user.lastname);
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
    );
  });   

  // Open view modal and set status to 'in review' (3)
  const handleView = async (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
    setViewLoading(true);
    try {
      await verifyUser(user.user_id, 3); // 3 = In Review
      // Update local state
      const updateStatus = (arr) => arr.map(u => u.user_id === user.user_id ? { ...u, is_verified: 3 } : u);
      if (userType === 'vendors') setVendors(updateStatus);
      else setDeliveryPartners(updateStatus);
    } catch (e) {}
    setViewLoading(false);
  };

  // Approve (set status 1)
  const handleApprove = async () => {
    if (!selectedUser) return;
    setViewLoading(true);
    try {
      await verifyUser(selectedUser.user_id, 1); // 1 = Verified
        // // Remove from list
        // if (userType === 'vendors') setVendors(v => v.filter(u => u.user_id !== selectedUser.user_id));
        // else setDeliveryPartners(d => d.filter(u => u.user_id !== selectedUser.user_id));
     
      // Update status in list instead of removing
      const updateStatus = (arr) => arr.map(u => u.user_id === selectedUser.user_id ? { ...u, is_verified: 1 } : u);
      if (userType === 'vendors') setVendors(updateStatus);
      else setDeliveryPartners(updateStatus);
      setShowViewModal(false);
      setSelectedUser(null);
    } catch (e) {}
    setViewLoading(false);
  };

  // Reject (set status 2)
  const handleReject = async (user) => {
    if (!user) return;
    setViewLoading(true);
    try {
      await verifyUser(user.user_id, 2); // 2 = Rejected
      // Update status in list instead of removing
      const updateStatus = (arr) => arr.map(u => u.user_id === user.user_id ? { ...u, is_verified: 2 } : u);
      if (userType === 'vendors') setVendors(updateStatus);
      else setDeliveryPartners(updateStatus);
      setShowViewModal(false);
      setSelectedUser(null);
    } catch (e) {}
    setViewLoading(false);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  // Badge status
  const getBadgeStatus = (is_verified) => {
    switch (is_verified) {
      case 0: return { text: 'Pending', color: 'orange' };
      case 1: return { text: 'Verified', color: 'green' };
      case 2: return { text: 'Rejected', color: 'red' };
      case 3: return { text: 'In Review', color: 'blue' };
      default: return { text: 'Unknown', color: 'gray' };
    }
  };

  return {
    userType,
    setUserType,
    loading,
    search,
    setSearch,
    filteredUsers,
    showViewModal,
    selectedUser,
    handleView,
    handleApprove,
    handleReject,
    handleCloseModal,
    getBadgeStatus,
    viewLoading,
    fetchUsers,
  };
}
