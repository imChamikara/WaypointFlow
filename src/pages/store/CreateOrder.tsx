import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Info, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { Product } from '../../types/logistics';

export const CreateOrder: React.FC = () => {
  const { products, createOrder } = useAppStore();
  const navigate = useNavigate();
  
  // Hardcoded for demo
  const outletId = 'OUT-021';
  const brand = 'Fresh';
  
  const [date, setDate] = useState('2026-09-30');
  const [windowStart, setWindowStart] = useState('05:30');
  const [windowEnd, setWindowEnd] = useState('07:30');
  
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const availableProducts = products.filter(p => p.brand === brand);
  
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };
  
  let totalWeight = 0;
  let totalVolume = 0;
  let requiresReefer = false;
  
  Object.entries(cart).forEach(([id, qty]) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
      totalWeight += p.weight * qty;
      totalVolume += p.volume * qty;
      if (p.temperatureRequirement !== 'ambient') {
        requiresReefer = true;
      }
    }
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderItems = Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity }));
      
      createOrder({
        outletId,
        brand,
        deliveryDate: date,
        deliveryWindow: { start: windowStart, end: windowEnd },
        items: orderItems,
        totalWeight,
        totalVolume,
        temperatureRequirement: requiresReefer ? 'chilled' : 'ambient'
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 800);
  };
  
  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Order Submitted</h1>
        <p className="text-slate-500 mb-8">Your order has been confirmed and sent to dispatch.</p>
        
        <div className="card-glow rounded-xl p-6 w-full max-w-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Delivery</span>
            <span className="font-bold text-slate-900">{date}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Window</span>
            <span className="font-bold text-slate-900">{windowStart} – {windowEnd}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Status</span>
            <span className="font-bold text-info bg-info/10 px-2.5 py-0.5 rounded-md text-sm">Confirmed</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/store')}
          className="bg-primary-600 text-white px-7 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition-all shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.45)] text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-2">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/store" className="p-2 -ml-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Order</h1>
          <p className="text-slate-500 text-sm">Select delivery details and products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="card-glow rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Delivery Schedule</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Time Window</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    value={windowStart}
                    onChange={(e) => setWindowStart(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm transition-all" 
                  />
                  <span className="text-slate-400 font-medium text-xs">to</span>
                  <input 
                    type="time" 
                    value={windowEnd}
                    onChange={(e) => setWindowEnd(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm transition-all" 
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg flex items-start gap-2">
              <Info size={17} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-800">Next-day orders must be submitted before the daily cutoff at 18:00.</p>
            </div>
          </div>

          <div className="card-glow rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Products</h2>
            <div className="space-y-3">
              {availableProducts.map(product => {
                const qty = cart[product.id] || 0;
                return (
                  <div key={product.id} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-primary-200 hover:shadow-[0_2px_10px_rgba(37,99,235,0.06)] transition-all">
                    <div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base">{product.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {product.weight}kg • {product.temperatureRequirement === 'ambient' ? 'Ambient' : 'Chilled'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-7 h-7 rounded-md border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 transition-colors"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-7 text-center font-bold text-base text-slate-900">{qty}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-7 h-7 rounded-md bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 shadow-xs transition-all active:scale-95"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

        <div>
          <div className="card-glow-primary rounded-xl sticky top-24 overflow-hidden">
            <div className="px-5 py-4 border-b border-primary-100/80 bg-gradient-to-r from-primary-50/70 to-white flex items-center justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900 whitespace-nowrap">Order Summary</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary-100/80 text-primary-700 border border-primary-200/60 shrink-0">Live Breakdown</span>
            </div>
            
            <div className="p-5 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Total Items</span>
                <span className="font-bold text-base text-slate-900">{Object.values(cart).reduce((a, b) => a + b, 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Total Weight</span>
                <span className="font-bold text-slate-900">{totalWeight.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Total Volume</span>
                <span className="font-bold text-slate-900">{totalVolume.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Temperature</span>
                <span className={clsx("font-bold px-2 py-0.5 rounded-md text-xs", requiresReefer ? "bg-info/10 text-info border border-info/20" : "bg-slate-100 text-slate-600 border border-slate-200")}>
                  {requiresReefer ? 'Chilled Required' : 'Ambient'}
                </span>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50/40">
              <button 
                onClick={handleSubmit}
                disabled={Object.keys(cart).length === 0 || isSubmitting}
                className={clsx(
                  "w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center text-sm",
                  Object.keys(cart).length > 0 && !isSubmitting
                    ? "bg-primary-600 hover:bg-primary-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] active:scale-[0.99]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                )}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
