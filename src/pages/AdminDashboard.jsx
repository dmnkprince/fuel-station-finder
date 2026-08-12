import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  addStation,
  assignManager,
  createManager,
  fetchManagers,
  fetchManagerDetails,
  updateManagerDetails,
  unassignStationFromManager,
  fetchStations,
} from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [toast, setToast] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState('managers_list'); // 'managers_list', 'create_manager', 'new_station', 'link_station'

  // Managers list
  const [managers, setManagers] = useState([]);
  const [managersLoading, setManagersLoading] = useState(true);

  // Stations list for selection
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);

  // Create Manager Form
  const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '' });
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerError, setManagerError] = useState('');

  // Add Station Form
  const [stationForm, setStationForm] = useState({
    name: '', address: '', latitude: '', longitude: '', brand: '', manager_email: '',
  });
  const [stationLoading, setStationLoading] = useState(false);
  const [stationError, setStationError] = useState('');

  // Assign Manager Form state (Dynamic Dropdowns)
  const [assignStationSearch, setAssignStationSearch] = useState('');
  const [isAssignStationDropdownOpen, setIsAssignStationDropdownOpen] = useState(false);
  const [selectedAssignStation, setSelectedAssignStation] = useState(null);
  const [selectedAssignManagerEmail, setSelectedAssignManagerEmail] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Edit Manager Modal state
  const [editingManager, setEditingManager] = useState(null); // Selected manager object
  const [editingManagerDetails, setEditingManagerDetails] = useState(null); // Manager object from API with stations
  const [editingDetailsLoading, setEditingDetailsLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Load data on mount
  useEffect(() => {
    loadManagers();
    loadStations();
  }, []);

  const loadManagers = async () => {
    setManagersLoading(true);
    try {
      const data = await fetchManagers();
      setManagers(data);
    } catch (err) {
      console.error('Failed to load managers:', err);
    } finally {
      setManagersLoading(false);
    }
  };

  const loadStations = async () => {
    setStationsLoading(true);
    try {
      const data = await fetchStations();
      setStations(data);
    } catch (err) {
      console.error('Failed to load stations:', err);
    } finally {
      setStationsLoading(false);
    }
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setManagerError('');
    const { name, email, password } = managerForm;
    if (!name || !email || !password) {
      return setManagerError('All fields are required.');
    }
    if (password.length < 6) {
      return setManagerError('Password must be at least 6 characters.');
    }

    setManagerLoading(true);
    try {
      await createManager({ name, email, password });
      showToast('✅ Station Manager created successfully!');
      setManagerForm({ name: '', email: '', password: '' });
      loadManagers();
      setActiveTab('managers_list'); // Switch to list to see the new user
    } catch (err) {
      setManagerError(err.response?.data?.message || 'Failed to create manager.');
    } finally {
      setManagerLoading(false);
    }
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    setStationError('');
    const { name, address, latitude, longitude, brand } = stationForm;
    if (!name || !address || !latitude || !longitude || !brand) {
      return setStationError('All fields except manager email are required.');
    }

    setStationLoading(true);
    try {
      await addStation({
        name, address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        brand,
        manager_email: stationForm.manager_email || undefined,
      });
      showToast('✅ Station registered successfully!');
      setStationForm({ name: '', address: '', latitude: '', longitude: '', brand: '', manager_email: '' });
      loadStations(); // Refresh list
    } catch (err) {
      setStationError(err.response?.data?.message || 'Failed to add station.');
    } finally {
      setStationLoading(false);
    }
  };

  const handleAssignManager = async (e) => {
    e.preventDefault();
    setAssignError('');
    if (!selectedAssignStation || !selectedAssignManagerEmail) {
      return setAssignError('Please select both a station and a manager.');
    }

    setAssignLoading(true);
    try {
      await assignManager(selectedAssignStation.id, selectedAssignManagerEmail);
      showToast('✅ Manager assigned successfully!');
      setSelectedAssignStation(null);
      setSelectedAssignManagerEmail('');
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign manager.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Open Edit Modal & Load assigned stations
  const handleOpenEditModal = async (manager) => {
    setEditingManager(manager);
    setEditForm({ name: manager.name, email: manager.email, password: '' });
    setEditError('');
    setEditingManagerDetails(null);
    setEditingDetailsLoading(true);
    try {
      const data = await fetchManagerDetails(manager.id);
      setEditingManagerDetails(data);
    } catch (err) {
      console.error('Failed to load manager details:', err);
      setEditError('Failed to load assigned stations.');
    } finally {
      setEditingDetailsLoading(false);
    }
  };

  // Update Manager Details
  const handleUpdateManager = async (e) => {
    e.preventDefault();
    setEditError('');
    const { name, email, password } = editForm;
    if (!name || !email) {
      return setEditError('Name and email are required.');
    }

    setEditLoading(true);
    try {
      await updateManagerDetails(editingManager.id, {
        name,
        email,
        password: password || undefined,
      });
      showToast('✅ Manager updated successfully!');
      setEditingManager(null);
      loadManagers();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update manager.');
    } finally {
      setEditLoading(false);
    }
  };

  // Unassign station
  const handleUnassignStation = async (stationId) => {
    if (!window.confirm('Are you sure you want to unassign this manager from this station?')) return;
    try {
      await unassignStationFromManager(editingManager.id, stationId);
      showToast('✅ Station unassigned successfully!');
      const data = await fetchManagerDetails(editingManager.id);
      setEditingManagerDetails(data);
    } catch (err) {
      console.error('Failed to unassign station:', err);
      showToast('❌ Failed to unassign station.');
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-slate-100 font-medium outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-slate-600 text-sm shadow-inner';
  const labelClass = 'text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1';
  const sectionClass = 'relative overflow-visible bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all animate-fade-in-down';
  const sectionHeaderClass = 'text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 flex items-center gap-3 drop-shadow-sm';
  const primaryButtonClass = 'w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-slate-950 font-black text-sm sm:text-base py-3.5 sm:py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] cursor-pointer group flex items-center justify-center gap-2';

  const tabs = [
    { id: 'managers_list', icon: '👥', label: 'Active Managers' },
    { id: 'create_manager', icon: '👤', label: 'Create Manager' },
    { id: 'new_station', icon: '⛽', label: 'New Station' },
    { id: 'link_station', icon: '🔗', label: 'Link Station' },
  ];

  return (
    <div id="admin-dashboard" className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-8 scroll-smooth">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors w-fit group">
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> Back to Map
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300 shrink-0">
              <span className="text-3xl filter drop-shadow-md">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight">
                Admin Portal
              </h1>
              <p className="text-xs sm:text-sm text-amber-500/80 font-semibold tracking-wide mt-1">
                Welcome back, <span className="text-amber-400">{user?.name}</span> • Superuser
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/50 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transform scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 cursor-pointer'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Active Managers Tab */}
        {activeTab === 'managers_list' && (
          <section className={`${sectionClass} flex-1 overflow-hidden min-h-[400px]`}>
            <div className="flex items-center justify-between mb-4 z-10">
              <h2 className="text-lg font-black text-slate-200">Active Managers</h2>
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <span className="text-xs font-bold text-amber-500">{managers.length} Users</span>
              </div>
            </div>

            {managersLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-slate-500 z-10">
                 <div className="w-8 h-8 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
                 <p className="text-xs font-semibold">Fetching directory...</p>
               </div>
            ) : managers.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-900/30 z-10">
                <span className="text-4xl opacity-50 mb-3">📭</span>
                <p className="text-sm font-bold text-slate-400">No managers found</p>
                <p className="text-xs text-slate-500 mt-1 text-center">Create a manager account to see them here.</p>
                <button 
                  onClick={() => setActiveTab('create_manager')}
                  className="mt-4 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Create One Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[500px] z-10 custom-scrollbar">
                {managers.map((m) => (
                  <div key={m.id} className="group flex items-center justify-between bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/40 hover:border-amber-500/30 rounded-xl px-5 py-4 transition-all duration-300 hover:shadow-lg cursor-default">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-black text-sm shrink-0 border border-slate-600/50 group-hover:border-amber-500/40 transition-colors">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{m.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{m.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(m)}
                      className="text-[10px] font-bold text-amber-500 hover:text-slate-900 border border-amber-500/30 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-400 px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm ml-4"
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Create Manager Tab */}
        {activeTab === 'create_manager' && (
          <section className={`${sectionClass} overflow-hidden`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <h2 className={sectionHeaderClass}>
              <span className="text-blue-400 drop-shadow-md text-2xl">👤</span> Create Station Manager
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-2 -mt-3">Register a new station manager account. They can be assigned to stations later.</p>

            <form onSubmit={handleCreateManager} className="flex flex-col gap-5 z-10">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} placeholder="e.g. John Doe" value={managerForm.name} onChange={(e) => setManagerForm(p => ({...p, name: e.target.value}))} required />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Email Address</label>
                <input className={inputClass} type="email" placeholder="manager@station.com" value={managerForm.email} onChange={(e) => setManagerForm(p => ({...p, email: e.target.value}))} required />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Secure Password</label>
                <input className={inputClass} type="password" placeholder="Min. 6 characters" value={managerForm.password} onChange={(e) => setManagerForm(p => ({...p, password: e.target.value}))} required />
              </div>

              {managerError && <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl font-medium flex items-center gap-2"><span className="text-base">⚠️</span> {managerError}</div>}

              <button type="submit" disabled={managerLoading} className={primaryButtonClass}>
                <span className="relative z-10">{managerLoading ? 'Creating Manager…' : 'Create Account'}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            </form>
          </section>
        )}

        {/* New Station Tab */}
        {activeTab === 'new_station' && (
          <section className={`${sectionClass} overflow-hidden`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <h2 className={sectionHeaderClass}>
              <span className="text-emerald-400 drop-shadow-md text-2xl">⛽</span> Deploy New Station
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-2 -mt-3">Register a new filling station to the map.</p>

            <form onSubmit={handleAddStation} className="flex flex-col gap-5 z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Station Name</label>
                  <input className={inputClass} placeholder="e.g. Mega Station" value={stationForm.name} onChange={(e) => setStationForm(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Brand</label>
                  <input className={inputClass} placeholder="e.g. NNPC" value={stationForm.brand} onChange={(e) => setStationForm(p => ({...p, brand: e.target.value}))} required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>Street Address</label>
                <input className={inputClass} placeholder="Full address" value={stationForm.address} onChange={(e) => setStationForm(p => ({...p, address: e.target.value}))} required />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Latitude</label>
                  <input className={inputClass} type="number" step="any" placeholder="9.0578" value={stationForm.latitude} onChange={(e) => setStationForm(p => ({...p, latitude: e.target.value}))} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Longitude</label>
                  <input className={inputClass} type="number" step="any" placeholder="7.4951" value={stationForm.longitude} onChange={(e) => setStationForm(p => ({...p, longitude: e.target.value}))} required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>Manager Email <span className="text-slate-600 lowercase">(Optional)</span></label>
                <input className={inputClass} type="email" placeholder="manager@station.com" value={stationForm.manager_email} onChange={(e) => setStationForm(p => ({...p, manager_email: e.target.value}))} />
              </div>

              {stationError && <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl font-medium flex items-center gap-2"><span className="text-base">⚠️</span> {stationError}</div>}

              <button type="submit" disabled={stationLoading} className={primaryButtonClass}>
                <span className="relative z-10">{stationLoading ? 'Deploying…' : 'Deploy Station'}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            </form>
          </section>
        )}

        {/* Link Station Tab */}
        {activeTab === 'link_station' && (
          <section className={`${sectionClass}`}>
            <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none -z-10"></div>

            <h2 className={sectionHeaderClass}>
              <span className="text-purple-400 drop-shadow-md text-2xl">🔗</span> Link Station
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-2 -mt-3">Assign existing filling stations to managers.</p>

            <form onSubmit={handleAssignManager} className="flex flex-col gap-5 z-10">
              
              {/* Station Selection */}
              <div className="flex flex-col gap-2 relative">
                <label className={labelClass}>Target Station</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAssignStationDropdownOpen(!isAssignStationDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-slate-100 font-medium text-left outline-none hover:border-amber-500/50 transition-all text-sm cursor-pointer shadow-inner"
                  >
                    {selectedAssignStation ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-100">{selectedAssignStation.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{selectedAssignStation.brand} • {selectedAssignStation.address}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">Search for a station...</span>
                    )}
                    <span className="text-amber-500 text-xs ml-2 transition-transform duration-300" style={{ transform: isAssignStationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </button>

                  {isAssignStationDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col max-h-[300px] overflow-hidden overflow-y-auto transform origin-top animate-fade-in-down">
                      <div className="p-3 border-b border-slate-800/80 sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
                          <input
                            type="text"
                            placeholder="Search by name, brand..."
                            value={assignStationSearch}
                            onChange={(e) => setAssignStationSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg text-slate-200 text-xs font-medium outline-none focus:border-amber-500/50 transition-all placeholder-slate-600"
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        {stationsLoading ? (
                          <div className="px-4 py-8 text-center text-xs font-medium text-slate-400 flex flex-col items-center gap-3">
                            <div className="w-5 h-5 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
                            Loading database...
                          </div>
                        ) : stations.filter((s) => {
                          const q = assignStationSearch.toLowerCase();
                          return s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
                        }).length === 0 ? (
                          <div className="px-4 py-8 text-center text-xs font-medium text-slate-500">
                            No stations found.
                          </div>
                        ) : (
                          stations
                            .filter((s) => {
                              const q = assignStationSearch.toLowerCase();
                              return s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
                            })
                            .map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                className={`w-full px-4 py-3 text-left border-b border-slate-800/50 hover:bg-slate-800/50 transition-all flex flex-col cursor-pointer group ${
                                  selectedAssignStation?.id === s.id ? 'bg-amber-500/10 text-slate-100 border-l-2 border-l-amber-500' : ''
                                }`}
                                onClick={() => {
                                  setSelectedAssignStation(s);
                                  setIsAssignStationDropdownOpen(false);
                                  setAssignStationSearch('');
                                }}
                              >
                                <span className={`text-xs font-bold block ${selectedAssignStation?.id === s.id ? 'text-amber-400' : 'text-slate-300 group-hover:text-white'}`}>{s.name}</span>
                                <span className="text-[10px] text-slate-500 mt-1 block group-hover:text-slate-400 transition-colors">{s.brand} • {s.address}</span>
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Manager Selection */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Assign to Manager</label>
                <div className="relative">
                  <select
                    value={selectedAssignManagerEmail}
                    onChange={(e) => setSelectedAssignManagerEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-slate-100 font-medium outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm appearance-none shadow-inner cursor-pointer"
                    required
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-500">Select an account...</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.email} className="bg-slate-900">
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">▼</span>
                </div>
              </div>

              {assignError && <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl font-medium flex items-center gap-2"><span className="text-base">⚠️</span> {assignError}</div>}

              <button type="submit" disabled={assignLoading} className={primaryButtonClass}>
                <span className="relative z-10">{assignLoading ? 'Processing…' : 'Establish Link'}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            </form>
          </section>
        )}
      </div>

      {/* Edit/Details Modal - Glassmorphic design */}
      {editingManager && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 sm:p-6 animate-fade-in" onClick={() => setEditingManager(null)}>
          <div
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-3xl w-full max-w-xl max-h-[95vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6)] transform scale-100 animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-700/50 bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                  {editingManager.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-100">Manager Profile</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Manage credentials & assignments</p>
                </div>
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 rounded-full transition-all cursor-pointer"
                onClick={() => setEditingManager(null)}
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Profile Update Form */}
              <form onSubmit={handleUpdateManager} className="p-6 sm:p-8 flex flex-col gap-5 border-b border-slate-700/50">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><span className="text-amber-500">🔒</span> Credentials</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Full Name</label>
                    <input
                      className={inputClass}
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Email Address</label>
                    <input
                      className={inputClass}
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Override Password <span className="text-slate-600 lowercase">(leave blank to keep current)</span></label>
                  <input
                    className={inputClass}
                    type="password"
                    placeholder="Enter new secure password"
                    value={editForm.password}
                    onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
                  />
                </div>

                {editError && <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl font-medium flex items-center gap-2"><span className="text-base">⚠️</span> {editError}</div>}

                <div className="pt-2">
                  <button type="submit" disabled={editLoading} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl border border-slate-600 hover:border-slate-500 transition-all cursor-pointer active:scale-[0.98]">
                    {editLoading ? 'Saving Changes...' : '💾 Update Profile'}
                  </button>
                </div>
              </form>

              {/* Assigned Stations Section */}
              <div className="p-6 sm:p-8 flex flex-col gap-4 bg-slate-900/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-emerald-500">📍</span> Assigned Locations
                  </h3>
                  {editingManagerDetails?.stations && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{editingManagerDetails.stations.length}</span>
                  )}
                </div>

                {editingDetailsLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8 text-slate-500">
                    <div className="w-6 h-6 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-xs font-semibold">Loading locations...</p>
                  </div>
                ) : !editingManagerDetails?.stations || editingManagerDetails.stations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700/40 rounded-2xl bg-slate-900/30">
                    <p className="text-sm font-bold text-slate-500">No stations assigned</p>
                    <p className="text-[10px] text-slate-600 mt-1 text-center">Use the "Link Station" tool to assign one.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {editingManagerDetails.stations.map((s) => (
                      <div key={s.id} className="group flex items-center justify-between bg-slate-900 border border-slate-700/50 hover:border-slate-600 rounded-xl px-4 py-3 transition-all hover:bg-slate-800/50">
                        <div className="min-w-0 pr-4">
                          <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{s.brand} • {s.address}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnassignStation(s.id)}
                          className="text-[10px] font-bold text-rose-400 hover:text-white border border-rose-500/30 hover:border-rose-500 hover:bg-rose-500 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer shadow-sm opacity-80 hover:opacity-100"
                        >
                          Unlink
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for animations and custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 0.6); }
      `}} />

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-amber-500/50 text-slate-100 text-sm font-bold px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[9999] flex items-center gap-3 animate-fade-in-down" style={{ animationDirection: 'reverse' /* visually slide up from bottom */}}>
          <span className="text-amber-500">✨</span> {toast}
        </div>
      )}
    </div>
  );
}
