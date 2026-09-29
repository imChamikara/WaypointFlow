import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, ArrowRight } from 'lucide-react';

export const LoaderDashboard: React.FC = () => {
  const { trips, vehicles } = useAppStore();
  
  const loadingTrips = trips.filter(t => t.status === 'Loading');
  const readyTrips = trips.filter(t => t.status === 'Ready for Loading');
  const completedTrips = trips.filter(t => t.status === 'Loaded');

  return (
    <div className="max-w-5xl mx-auto py-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Good morning</h1>
        <p className="text-slate-500">Today's Loading</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-glow-primary rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-primary-600 mb-1">{readyTrips.length}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ready for Loading</div>
        </div>
        <div className="card-glow-warning rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-amber-500 mb-1">{loadingTrips.length}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currently Loading</div>
        </div>
        <div className="card-glow-success rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-emerald-500 mb-1">{completedTrips.length}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</div>
        </div>
      </div>
      
      <h2 className="text-lg font-bold text-slate-800 mb-4">Pending Tasks</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...loadingTrips, ...readyTrips].map(trip => {
          const vehicle = vehicles.find(v => v.id === trip.vehicleId);
          return (
            <div key={trip.id} className="card-glow rounded-xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{trip.id}</h3>
                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Truck size={14} className="text-primary-500" /> {vehicle?.id} • {trip.depot}
                    </div>
                  </div>
                  {trip.status === 'Loading' ? (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold rounded-full uppercase">Loading</span>
                  ) : (
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-600 border border-primary-200 text-xs font-bold rounded-full uppercase">Ready</span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-slate-400 text-xs uppercase font-semibold mb-1">Stops</div>
                    <div className="font-medium text-slate-800 flex items-center gap-1">
                      <Package size={16} className="text-slate-400"/> {trip.stops.length} Stops
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase font-semibold mb-1">Departure</div>
                    <div className="font-medium text-slate-800 flex items-center gap-1">
                      <Clock size={16} className="text-slate-400"/> {trip.departureTime}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/50 p-4 border-t border-slate-100">
                <Link 
                  to={`/loader/trip/${trip.id}`} 
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-[0_2px_10px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] text-sm"
                >
                  {trip.status === 'Loading' ? 'Continue Loading' : 'Start Loading'} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          );
        })}
        {[...loadingTrips, ...readyTrips].length === 0 && (
          <div className="col-span-2 py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
            No trips currently need loading.
          </div>
        )}
      </div>
    </div>
  );
};
