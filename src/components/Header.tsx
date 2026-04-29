import { Bell, User, Power, Plus, X } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  onProfileClick?: () => void;
  onNotificationClick: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onCreateOrder?: () => void;
  hideProfileAndNotificationOnMobile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'Dashboard',
  onProfileClick,
  onNotificationClick,
  isOnline, 
  onToggleOnline,
  onCreateOrder,
  hideProfileAndNotificationOnMobile = false,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { toggleSidebar, isMobile } = useSidebar();

  const handleToggleClick = () => {
    setShowConfirm(true);
  };

  const confirmToggle = () => {
    onToggleOnline();
    setShowConfirm(false);
  };

  return (
    <>
    <div className={`${hideProfileAndNotificationOnMobile ? 'hidden lg:block' : 'block'} px-2 lg:px-6 lg:pt-4`}>
      <header className="sticky top-0 z-[40] flex items-center justify-between h-[72px] w-full max-w-md mx-auto lg:max-w-none lg:h-[80px] lg:bg-white lg:border lg:border-slate-200 lg:shadow-sm lg:rounded-2xl lg:px-6 transition-all duration-300">
      
      {/* Profile Icon triggers Sidebar */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            if (isMobile) toggleSidebar();
            onProfileClick?.();
          }}
          className={`${hideProfileAndNotificationOnMobile ? 'hidden lg:flex' : 'flex'} w-[40px] h-[40px] rounded-full bg-[#F3F4F6] items-center justify-center shrink-0 active:scale-95 transition-transform`}
        >
          <User size={20} className="text-slate-600" />
        </button>

        {/* Desktop Title */}
        <div className="hidden lg:block ml-2">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Create Order Button (Desktop) */}
        <button 
          onClick={onCreateOrder}
          className="hidden lg:flex items-center gap-2 h-[48px] px-6 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[24px] font-semibold transition-colors"
        >
          <Plus size={20} />
          <span>Create Order</span>
        </button>

        <button
          onClick={handleToggleClick}
          className={`${hideProfileAndNotificationOnMobile ? 'hidden lg:flex' : 'flex'} w-[160px] lg:w-[200px] h-[48px] rounded-[24px] flex-col items-center justify-center active:scale-95 transition-all lg:static absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-0 lg:translate-y-0 ${
            isOnline ? 'bg-[#DBEAFE]' : 'bg-[#F3F4F6]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <Power size={12} className="text-[#2563EB]" strokeWidth={3} />
            ) : (
              <div className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
            )}
            <span className={`text-[13px] font-bold leading-none tracking-wide ${isOnline ? 'text-[#2563EB]' : 'text-[#6B7280]'}`}>
              {isOnline ? 'ONLINE' : 'GO ONLINE'}
            </span>
          </div>
          <span className={`text-[9px] font-medium leading-none mt-1 ${isOnline ? 'text-[#2563EB]' : 'text-[#6B7280]'}`}>
            {isOnline ? 'outlet is live' : 'outlet is offline'}
          </span>
        </button>

        {/* Notification Icon */}
        <button 
          onClick={onNotificationClick}
          className={`${hideProfileAndNotificationOnMobile ? 'hidden lg:flex' : 'flex'} relative w-[40px] h-[40px] items-center justify-center shrink-0 active:scale-95 transition-transform`}
        >
          <Bell size={22} className="text-slate-700" />
          <span className="absolute top-[8px] right-[10px] w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
      </header>
    </div>

    {/* Confirmation Bottom Sheet */}
    {showConfirm && (
      <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center">
        <div className="w-full bg-white rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {isOnline ? 'Go Offline?' : 'Go Online?'}
            </h3>
            <button onClick={() => setShowConfirm(false)} className="p-1 rounded-full hover:bg-slate-100">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <p className="text-slate-600 mb-6">
            {isOnline 
              ? 'Are you sure you want to go offline? You will stop receiving new orders.' 
              : 'Are you sure you want to go online? You will start receiving new orders.'}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
            >
              Cancel
            </button>
            <button 
              onClick={confirmToggle}
              className={`flex-1 py-3 px-4 text-white font-semibold rounded-xl active:scale-95 transition-transform ${isOnline ? 'bg-red-600' : 'bg-blue-600'}`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
