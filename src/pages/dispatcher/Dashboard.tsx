import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PackageCheck, Truck, Route as RouteIcon, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const DispatcherDashboard: React.FC = () => {
  const { orders, trips, vehicles, exceptions } = useAppStore();

  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const plannedTrips = trips.filter(t => t.status === 'In Planning' || t.status === 'Planned' || t.status === 'Ready for Loading').length;
  const deferredOrders = orders.filter(o => o.status === 'Deferred').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, Dispatcher</h1>
          <p className="text-slate-500">Tuesday, 29 September</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dispatcher/planning"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-[0_2px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_18px_rgba(37,99,235,0.4)] text-sm"
          >
            Plan Today's Deliveries
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Confirmed Orders" value={confirmedOrders} icon={PackageCheck} color="primary" />
        <KPICard title="Vehicles Available" value={availableVehicles} icon={Truck} color="success" />
        <KPICard title="Trips Planned" value={plannedTrips} icon={RouteIcon} color="info" />
        <KPICard title="Deferred" value={deferredOrders} icon={AlertTriangle} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Delivery Status */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.07),0_0_16px_rgba(37,99,235,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(37,99,235,0.16),0_0_24px_rgba(37,99,235,0.12)] hover:border-primary-200 transition-all duration-300 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/80 flex justify-between items-center bg-slate-50/60">
            <h2 className="font-semibold text-slate-800">Today's Delivery Status</h2>
            <Link to="/dispatcher/live" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
              View Map <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <StatusBadge status="Planned" count={trips.filter(t=>t.status==='Planned').length} />
              <div className="flex-1 h-px bg-slate-200 mx-2"></div>
              <StatusBadge status="Loading" count={trips.filter(t=>t.status==='Loading').length} color="info" />
              <div className="flex-1 h-px bg-slate-200 mx-2"></div>
              <StatusBadge status="En Route" count={trips.filter(t=>t.status==='En Route').length} color="warning" />
              <div className="flex-1 h-px bg-slate-200 mx-2"></div>
              <StatusBadge status="Delivered" count={trips.filter(t=>t.status==='Completed').length} color="success" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Trips</h3>
              {trips.length > 0 ? trips.map(trip => (
                <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-primary-200 hover:shadow-[0_2px_12px_rgba(37,99,235,0.08)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm text-slate-600">
                      <Truck size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">{trip.id} • {trip.vehicleId}</div>
                      <div className="text-xs text-slate-500">{trip.stops.length} stops • {trip.depot}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium mb-1",
                      trip.status === 'Ready for Loading' || trip.status === 'Loading' ? "bg-info/10 text-info" :
                      trip.status === 'En Route' ? "bg-warning/10 text-warning" :
                      trip.status === 'Completed' ? "bg-success/10 text-success" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {trip.status}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{trip.departureTime}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-sm text-slate-500">No active trips currently.</div>
              )}
            </div>
          </div>
        </div>

        {/* Exceptions */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(239,68,68,0.07),0_0_16px_rgba(239,68,68,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(239,68,68,0.16),0_0_24px_rgba(239,68,68,0.12)] hover:border-rose-200 transition-all duration-300 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200/80 flex justify-between items-center bg-slate-50/60">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-danger" />
              Active Exceptions
            </h2>
          </div>
          <div className="p-0 flex-1 overflow-y-auto">
            {exceptions.filter(e => e.status === 'Open').length > 0 ? (
              <div className="divide-y divide-slate-100">
                {exceptions.filter(e => e.status === 'Open').map(exc => (
                  <div key={exc.id} className="p-4 hover:bg-rose-50/30 transition-colors">
                    <div className="font-medium text-sm text-slate-900 mb-1">{exc.type}</div>
                    <div className="text-sm text-slate-600 mb-2">{exc.referenceId}</div>
                    <div className="text-xs text-slate-500 mb-3">{exc.message}</div>
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700">Resolve Issue</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full text-slate-500">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-3 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                  <PackageCheck size={24} />
                </div>
                <div className="font-medium text-slate-700 mb-1">No active exceptions</div>
                <div className="text-sm">Operations are running smoothly.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, color = 'primary' }: any) => {
  const colorConfig = {
    primary: {
      card: "border-primary-100/90 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.12),0_0_15px_rgba(59,130,246,0.08)] hover:shadow-[0_12px_32px_-4px_rgba(37,99,235,0.24),0_0_24px_rgba(59,130,246,0.28)] hover:border-primary-300",
      iconContainer: "text-primary-600 bg-primary-50 ring-1 ring-primary-500/20 shadow-[0_0_12px_rgba(37,99,235,0.2)]",
    },
    success: {
      card: "border-emerald-100/90 shadow-[0_4px_20px_-2px_rgba(16,185,129,0.12),0_0_15px_rgba(16,185,129,0.08)] hover:shadow-[0_12px_32px_-4px_rgba(16,185,129,0.24),0_0_24px_rgba(16,185,129,0.28)] hover:border-emerald-300",
      iconContainer: "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    },
    info: {
      card: "border-blue-100/90 shadow-[0_4px_20px_-2px_rgba(59,130,246,0.12),0_0_15px_rgba(59,130,246,0.08)] hover:shadow-[0_12px_32px_-4px_rgba(59,130,246,0.24),0_0_24px_rgba(59,130,246,0.28)] hover:border-blue-300",
      iconContainer: "text-blue-600 bg-blue-50 ring-1 ring-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.2)]",
    },
    danger: {
      card: "border-rose-100/90 shadow-[0_4px_20px_-2px_rgba(239,68,68,0.12),0_0_15px_rgba(239,68,68,0.08)] hover:shadow-[0_12px_32px_-4px_rgba(239,68,68,0.24),0_0_24px_rgba(239,68,68,0.28)] hover:border-rose-300",
      iconContainer: "text-rose-600 bg-rose-50 ring-1 ring-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
    },
  };

  const current = colorConfig[color as keyof typeof colorConfig] || colorConfig.primary;

  return (
    <div className={clsx(
      "bg-white rounded-xl p-5 border transition-all duration-300 flex items-center gap-4 hover:-translate-y-0.5",
      current.card
    )}>
      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105", current.iconContainer)}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-slate-500 text-sm font-medium">{title}</div>
        <div className="text-2xl font-bold text-slate-900 mt-0.5">{value}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, count, color = 'neutral' }: any) => {
  const colorClasses = {
    neutral: "bg-slate-100 text-slate-600 border-slate-200 shadow-[0_0_8px_rgba(148,163,184,0.15)]",
    info: "bg-info/10 text-info border-info/30 shadow-[0_0_14px_rgba(59,130,246,0.25)]",
    warning: "bg-warning/10 text-warning border-warning/30 shadow-[0_0_14px_rgba(245,158,11,0.25)]",
    success: "bg-success/10 text-success border-success/30 shadow-[0_0_14px_rgba(16,185,129,0.25)]",
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={clsx(
        "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-transform hover:scale-105",
        colorClasses[color as keyof typeof colorClasses]
      )}>
        {count}
      </div>
      <span className="text-xs font-medium text-slate-600">{status}</span>
    </div>
  );
};
