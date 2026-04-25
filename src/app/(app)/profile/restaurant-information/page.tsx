"use client"

import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Image as ImageIcon, 
  X, 
  Check, 
  Trash2, 
  AlertCircle, 
  ChevronDown,
  Wifi,
  Music,
  Wind,
  Droplet,
  ParkingCircle,
  Sun,
  Users,
  Siren,
  User,
  GraduationCap,
  Map,
  Accessibility,
  Car,
  Building2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { usePut, useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantInformationPage() {
  const { selectedBranch } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  // States matching the source UI
  const [logo, setLogo] = useState<string | null>(null);
  const [indoorPhoto, setIndoorPhoto] = useState<string | null>(null);
  const [outdoorPhoto, setOutdoorPhoto] = useState<string | null>(null);
  const [kitchenPhoto, setKitchenPhoto] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    cuisines: [] as string[],
    category: ''
  });
  const [cuisineInput, setCuisineInput] = useState('');

  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [operationalDetails, setOperationalDetails] = useState({
    deliveryRange: '',
    prepTime: '',
    costForTwo: ''
  });

  const [contact, setContact] = useState({
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    whatsapp: ''
  });
  
  const [tempContact, setTempContact] = useState({ ...contact });
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [services, setServices] = useState({
    delivery: true,
    takeaway: true,
    dineIn: false,
    booking: true
  });

  const [licenseInfo, setLicenseInfo] = useState({
    gst: '',
    gstCategory: '',
    fssai: '',
    cin: '',
    pan: ''
  });

  const [facilities, setFacilities] = useState({
    wifi: false,
    parking: false,
    ac: false,
    wheelchair: false,
    liveMusic: false,
    smokingArea: false,
    washroom: false,
    outdoorSeating: false,
    familyFriendly: false,
    womenSafety: false,
    lgbtq: false,
    groups: false,
    students: false,
    tourists: false,
    wheelchairSeating: false,
    wheelchairToilet: false,
    kerbsidePickup: false,
    driveThrough: false
  });

  const [status, setStatus] = useState('Profile Incomplete');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showUnderReview, setShowUnderReview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize data from API
  useEffect(() => {
    if (profileResponse?.data?.restaurantInfo) {
      const data = profileResponse.data.restaurantInfo;
      
      setBasicInfo({
        name: data.name || '',
        cuisines: typeof data.cuisines === 'string' ? data.cuisines.split(',').map((c: string) => c.trim()) : (Array.isArray(data.cuisines) ? data.cuisines : []),
        category: data.type || ''
      });

      setLocation({
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pinCode: data.pincode || ''
      });

      setContact({
        primaryPhone: data.phone || '',
        secondaryPhone: data.secondaryPhone || '',
        email: data.email || '',
        whatsapp: data.whatsapp || ''
      });

      setLicenseInfo({
        gst: data.gst || '',
        gstCategory: data.gstCategory || '',
        fssai: data.fssai || '',
        cin: data.cin || '',
        pan: data.pan || ''
      });

      // Map other fields if they exist in the backend
      if (data.operationalDetails) setOperationalDetails(data.operationalDetails);
      if (data.services) setServices(data.services);
      if (data.facilities) setFacilities(data.facilities);
      if (data.status) setStatus(data.status);
      if (data.logo) setLogo(data.logo);
    }
  }, [profileResponse]);

  // Detect any changes to enable save button
  useEffect(() => {
    // Simple check for now, can be more robust
    setHasChanges(true);
  }, [basicInfo, location, contact, services, licenseInfo, facilities, operationalDetails, status, logo, indoorPhoto, outdoorPhoto, kitchenPhoto]);

  const handleCuisineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const val = cuisineInput.trim();
      if (val && !basicInfo.cuisines.includes(val)) {
        setBasicInfo({ ...basicInfo, cuisines: [...basicInfo.cuisines, val] });
      }
      setCuisineInput('');
    } else if (e.key === 'Backspace' && !cuisineInput && basicInfo.cuisines.length > 0) {
      setBasicInfo({
        ...basicInfo,
        cuisines: basicInfo.cuisines.slice(0, -1)
      });
    }
  };

  const handleCuisineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(' ') && val.trim()) {
      if (!basicInfo.cuisines.includes(val.trim())) {
        setBasicInfo({ ...basicInfo, cuisines: [...basicInfo.cuisines, val.trim()] });
      }
      setCuisineInput('');
    } else {
      setCuisineInput(val);
    }
  };

  const removeCuisine = (tagToRemove: string) => {
    setBasicInfo({
      ...basicInfo,
      cuisines: basicInfo.cuisines.filter(tag => tag !== tagToRemove)
    });
  };

  const handleContactSaveClick = () => {
    if (JSON.stringify(contact) !== JSON.stringify(tempContact)) {
      setShowOtpModal(true);
    } else {
      setIsEditingContact(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    if (otp.join('').length === 6) {
      setContact(tempContact);
      setShowOtpModal(false);
      setIsEditingContact(false);
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleMainSave = () => {
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    const payload = {
      restaurantInfo: {
        name: basicInfo.name,
        type: basicInfo.category,
        cuisines: basicInfo.cuisines.join(', '),
        address: location.address,
        city: location.city,
        state: location.state,
        pincode: location.pinCode,
        phone: contact.primaryPhone,
        secondaryPhone: contact.secondaryPhone,
        email: contact.email,
        whatsapp: contact.whatsapp,
        gst: licenseInfo.gst,
        gstCategory: licenseInfo.gstCategory,
        fssai: licenseInfo.fssai,
        cin: licenseInfo.cin,
        pan: licenseInfo.pan,
        operationalDetails,
        services,
        facilities,
        status,
        logo
      }
    };

    updateProfile(payload, {
      onSuccess: () => {
        setShowSaveConfirm(false);
        // If critical info changed, show under review
        const criticalChanged = true; // Simplified for now
        if (criticalChanged) {
          setShowUnderReview(true);
        } else {
          router.back();
        }
        toast({
          title: "Profile Updated",
          description: "Your restaurant information has been saved.",
        });
      },
      onError: (err: any) => {
        toast({
          title: "Update Failed",
          description: err.message || "Failed to save changes",
          variant: "destructive"
        });
      }
    });
  };

  const handleLogoUpload = () => setShowCropModal(true);
  const handleCropSave = () => {
    // Placeholder image
    setLogo('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop');
    setShowCropModal(false);
  };

  const PhotoUpload = ({ label, photo, setPhoto }: { label: string, photo: string | null, setPhoto: (val: string | null) => void }) => (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 mb-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png, image/jpeg';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.size > 15 * 1024 * 1024) {
            alert('File size exceeds 15MB limit.');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            setPhoto(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }}>
      {photo ? (
        <img src={photo} alt={label} className="w-full h-32 rounded-xl object-cover mb-3 shadow-sm" />
      ) : (
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#2563EB] shadow-sm mb-3">
          <Camera size={24} />
        </div>
      )}
      <p className="text-[14px] font-semibold text-[#2563EB]">{photo ? `Change ${label}` : `Upload ${label}`}</p>
      <p className="text-[12px] text-slate-400 mt-1">PNG, JPG up to 15MB</p>
    </div>
  );

  const Toggle = ({ checked, onChange, label, icon: Icon }: { checked: boolean, onChange: () => void, label: string, icon?: any }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${checked ? 'bg-blue-50 text-[#2563EB]' : 'bg-slate-100 text-slate-400'}`}>
            <Icon size={18} />
          </div>
        )}
        <span className="text-[15px] font-medium text-slate-800">{label}</span>
      </div>
      <div 
        role="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(); }}
        className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer ${checked ? 'bg-[#2563EB]' : 'bg-slate-200'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder = "", disabled = false }: any) => (
    <div className="space-y-1.5 mb-4">
      <label className="text-[13px] font-medium text-slate-600">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      />
    </div>
  );

  const CardComponent = ({ title, children, action }: { title?: string, children: React.ReactNode, action?: React.ReactNode }) => (
    <div className="bg-white rounded-[18px] p-4 border border-[#E5E7EB] shadow-sm mb-4">
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Outlet Info</h1>
        </div>
        <button type="button" onClick={handleMainSave} className="text-[#2563EB] font-semibold text-[15px] px-2 active:opacity-70">
          Save
        </button>
      </header>

      <div className="p-4 space-y-4 w-full">
        {/* Outlet Profile Card */}
        <CardComponent>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <div 
                onClick={handleLogoUpload}
                className="w-[80px] h-[80px] rounded-[14px] border border-dashed border-[#D1D5DB] flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
              >
                {logo ? (
                  <>
                    <img src={logo} alt="Outlet Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon size={24} className="text-slate-400 mb-1" />
                    <span className="text-[10px] font-medium text-slate-500">Upload</span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-medium text-[#2563EB] cursor-pointer" onClick={handleLogoUpload}>
                {logo ? 'Change Logo' : 'Upload Logo'}
              </span>
            </div>
            <div className="flex-1 pt-1">
              <h2 className="text-[18px] font-bold text-slate-900 leading-tight mb-1">{basicInfo.name}</h2>
              <p className="text-[13px] font-medium text-slate-500 mb-2">
                {basicInfo.cuisines.length > 0 ? basicInfo.cuisines.join(' • ') : 'No cuisines specified'}
              </p>
            </div>
          </div>
        </CardComponent>

        {/* Basic Outlet Information Card */}
        <CardComponent title="Basic Information">
          <InputField label="Restaurant Name" value={basicInfo.name} onChange={(v: string) => setBasicInfo({...basicInfo, name: v})} />
          
          <div className="space-y-1.5 mb-4">
            <label className="text-[13px] font-medium text-slate-600">Restaurant Type</label>
            <div className="relative">
              <select 
                value={basicInfo.category}
                onChange={(e) => setBasicInfo({...basicInfo, category: e.target.value})}
                className="w-full h-12 px-4 border border-slate-200 rounded-xl appearance-none focus:border-[#2563EB] bg-slate-50 focus:bg-white transition-colors text-[15px] font-medium text-slate-900 focus:outline-none"
              >
                <option value="" disabled>Select Type</option>
                <option value="Cafe">Cafe</option>
                <option value="Cloud Kitchen">Cloud Kitchen</option>
                <option value="Fine Dining">Fine Dining</option>
                <option value="QSR">QSR</option>
                <option value="Takeaway Only">Takeaway Only</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 mb-4">
            <label className="text-[13px] font-medium text-slate-600">Cuisine Types</label>
            <div className="min-h-[48px] p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 focus-within:border-[#2563EB] focus-within:bg-white transition-colors">
              {basicInfo.cuisines.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#2563EB] text-[13px] font-medium rounded-lg">
                  {tag}
                  <button onClick={() => removeCuisine(tag)} className="hover:bg-blue-100 p-0.5 rounded-full">
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={cuisineInput}
                onChange={handleCuisineChange}
                onKeyDown={handleCuisineKeyDown}
                placeholder={basicInfo.cuisines.length === 0 ? "Type and press space..." : ""}
                className="flex-1 min-w-[120px] bg-transparent text-[15px] text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </CardComponent>

        {/* Restaurant Photos Card */}
        <CardComponent title="Restaurant Photos">
          <PhotoUpload label="Indoor Photo" photo={indoorPhoto} setPhoto={setIndoorPhoto} />
          <PhotoUpload label="Outdoor Photo" photo={outdoorPhoto} setPhoto={setOutdoorPhoto} />
          <PhotoUpload label="Kitchen Photo" photo={kitchenPhoto} setPhoto={setKitchenPhoto} />
        </CardComponent>

        {/* Operational Details Card */}
        <CardComponent title="Operational Details">
          <div className="space-y-1.5 mb-4">
            <label className="text-[13px] font-medium text-slate-600">Delivery Range (Max 10km)</label>
            <div className="relative">
              <select 
                value={operationalDetails.deliveryRange}
                onChange={(e) => setOperationalDetails({...operationalDetails, deliveryRange: e.target.value})}
                className="w-full h-12 px-4 border border-slate-200 rounded-xl appearance-none focus:border-[#2563EB] bg-slate-50 focus:bg-white transition-colors text-[15px] font-medium text-slate-900 focus:outline-none"
              >
                <option value="" disabled>Select Range</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(km => (
                  <option key={km} value={km.toString()}>{km} km</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <InputField 
            label="Average Preparation Time (minutes)" 
            value={operationalDetails.prepTime} 
            onChange={(v: string) => setOperationalDetails({...operationalDetails, prepTime: v.replace(/\D/g, '')})} 
            type="tel"
            placeholder="e.g. 30"
          />

          <InputField 
            label="Cost for Two (₹)" 
            value={operationalDetails.costForTwo} 
            onChange={(v: string) => setOperationalDetails({...operationalDetails, costForTwo: v.replace(/\D/g, '')})} 
            type="tel"
            placeholder="e.g. 800"
          />
        </CardComponent>

        {/* Location Details Card */}
        <CardComponent title="Location Details">
          <InputField label="Street Address" value={location.address} onChange={(v: string) => setLocation({...location, address: v})} placeholder="Full street address" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="City" value={location.city} onChange={(v: string) => setLocation({...location, city: v})} placeholder="City" />
            <InputField label="Pincode" value={location.pinCode} onChange={(v: string) => setLocation({...location, pinCode: v})} placeholder="Pincode" />
          </div>
          <div className="space-y-1.5 mb-4">
            <label className="text-[13px] font-medium text-slate-600">State</label>
            <div className="relative">
              <select 
                value={location.state}
                onChange={(e) => setLocation({...location, state: e.target.value})}
                className="w-full h-12 px-4 border border-slate-200 rounded-xl appearance-none focus:border-[#2563EB] bg-slate-50 focus:bg-white transition-colors text-[15px] font-medium text-slate-900 focus:outline-none"
              >
                <option value="" disabled>Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <button type="button" className="w-full mt-2 h-[52px] rounded-[16px] border border-slate-200 bg-slate-50 flex items-center justify-center gap-2 text-slate-600 font-semibold text-[16px] active:scale-[0.98] transition-all">
            <MapPin size={18} className="text-[#2563EB]" />
            Pin location on map
          </button>
        </CardComponent>

        {/* Contact Information Card */}
        <CardComponent 
          title="Contact Information" 
          action={
            !isEditingContact ? (
              <button type="button" onClick={() => { setTempContact({...contact}); setIsEditingContact(true); }} className="text-[#2563EB] text-[13px] font-semibold">Edit</button>
            ) : (
              <button type="button" onClick={handleContactSaveClick} className="text-[#2563EB] text-[13px] font-semibold">Save</button>
            )
          }
        >
          <InputField disabled={!isEditingContact} label="Primary Phone Number" value={isEditingContact ? tempContact.primaryPhone : contact.primaryPhone} onChange={(v: string) => setTempContact({...tempContact, primaryPhone: v})} type="tel" />
          <InputField disabled={!isEditingContact} label="Secondary Phone Number" value={isEditingContact ? tempContact.secondaryPhone : contact.secondaryPhone} onChange={(v: string) => setTempContact({...tempContact, secondaryPhone: v})} type="tel" />
          <InputField disabled={!isEditingContact} label="Email Address" value={isEditingContact ? tempContact.email : contact.email} onChange={(v: string) => setTempContact({...tempContact, email: v})} type="email" />
          <InputField disabled={!isEditingContact} label="WhatsApp Number" value={isEditingContact ? tempContact.whatsapp : contact.whatsapp} onChange={(v: string) => setTempContact({...tempContact, whatsapp: v})} type="tel" />
        </CardComponent>

        {/* Service Types Card */}
        <CardComponent title="Service Types">
          <div className="divide-y divide-slate-100">
            <Toggle label="Delivery" checked={services.delivery} onChange={() => setServices({...services, delivery: !services.delivery})} />
            <Toggle label="Takeaway" checked={services.takeaway} onChange={() => setServices({...services, takeaway: !services.takeaway})} />
            <Toggle label="Dine-In" checked={services.dineIn} onChange={() => setServices({...services, dineIn: !services.dineIn})} />
            <Toggle label="Booking" checked={services.booking} onChange={() => setServices({...services, booking: !services.booking})} />
          </div>
        </CardComponent>

        {/* Business License Card */}
        <CardComponent title="Business License">
          <InputField label="GST Number" value={licenseInfo.gst} onChange={(v: string) => setLicenseInfo({...licenseInfo, gst: v})} />
          
          <div className="space-y-3 mb-4">
            <label className="text-[13px] font-medium text-slate-600">GST Category</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Freshly Prepared Food', desc: 'We collect GST from consumer' },
                { label: 'MRP Packed Items', desc: 'We don\'t take GST from consumer' },
                { label: 'Hybrid (Both)', desc: 'We take GST only on freshly prepared items' }
              ].map(opt => (
                <label key={opt.label} onClick={() => setLicenseInfo({...licenseInfo, gstCategory: opt.label})} className={`flex items-start p-3 border rounded-2xl cursor-pointer transition-all ${licenseInfo.gstCategory === opt.label ? 'border-[#2563EB] bg-blue-50' : 'border-slate-200 bg-white'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 shrink-0 ${licenseInfo.gstCategory === opt.label ? 'border-[#2563EB]' : 'border-slate-300'}`}>
                    {licenseInfo.gstCategory === opt.label && <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />}
                  </div>
                  <div>
                    <p className={`text-[14px] font-medium ${licenseInfo.gstCategory === opt.label ? 'text-[#2563EB]' : 'text-slate-700'}`}>{opt.label}</p>
                    <p className={`text-[12px] mt-0.5 ${licenseInfo.gstCategory === opt.label ? 'text-blue-600/80' : 'text-slate-500'}`}>{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <InputField label="FSSAI License Number" value={licenseInfo.fssai} onChange={(v: string) => setLicenseInfo({...licenseInfo, fssai: v})} />
          <InputField label="CIN (Corporate Identity Number)" value={licenseInfo.cin} onChange={(v: string) => setLicenseInfo({...licenseInfo, cin: v})} />
          <InputField label="PAN Number" value={licenseInfo.pan} onChange={(v: string) => setLicenseInfo({...licenseInfo, pan: v})} />
        </CardComponent>

        {/* Outlet Status Card */}
        <CardComponent title="Outlet Status">
          <div className="space-y-3">
            {['Live on Crevings', 'Temporarily Closed', 'Profile Incomplete'].map((s) => (
              <label key={s} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setStatus(s)}>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${status === s ? 'border-[#2563EB]' : 'border-slate-300'}`}>
                  {status === s && <div className="w-3 h-3 rounded-full bg-[#2563EB]" />}
                </div>
                <span className={`text-[15px] font-medium ${status === s ? 'text-slate-900' : 'text-slate-600'}`}>{s}</span>
              </label>
            ))}
          </div>
        </CardComponent>

        {/* Facilities Card */}
        <CardComponent title="Facilities">
          <div className="divide-y divide-slate-100">
            <Toggle label="Wi-Fi" icon={Wifi} checked={facilities.wifi} onChange={() => setFacilities({...facilities, wifi: !facilities.wifi})} />
            <Toggle label="Parking" icon={ParkingCircle} checked={facilities.parking} onChange={() => setFacilities({...facilities, parking: !facilities.parking})} />
            <Toggle label="Air Conditioning" icon={Wind} checked={facilities.ac} onChange={() => setFacilities({...facilities, ac: !facilities.ac})} />
            <Toggle label="Wheelchair Accessible" icon={Accessibility} checked={facilities.wheelchair} onChange={() => setFacilities({...facilities, wheelchair: !facilities.wheelchair})} />
            <Toggle label="Live Music" icon={Music} checked={facilities.liveMusic} onChange={() => setFacilities({...facilities, liveMusic: !facilities.liveMusic})} />
            <Toggle label="Smoking Area" icon={XCircle} checked={facilities.smokingArea} onChange={() => setFacilities({...facilities, smokingArea: !facilities.smokingArea})} />
            <Toggle label="Washroom" icon={Droplet} checked={facilities.washroom} onChange={() => setFacilities({...facilities, washroom: !facilities.washroom})} />
            <Toggle label="Outdoor Seating" icon={Sun} checked={facilities.outdoorSeating} onChange={() => setFacilities({...facilities, outdoorSeating: !facilities.outdoorSeating})} />
            <Toggle label="Family Friendly" icon={Users} checked={facilities.familyFriendly} onChange={() => setFacilities({...facilities, familyFriendly: !facilities.familyFriendly})} />
            <Toggle label="Women Safety" icon={Siren} checked={facilities.womenSafety} onChange={() => setFacilities({...facilities, womenSafety: !facilities.womenSafety})} />
            <Toggle label="LGBTQ+ Friendly" icon={User} checked={facilities.lgbtq} onChange={() => setFacilities({...facilities, lgbtq: !facilities.lgbtq})} />
            <Toggle label="Good for Groups" icon={Users} checked={facilities.groups} onChange={() => setFacilities({...facilities, groups: !facilities.groups})} />
            <Toggle label="University Students" icon={GraduationCap} checked={facilities.students} onChange={() => setFacilities({...facilities, students: !facilities.students})} />
            <Toggle label="Good for Tourists" icon={Map} checked={facilities.tourists} onChange={() => setFacilities({...facilities, tourists: !facilities.tourists})} />
            <Toggle label="Wheelchair-accessible Seating" icon={Accessibility} checked={facilities.wheelchairSeating} onChange={() => setFacilities({...facilities, wheelchairSeating: !facilities.wheelchairSeating})} />
            <Toggle label="Wheelchair-accessible Toilet" icon={Accessibility} checked={facilities.wheelchairToilet} onChange={() => setFacilities({...facilities, wheelchairToilet: !facilities.wheelchairToilet})} />
            <Toggle label="Kerbside Pickup" icon={Car} checked={facilities.kerbsidePickup} onChange={() => setFacilities({...facilities, kerbsidePickup: !facilities.kerbsidePickup})} />
            <Toggle label="Drive-through" icon={Building2} checked={facilities.driveThrough} onChange={() => setFacilities({...facilities, driveThrough: !facilities.driveThrough})} />
          </div>
        </CardComponent>

      </div>

      {/* Save Button */}
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-40 w-full flex justify-center">
        <button 
          type="button"
          onClick={handleMainSave} 
          disabled={isPending || !hasChanges}
          className={`w-full max-w-md h-[52px] rounded-[16px] font-semibold text-[16px] transition-all shadow-sm ${hasChanges ? 'bg-[#2563EB] text-[#FFFFFF] active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          {isPending ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>

      {/* OTP Modal for Contact Info */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-bold text-slate-900">Verify Changes</h3>
              <button onClick={() => setShowOtpModal(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-[15px] text-slate-600 mb-6 leading-relaxed">
              Please enter the 6-digit OTP sent to your primary phone number to confirm contact changes.
            </p>
            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-[24px] font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              ))}
            </div>
            <button 
              onClick={verifyOtp}
              disabled={otp.join('').length !== 6}
              className="w-full h-[52px] bg-[#2563EB] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-[16px] font-semibold text-[16px] active:scale-[0.98] transition-all"
            >
              Verify & Save
            </button>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-xl animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#2563EB]">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-2">Save Changes?</h3>
            <p className="text-[15px] text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to save these changes to your outlet information?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSaveConfirm(false)}
                className="flex-1 h-[48px] bg-slate-100 text-slate-700 rounded-[14px] font-semibold text-[15px] active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSave}
                className="flex-1 h-[48px] bg-[#2563EB] text-white rounded-[14px] font-semibold text-[15px] active:scale-[0.98] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Under Review Modal */}
      {showUnderReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-xl animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-2">Profile Under Review</h3>
            <p className="text-[15px] text-slate-600 mb-6 leading-relaxed">
              You have changed critical business information (Name, License, Location, or Contact). Your profile is currently under review by our team. This usually takes 24-48 hours.
            </p>
            <button 
              onClick={() => { setShowUnderReview(false); router.back(); }}
              className="w-full h-[52px] bg-[#2563EB] text-white rounded-[16px] font-semibold text-[16px] active:scale-[0.98] transition-all"
            >
              Okay, Got it
            </button>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between p-4 text-white">
            <button onClick={() => setShowCropModal(false)} className="p-2">
              <X size={24} />
            </button>
            <span className="font-semibold">Crop Image</span>
            <button onClick={handleCropSave} className="p-2 text-[#2563EB] font-semibold">
              Done
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm aspect-square border-2 border-white/20 rounded-lg overflow-hidden">
              <img 
                src={logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop'} 
                alt="Crop preview" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>

          <div className="p-6 bg-black flex flex-col gap-4 pb-12">
            <p className="text-white/60 text-center text-sm">Pinch to zoom, drag to move</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCropModal(false)}
                className="flex-1 h-[52px] rounded-[16px] border border-white/20 text-white font-semibold text-[16px] active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCropSave}
                className="flex-1 h-[52px] rounded-[16px] bg-[#2563EB] text-[#FFFFFF] font-semibold text-[16px] active:scale-[0.98] transition-all"
              >
                Crop Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
