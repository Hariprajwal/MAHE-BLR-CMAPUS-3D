import React, { useState } from 'react';
import {
  X, ShieldCheck, Bus, Package, Clock, MapPin, Truck, AlertCircle,
  Building2, CheckCircle2, ChevronRight, Phone, Calendar, ArrowRight
} from 'lucide-react';
import { CampusPOI } from '../../data/campusData';

interface GateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gates: CampusPOI[];
  onSelectGatePOI: (poi: CampusPOI) => void;
}

export const GateManagerModal: React.FC<GateManagerModalProps> = ({
  isOpen,
  onClose,
  gates,
  onSelectGatePOI,
}) => {
  const [selectedGateId, setSelectedGateId] = useState<string>('GATE_1');

  if (!isOpen) return null;

  const currentGate = gates.find((g) => g.id === selectedGateId) || gates[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Campus Security & Access Control
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-bold">Live Monitoring</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                MAHE Campus Gates & Hubs
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gate Selection Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
          {gates.map((gate) => {
            const isGate1 = gate.id === 'GATE_1';
            const isGate2 = gate.id === 'GATE_2';
            const isGate3 = gate.id === 'GATE_3';
            const isActive = gate.id === selectedGateId;

            return (
              <button
                key={gate.id}
                onClick={() => setSelectedGateId(gate.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    isGate1 ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                    isGate2 ? 'bg-slate-700/40 text-slate-300 border border-slate-600/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isGate1 ? 'Gate 1' : isGate2 ? 'Gate 2' : 'Gate 3'}
                  </span>
                  {isGate1 && <Bus className="w-4 h-4 text-sky-400" />}
                  {isGate2 && <Truck className="w-4 h-4 text-slate-400" />}
                  {isGate3 && <Package className="w-4 h-4 text-emerald-400" />}
                </div>

                <div className="mt-2">
                  <span className="text-sm font-black text-white block">{gate.shortName}</span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                    {isGate1 ? 'Transport Office & Security' :
                     isGate2 ? 'Service & Commercial Entry' :
                     'Hostels & Parcel Counter (8AM-10PM)'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Gate Detail Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {currentGate && (
            <>
              {/* Gate Overview Card */}
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{currentGate.name}</h3>
                    <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      Active Gate
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                    {currentGate.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectGatePOI(currentGate);
                    onClose();
                  }}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
                >
                  <MapPin className="w-4 h-4" /> Focus 3D Camera <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Special Hub Feature Cards depending on selected gate */}
              {selectedGateId === 'GATE_1' && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-blue-950/40 border border-sky-500/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Office of Transport — Gate 1 (1st Floor)</h4>
                      <p className="text-xs text-sky-300/80">Official student transport desk & shuttle routing management</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-500/20">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Operating Hours</span>
                      <span className="font-extrabold text-white block mt-0.5">09:00 AM — 05:30 PM</span>
                      <span className="text-[10px] text-slate-400">Monday to Saturday</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-500/20">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Services Desk</span>
                      <span className="font-extrabold text-white block mt-0.5">Bus Pass Collection</span>
                      <span className="text-[10px] text-slate-400">Route pass, Vehicle RFID stickers</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-500/20">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Helpline / Contact</span>
                      <span className="font-extrabold text-white block mt-0.5">+91 74117 47070</span>
                      <span className="text-[10px] text-slate-400">Gate 1 Security Control</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedGateId === 'GATE_3' && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-green-950/40 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Campus Parcel Pickup Counter — Gate 3 (Backside)</h4>
                      <p className="text-xs text-emerald-300/80">Central collection for all student e-commerce & courier packages</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Pickup Timings</span>
                      <span className="font-extrabold text-emerald-400 block mt-0.5">08:00 AM — 10:00 PM</span>
                      <span className="text-[10px] text-slate-400">Daily (Mon – Sun)</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Couriers Accepted</span>
                      <span className="font-extrabold text-white block mt-0.5">Amazon, Flipkart, DTDC</span>
                      <span className="text-[10px] text-slate-400">Swiggy & Zomato Drop Bay</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Pickup Requirement</span>
                      <span className="font-extrabold text-white block mt-0.5">MAHE Student ID</span>
                      <span className="text-[10px] text-slate-400">Show OTP / ID at counter</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedGateId === 'GATE_2' && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border border-slate-700/60 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-700/40 text-slate-300">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Commercial & Service Logistics Checkpoint</h4>
                      <p className="text-xs text-slate-400">Restricted access gate for campus vendors, deliveries & maintenance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/40">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Allowed Entry</span>
                      <span className="font-extrabold text-white block mt-0.5">Registered Vendor Vehicles</span>
                      <span className="text-[10px] text-slate-400">Cafeteria supply trucks, infrastructure maintenance</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/40">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Security Procedure</span>
                      <span className="font-extrabold text-white block mt-0.5">Vehicle Weight & Manifest Check</span>
                      <span className="text-[10px] text-slate-400">Gate pass logged at guard desk</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Facilities Grid */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Gate Infrastructure & Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {currentGate.facilities.map((fac, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-semibold text-slate-200">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">MAHE Bengaluru Access Control System v2.0</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
