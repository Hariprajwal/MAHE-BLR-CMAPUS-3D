import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Plus, Edit, Layers, History, ExternalLink } from 'lucide-react';
import { CampusPOI } from '../../data/campusData';
import { CampusChangeRequest, AuditLogEntry, simulateCampusAgentScan } from '../../data/campusAgentEngine';

interface AdminDashboardProps {
  isOpen: boolean;
  locations: CampusPOI[];
  changeRequests: CampusChangeRequest[];
  auditLogs: AuditLogEntry[];
  onClose: () => void;
  onApproveChange: (change: CampusChangeRequest) => void;
  onRejectChange: (changeId: string) => void;
  onAddChangeProposal: (change: CampusChangeRequest) => void;
  onUpdatePOI: (updatedPoi: CampusPOI) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  locations,
  changeRequests,
  auditLogs,
  onClose,
  onApproveChange,
  onRejectChange,
  onAddChangeProposal,
  onUpdatePOI
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'pois' | 'models' | 'audit'>('queue');
  const [editingPoi, setEditingPoi] = useState<CampusPOI | null>(null);

  if (!isOpen) return null;

  const pendingRequests = changeRequests.filter((cr) => cr.verificationStatus === 'pending_admin_review');
  const approvedRequests = changeRequests.filter((cr) => cr.verificationStatus === 'verified_auto' || cr.verificationStatus === 'approved_manual');

  const handleSimulateScan = () => {
    const newChange = simulateCampusAgentScan();
    onAddChangeProposal(newChange);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                CAMPUS DATA & AI AGENT ADMIN PORTAL
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Verification Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">Audit logs, automated confidence scoring, and 3D asset control center</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateScan}
              className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulate Agent Crawl
            </button>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'queue' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Pending AI Queue ({pendingRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('pois')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'pois' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit className="w-4 h-4" /> Campus POIs ({locations.length})
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'models' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> 3D GLB Models & Versions
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'audit' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" /> Change History Log ({auditLogs.length})
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950/30 text-xs">
          {/* TAB 1: Pending AI Change Queue */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Pending AI Agent Detection Queue
                </h3>
                <span className="text-slate-400 text-xs">
                  {approvedRequests.length} changes auto-verified & synced to 3D map
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-slate-300">All AI Agent Detection Proposals Reviewed!</p>
                  <p className="text-xs mt-1">Click &quot;Simulate Agent Crawl&quot; above to trigger live external change detection.</p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-extrabold uppercase text-[10px] rounded border border-amber-500/30">
                          Confidence Score: {Math.round(req.confidenceScore * 100)}%
                        </span>
                        <span className="text-slate-400 text-[11px]">Detected: {req.detectedAt}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{req.title}</h4>
                      <p className="text-slate-300 leading-relaxed">{req.description}</p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-slate-400 font-semibold">Source: {req.source}</span>
                        <a
                          href={req.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-0.5 font-bold"
                        >
                          View Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Approve / Reject buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onApproveChange(req)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/30"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Sync 3D
                      </button>

                      <button
                        onClick={() => onRejectChange(req.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 font-bold flex items-center gap-1.5 transition-all border border-slate-700"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Campus POIs */}
          {activeTab === 'pois' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Campus Buildings & Food Outlet Directory
                </h3>
                <span className="text-slate-400 text-xs">Total Entities: {locations.length}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {locations.map((loc) => (
                  <div key={loc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{loc.name}</h4>
                      <span className="text-slate-400 text-[11px] capitalize">Category: {loc.category} • Status: {loc.status}</span>
                    </div>

                    <button
                      onClick={() => setEditingPoi(loc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
                    >
                      Edit Metadata
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 3D GLB Models & Asset Versioning */}
          {activeTab === 'models' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">3D GLTF / GLB Asset Registry</h3>
              <p className="text-slate-400">All building 3D meshes are version-tracked and dynamically loaded into client WebGL view.</p>

              <div className="space-y-2">
                {locations.map((loc) => (
                  <div key={loc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{loc.shortName}</span>
                      <code className="text-[10px] text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        gltf://assets/models/{loc.id.toLowerCase()}_v2.glb
                      </code>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                        Version 2.0 (Active)
                      </span>
                      <button className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold">
                        Upload New GLB
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Audit Log History */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Immutable Change Audit Timeline</h3>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 flex items-center justify-between hover:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <div>
                        <span className="font-bold text-white block">{log.action} — {log.entityName}</span>
                        <span className="text-[11px] text-slate-400">
                          Source: {log.source} • Performed by: <strong className="text-slate-300">{log.performedBy}</strong>
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
