import React, { useState } from "react";
import  "/src/assets/scss/pages/usermodal.scss";
import { Spin, Badge, Tag, Image, Drawer, Button } from "antd";
import { 
  User, 
  FileText, 
  Phone, 
  Mail, 
  Calendar, 
  Building, 
  Store, 
  MapPin, 
  CreditCard, 
  Receipt, 
  Image as ImageIcon, 
  Shield, 
  Bike, 
  Flag, 
  FileImage 
} from "lucide-react";
import { formatPhone } from "../../../services/utils/gen_utility";

import { ArrowLeft, Check, X as XIcon, XCircle } from "lucide-react";

const UserPreview = ({ user, userType, loading, open = false, onClose, onApprove, onReject }) => {
  if (!user) return null;

  const InfoCard = ({ icon: IconComponent, label, value, className = "" }) => (
    <div className={`modern-info-card ${className}`} style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #961818 0%, #0a5d32 100%)'
      }}></div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(8, 139, 70, 0.3)'
        }}>
          <IconComponent size={20} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>{label}</div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1e293b',
            wordBreak: 'break-word',
            lineHeight: '1.5'
          }}>{value || '-'}</div>
        </div>
      </div>
    </div>
  );

  const isSmall = typeof window !== 'undefined' && window.innerWidth < 768;
  const drawerWidth = typeof window !== 'undefined' 
    ? (window.innerWidth >= 1200 
        ? 1000 
        : window.innerWidth >= 768 
          ? 800 
          : '100%') 
    : 1000;
  const avatarSize = isSmall ? 52 : 64;
  const nameFontSize = isSmall ? 18 : 22;
  const headerPadding = isSmall ? '10px 10px' : '12px 12px';
  const tagColor = user?.is_verified === 1 ? 'success' : user?.is_verified === 2 ? 'error' : 'processing';

  const HeaderContent = (
    <div style={{ 
      margin: '-16px -24px -16px -56px', 
      padding: headerPadding, 
      background: 'linear-gradient(135deg, #961818 0%, #065a30 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3
      }}></div>

      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
        <Button
          type="text"
          size="middle"
          onClick={onClose}
          icon={<ArrowLeft size={20} />}
          style={{
            color: '#fff',
            background: 'transparent',
            border: 'none',
            padding: '0 4px',
            lineHeight: 1
          }}
        />
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
        paddingLeft: 28,
        flexWrap: 'nowrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '12px' : '16px', minWidth: 0, flex: 1 }}>
          <div style={{ 
            position: 'relative',
            padding: isSmall ? '2px' : '3px',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            borderRadius: '50%',
            boxShadow: '0 6px 24px rgba(0,0,0,0.25)'
          }}>
            {user.profile_pic ? (
              <Image
                src={user.profile_pic}
                alt="Profile Picture"
                style={{
                  width: `${avatarSize}px`,
                  height: `${avatarSize}px`,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid white'
                }}
                preview={{
                  mask: 'Click to preview'
                }}
              />
            ) : (
              <div style={{
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isSmall ? '20px' : '24px',
                fontWeight: '800',
                color: 'white'
              }}>
                {user.firstname?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ color: '#fff', minWidth: 0 }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: `${nameFontSize}px`, 
              fontWeight: 800,
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user.firstname} {user.lastname}
            </h2>
            {userType === 'vendors' && (user.storename || user.store_name) ? (
              <div style={{ 
                marginTop: 2,
                color: '#fff',
                fontSize: isSmall ? '12px' : '13px',
                fontWeight: 600,
                opacity: 0.95,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {(user.storename || user.store_name)}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: isSmall ? 4 : 6, marginLeft: 'auto' }}>
          <Tag 
            color={tagColor}
            type="primary"
            bordered={false}
          >
            {user?.is_verified === 1 ? (
              <>Verified</>
            ) : user?.is_verified === 2 ? (
              <>Rejected</>
            ) : (
              <>Pending</>
            )}
          </Tag>
          <div style={{
            padding: isSmall ? '2px 6px' : '2px 8px',
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '14px',
            fontSize: isSmall ? '11px' : '12px',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff'
          }}>
            ID: {user.user_id || user.custom_id || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      closable={true}
      placement="right"
      width={drawerWidth}
      zIndex={9999}
      title={HeaderContent}
      footer={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid #f0f0f0',
          background: 'white'
        }}>
          <div style={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user?.is_verified === 1 ? (
              <>Verified User</>
            ) : user?.is_verified === 2 ? (
              <>Rejected User</>
            ) : (
              <>Pending Verification</>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              onClick={onClose}
              size="middle"
              type="default"
              icon={<ArrowLeft size={16} />}
            >
              Close
            </Button>
            <Button 
              type="primary" 
              onClick={() => onApprove?.(user)}
              disabled={user?.is_verified === 1}
              size="middle"
              icon={<Check size={16} />}
              style={{ background: '#961818', borderColor: '#961818' }}
            >
              {user?.is_verified === 1 ? 'Already Approved' : 'Approve'}
            </Button>
            <Button 
              danger 
              onClick={() => onReject?.(user)}
              disabled={user?.is_verified === 2}
              size="middle"
              icon={<XCircle size={16} />}
              type="primary"
              ghost
            >
              {user?.is_verified === 2 ? 'Already Rejected' : 'Reject'}
            </Button>
          </div>
        </div>
      }
    >
      <Spin spinning={loading}>
        <div style={{
          background: '#ffffff',
          minHeight: '100%'
        }}>
          <div style={{
            background: '#ffffff'
          }}>
            {/* Basic Information */}
            <div style={{ marginBottom: '40px' }}>
              <h4 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                borderBottom: '3px solid #961818',
                paddingBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={20} color="white" />
                </div>
                Basic Information
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
                gap: '20px',
                marginBottom: '32px',
                width: '100%'
              }}>
                <InfoCard
                  icon={User}
                  label="Username"
                  value={user.username}
                />
                {user.custom_id && (
                  <InfoCard
                    icon={FileText}
                    label="Custom ID"
                    value={user.custom_id}
                  />
                )}
                <InfoCard
                  icon={Phone}
                  label="Phone Number"
                  value={formatPhone(user.phonenumber, user.prefix)}
                />
                <InfoCard
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                />
                <InfoCard
                  icon={Calendar}
                  label="Joined Date"
                  value={user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : '-'}
                />
              </div>
            </div>

            {/* Type Specific Information */}
            {userType === 'vendors' ? (
              <>
                {/* Business Information */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1e293b',
                    borderBottom: '3px solid #961818',
                    paddingBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building size={20} color="white" />
                    </div>
                    Business Information
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
                    gap: '20px',
                    marginBottom: '32px',
                    width: '100%'
                  }}>
                    <InfoCard
                      icon={Store}
                      label="Store Name"
                      value={user.store_name}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Store Address"
                      value={user.store_address}
                    />
                    <InfoCard
                      icon={FileText}
                      label="SIN Code"
                      value={user.sin_code}
                    />
                    <InfoCard
                      icon={CreditCard}
                      label="Business Registration"
                      value={user.business_reg_number}
                    />
                    {user.bussiness_license_number && (
                      <InfoCard
                        icon={FileText}
                        label="Business License"
                        value={user.bussiness_license_number}
                      />
                    )}
                    {user.gst_number && (
                      <InfoCard
                        icon={Receipt}
                        label="GST Number"
                        value={user.gst_number}
                      />
                    )}
                  </div>
                </div>

                {/* Documents & Images */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1e293b',
                    borderBottom: '3px solid #961818',
                    paddingBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ImageIcon size={20} color="white" />
                    </div>
                    Documents & Images
                  </h4>
                  
                  <Image.PreviewGroup >
                    <div className="image-grid">
                      {user.store_image && (
                        <Image src={user.store_image} alt="Store Image" />
                      )}
                      {user.identity_proof && (
                        <Image src={user.identity_proof} alt="Identity Proof" />
                      )}
                      {user.bussiness_license_number_pic && (
                        <Image src={user.bussiness_license_number_pic} alt="Business License" />
                      )}
                      {user.gst_number_pic && (
                        <Image src={user.gst_number_pic} alt="GST Document" />
                      )}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </>
            ) : (
              <>
                {/* Personal Information */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1e293b',
                    borderBottom: '3px solid #961818',
                    paddingBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={20} color="white" />
                    </div>
                    Personal Information
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
                    gap: '20px',
                    marginBottom: '32px',
                    width: '100%'
                  }}>
                    <InfoCard
                      icon={Calendar}
                      label="Date of Birth"
                      value={user.dob}
                    />
                    <InfoCard
                      icon={Phone}
                      label="Other Phone"
                      value={user.other_phone_number}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Address"
                      value={user.address}
                    />
                    <InfoCard
                      icon={FileText}
                      label="SIN Code"
                      value={user.sin_code}
                    />
                    <InfoCard
                      icon={Flag}
                      label="Country Status"
                      value={user.country_status}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Current Location"
                      value={user.rider_lat && user.rider_lng ? `${user.rider_lat}, ${user.rider_lng}` : '-'}
                    />
                  </div>
                </div>

                {/* License Information */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1e293b',
                    borderBottom: '3px solid #961818',
                    paddingBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CreditCard size={20} color="white" />
                    </div>
                    License Information
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
                    gap: '20px',
                    marginBottom: '32px',
                    width: '100%'
                  }}>
                    <InfoCard
                      icon={CreditCard}
                      label="License Number"
                      value={user.license_number}
                    />
                    <InfoCard
                      icon={Calendar}
                      label="License Expiry Date"
                      value={user.license_expiry_date}
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1e293b',
                    borderBottom: '3px solid #961818',
                    paddingBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Bike size={20} color="white" />
                    </div>
                    Vehicle Information
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
                    gap: '20px',
                    marginBottom: '32px',
                    width: '100%'
                  }}>
                    <InfoCard
                      icon={User}
                      label="Vehicle Owner Name"
                      value={user.vehicle_owner_name}
                    />
                    <InfoCard
                      icon={FileText}
                      label="Registration Number"
                      value={user.vehicle_registration_number}
                    />
                    <InfoCard
                      icon={Bike}
                      label="Vehicle Type"
                      value={user.vehicle_type}
                    />
                    <InfoCard
                      icon={Calendar}
                      label="Registration Expiry"
                      value={user.registraion_expiry_date}
                    />
                  </div>
                </div>

                {/* Documents & Images */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1e293b',
                    borderBottom: '3px solid #961818',
                    paddingBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #961818 0%, #0a5d32 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileImage size={20} color="white" />
                    </div>
                    Documents & Images
                  </h4>
                  <Image.PreviewGroup>
                    <div className="image-grid">
                      {user.profile_pic && (
                        <div className="document-card">
                          <div className="card-header">
                            <User size={16} />
                            <span>Profile Picture</span>
                          </div>
                          <div className="card-image">
                            <Image width={100} height={100} src={user.profile_pic} alt="Profile Picture" />
                          </div>
                        </div>
                      )}
                      {user.identity_proof && (
                        <div className="document-card">
                          <div className="card-header">
                            <Shield size={16} />
                            <span>Identity Proof</span>
                          </div>
                          <div className="card-image">
                            <Image src={user.identity_proof} alt="Identity Proof" />
                          </div>
                        </div>
                      )}
                      {user.rider_license_image && (
                        <div className="document-card">
                          <div className="card-header">
                            <CreditCard size={16} />
                            <span>Rider License</span>
                          </div>
                          <div className="card-image">
                            <Image src={user.rider_license_image} alt="Rider License" />
                          </div>
                        </div>
                      )}
                      {user.registration_doc && (
                        <div className="document-card">
                          <div className="card-header">
                            <FileText size={16} />
                            <span>Registration Document</span>
                          </div>
                          <div className="card-image">
                            <Image src={user.registration_doc} alt="Registration Document" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </>
            )}
          </div>
        </div>
      </Spin>
    </Drawer>
  );
};

export default UserPreview;