import React from "react";
import {
  ArrowLeft,
  Settings,
  Upload,
  Download,
  Share2,
  Store,
  User,
  Clock,
  MenuSquare,
  Landmark,
  Users,
  ChevronRight,
  LogOut,
  RotateCcw,
  Receipt,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  restaurantName?: string;
  restaurantSlug?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isOpen,
  onClose,
  onLogout,
  restaurantName = "Gourmet Kitchen",
  restaurantSlug = "gourmet-kitchen",
}) => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const restaurantProfileUrl = `https://aesthetic-griffin-0d36ea.netlify.app/${restaurantSlug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(restaurantProfileUrl)}`;

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${restaurantSlug}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurantName} - Crevings`,
          text: `Scan to view menu and order from ${restaurantName}`,
          url: restaurantProfileUrl,
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
      }
    } else {
      navigator.clipboard.writeText(restaurantProfileUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[110] w-full bg-slate-50 transform transition-transform duration-300 ease-out flex flex-col lg:bg-black/50 lg:items-center lg:justify-center lg:p-4 ${isOpen ? "translate-x-0 lg:opacity-100 lg:translate-x-0" : "-translate-x-full lg:opacity-0 lg:pointer-events-none"}`}
    >
      <div className="flex flex-col w-full h-full bg-slate-50 lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:rounded-3xl lg:overflow-hidden lg:shadow-2xl">
        {/* Page Header */}
        <div className="h-[56px] bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0 sticky top-0 z-20 lg:h-16 lg:px-6">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform lg:hidden"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900 lg:text-xl">
            Restaurant Profile
          </h1>
          <div className="flex items-center gap-2 -mr-2 lg:mr-0">
            <button
              onClick={() => handleNavigate('/settings')}
              className="w-10 h-10 flex items-center justify-center text-slate-700 active:scale-95 transition-transform lg:hidden"
            >
              <Settings size={22} />
            </button>
            <button
              onClick={onClose}
              className="hidden lg:flex w-10 h-10 items-center justify-center text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="rotate-180" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-12 px-4 pt-4 space-y-6 lg:p-6 lg:space-y-8">
          {/* Restaurant Info Card */}
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100">
            <div className="flex gap-4">
              <div className="w-[72px] h-[72px] rounded-[14px] bg-slate-100 shrink-0 overflow-hidden shadow-sm border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Logo"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 truncate">
                      {restaurantName}
                    </h2>
                    <p className="text-sm text-slate-500 truncate mt-0.5">
                      Civil Lines, Prayagraj
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleNavigate('/profile/restaurant-information')}
                className="w-full h-[40px] bg-[#2563EB] text-white rounded-[12px] text-sm font-semibold active:scale-95 transition-transform"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-100/50 transition-colors" />
            <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm relative z-10">
              <img
                src={qrCodeUrl}
                alt="Restaurant QR Code"
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-slate-900">Restaurant QR Code</h3>
              <p className="text-xs text-slate-500 mb-3">
                For Dine-in & Orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 h-[36px] bg-slate-50 border border-slate-200 rounded-[10px] flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={handleShareQR}
                  className="flex-1 h-[36px] bg-slate-50 border border-slate-200 rounded-[10px] flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Management Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">
              Management
            </h3>
            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden">
              {[
                {
                  icon: Store,
                  title: "Outlet Info",
                  desc: "Cuisine, Address, Delivery Radius",
                  path: '/profile/restaurant-information',
                },
                {
                  icon: User,
                  title: "Owner Info",
                  desc: "Name, Contact, Email",
                  path: '/profile/owner-information',
                },
                {
                  icon: Clock,
                  title: "Opening Hours",
                  desc: "Mon – Sun | 10:00 AM – 11:00 PM",
                  path: '/profile/operating-hours',
                },
                {
                  icon: MenuSquare,
                  title: "Digital Menu",
                  desc: "Upload Menu Images & PDFs",
                  path: '/profile/digital-menu',
                },
                {
                  icon: Upload,
                  title: "Upload Banners",
                  desc: "Manage restaurant banners",
                  path: '/profile/banners',
                },
                {
                  icon: Landmark,
                  title: "Bank Account Details",
                  desc: "Linked account information",
                  path: '/profile/bank-account',
                },
                {
                  icon: RotateCcw,
                  title: "Refunds",
                  desc: "Manage refund requests",
                  path: '/refunds',
                },
                {
                  icon: Users,
                  title: "Staff Management",
                  desc: "Manage staff and roles",
                  path: '/staff',
                },
                {
                  icon: Receipt,
                  title: "Custom Charges",
                  desc: "Packaging, taxes, service charge",
                  path: '/profile/custom-charges',
                },
              ].map((item, i, arr) => (
                <button
                  key={i}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full h-[64px] px-4 flex items-center justify-between hover:bg-slate-50 transition-colors active:bg-slate-100 ${i !== arr.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <item.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Business & Growth Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">
              Business & Growth
            </h3>
            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden p-4 text-center text-slate-500 text-sm">
              No active business & growth tools.
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onLogout?.();
              }}
              className="w-full h-[52px] bg-rose-50 text-rose-500 rounded-[16px] border border-rose-100 font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
