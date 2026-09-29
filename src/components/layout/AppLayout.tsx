import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Bell, User, Package, Truck, Menu, X, LayoutDashboard, ClipboardList, Route, AlertTriangle, Settings, RefreshCw, WifiOff } from 'lucide-react';
import clsx from 'clsx';
import { Role } from '../../types/logistics';

export const AppLayout: React.FC = () => {
  const { currentRole, setCurrentRole, isOffline, offlineQueue, syncOfflineQueue } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    switch (newRole) {
      case 'Dispatcher': navigate('/dispatcher'); break;
      case 'Loader': navigate('/loader'); break;
      case 'Driver': navigate('/driver'); break;
      case 'Store Manager': navigate('/store'); break;
    }
  };

  const getNavItems = () => {
    switch (currentRole) {
      case 'Dispatcher':
        return [
          { name: 'Dashboard', path: '/dispatcher', icon: LayoutDashboard },
          { name: 'Orders', path: '/dispatcher/orders', icon: ClipboardList },
          { name: 'Delivery Planning', path: '/dispatcher/planning', icon: Route },
          { name: 'Live Deliveries', path: '/dispatcher/live', icon: Truck },
          { name: 'Exceptions', path: '/dispatcher/exceptions', icon: AlertTriangle },
          { name: 'Settings', path: '/dispatcher/settings', icon: Settings },
        ];
      case 'Loader':
        return [
          { name: 'Dashboard', path: '/loader', icon: LayoutDashboard },
          { name: "Today's Trips", path: '/loader/trips', icon: Package },
        ];
      case 'Driver':
        return [
          { name: "Today's Route", path: '/driver', icon: Route },
          { name: 'Profile', path: '/driver/profile', icon: User },
        ];
      case 'Store Manager':
        return [
          { name: 'Dashboard', path: '/store', icon: LayoutDashboard },
          { name: 'Orders', path: '/store/orders', icon: ClipboardList },
          { name: 'Create Order', path: '/store/orders/new', icon: Package },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
          <div className="p-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Waypoint<span className="text-primary-600">Flow</span></span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/' && item.path !== `/${currentRole.toLowerCase().replace(' ', '')}`);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-primary-600" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Viewing as:</div>
            <select 
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as Role)}
              className="w-full bg-slate-100 border-none text-sm rounded-md py-2 px-3 focus:ring-2 focus:ring-primary-500"
            >
              <option value="Dispatcher">Dispatcher</option>
              <option value="Loader">Loader</option>
              <option value="Driver">Driver</option>
              <option value="Store Manager">Store Manager</option>
            </select>
          </div>
        </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 text-slate-500 rounded-md hover:bg-slate-100">
              <Menu size={20} />
            </button>
            <div className="font-bold tracking-tight">Waypoint<span className="text-primary-600">Flow</span></div>
            <LiveClock compact={true} />
          </div>

          {/* Desktop Header Info with Live 24h Clock */}
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{currentRole} Portal</span>
            <span className="text-slate-300">•</span>
            <span>Today, 29 September 2026</span>
            <span className="text-slate-300">•</span>
            <LiveClock />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            
            {/* Offline Status */}
            {isOffline && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-offline/10 text-offline rounded-full text-xs font-medium">
                <WifiOff size={14} />
                <span className="hidden sm:inline">Offline Mode</span>
              </div>
            )}
            {!isOffline && offlineQueue.length > 0 && (
              <button 
                onClick={syncOfflineQueue}
                className="flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium hover:bg-warning/20 transition-colors"
              >
                <RefreshCw size={14} />
                <span>Sync {offlineQueue.length} items</span>
              </button>
            )}

            <button className="relative p-2 text-slate-400 hover:text-slate-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-danger"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                {currentRole === 'Dispatcher' ? 'D' : currentRole === 'Loader' ? 'L' : currentRole === 'Driver' ? 'K' : 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="fixed inset-0 bg-slate-900/80" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="p-4 flex items-center justify-between border-b border-slate-200">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2"><X size={20}/></button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                    <item.icon size={20} className="text-slate-400" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-200">
                <select 
                  value={currentRole}
                  onChange={(e) => { handleRoleChange(e.target.value as Role); setMobileMenuOpen(false); }}
                  className="w-full bg-slate-100 border-none rounded-md py-2.5 px-3"
                >
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Loader">Loader</option>
                  <option value="Driver">Driver</option>
                  <option value="Store Manager">Store Manager</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content scrollable area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          <div className="max-w-7xl p-4 sm:p-6 lg:p-8 mx-auto h-full">
            <Outlet />
          </div>
        </main>
        
        {/* Mobile bottom nav */}
        <div className="md:hidden border-t border-slate-200 bg-white pb-safe mx-auto w-full">
          <div className="flex">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} className={clsx("flex-1 flex flex-col items-center justify-center py-3 gap-1", location.pathname === item.path ? "text-primary-600" : "text-slate-500")}>
                <item.icon size={24} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface LiveClockProps {
  compact?: boolean;
}

const LiveClock: React.FC<LiveClockProps> = ({ compact = false }) => {
  const [time, setTime] = useState<{ hh: string; mm: string; ss: string }>(() => {
    const d = new Date();
    return {
      hh: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
      ss: String(d.getSeconds()).padStart(2, '0'),
    };
  });

  const [styleMode, setStyleMode] = useState<number>(() => {
    const saved = localStorage.getItem('waypoint_clock_mode');
    return saved !== null ? Number(saved) : 0;
  });

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime({
        hh: String(d.getHours()).padStart(2, '0'),
        mm: String(d.getMinutes()).padStart(2, '0'),
        ss: String(d.getSeconds()).padStart(2, '0'),
      });
    };
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const styles = [
    // 0: Cyber Operations (Chakra Petch, Luminous Blue glow)
    {
      id: 'cyber',
      label: 'Cyber Ops',
      wrapper: 'bg-gradient-to-r from-blue-50/95 via-white to-sky-50/95 border border-primary-300/80 shadow-[0_2px_14px_-2px_rgba(37,99,235,0.2),0_0_8px_rgba(59,130,246,0.15)] text-slate-900 hover:border-primary-400',
      fontFamily: "'Chakra Petch', sans-serif",
      hoursMinClass: 'font-bold text-slate-900 tracking-wider',
      secClass: 'font-bold text-primary-600 ml-0.5',
      colonClass: 'text-primary-500 animate-pulse',
      tag: 'bg-primary-100 text-primary-700 border border-primary-200/80',
      dotColor: 'bg-emerald-500',
      pingColor: 'bg-emerald-400',
    },
    // 1: Command Dark HUD (JetBrains Mono, Neon Cyan glow)
    {
      id: 'hud',
      label: 'Dark HUD',
      wrapper: 'bg-slate-950 border border-cyan-500/40 shadow-[0_2px_16px_rgba(6,182,212,0.25),0_0_10px_rgba(15,23,42,0.5)] text-cyan-300 hover:border-cyan-400',
      fontFamily: "'JetBrains Mono', monospace",
      hoursMinClass: 'font-bold text-cyan-300 tracking-widest',
      secClass: 'font-semibold text-cyan-400 ml-0.5',
      colonClass: 'text-cyan-400 animate-pulse',
      tag: 'bg-cyan-950 text-cyan-300 border border-cyan-800/80',
      dotColor: 'bg-cyan-400',
      pingColor: 'bg-cyan-300',
    },
    // 2: Clean Precision (Inter, Slate & Sapphire)
    {
      id: 'precision',
      label: 'Precision',
      wrapper: 'bg-white border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-slate-800 hover:border-primary-300',
      fontFamily: "'Inter', sans-serif",
      hoursMinClass: 'font-extrabold text-slate-900 tracking-tight',
      secClass: 'font-semibold text-slate-500 ml-0.5 font-mono',
      colonClass: 'text-slate-400 animate-pulse',
      tag: 'bg-slate-100 text-slate-600 border border-slate-200',
      dotColor: 'bg-primary-600',
      pingColor: 'bg-primary-400',
    },
  ];

  const current = styles[styleMode % styles.length];

  const toggleStyle = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = (styleMode + 1) % styles.length;
    setStyleMode(next);
    localStorage.setItem('waypoint_clock_mode', String(next));
  };

  return (
    <button
      onClick={toggleStyle}
      type="button"
      title={`Current style: ${current.label}. Click to switch font & style!`}
      className={clsx(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all duration-300 cursor-pointer select-none group active:scale-95",
        current.wrapper
      )}
      style={{ fontFamily: current.fontFamily }}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", current.pingColor)} />
        <span className={clsx("relative inline-flex rounded-full h-2 w-2", current.dotColor)} />
      </span>

      <div className="flex items-baseline tabular-nums tracking-wider leading-none">
        <span className={clsx(compact ? "text-xs" : "text-sm", current.hoursMinClass)}>
          {time.hh}
          <span className={clsx("mx-0.5", current.colonClass)}>:</span>
          {time.mm}
        </span>
        <span className={clsx(compact ? "text-[10px]" : "text-xs", current.secClass)}>
          :{time.ss}
        </span>
      </div>

      <span className={clsx(
        "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 transition-opacity",
        current.tag
      )}>
        {current.label}
      </span>
    </button>
  );
};
