import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function ICCPlatform() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('admin@icc.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  
  const defaultDepts = [
    { id: 'accueil', name: 'Accueil', icon: '🚪' },
    { id: 'louange', name: 'Louange', icon: '🎵' },
    { id: 'enfants', name: 'Enfants', icon: '👶' },
    { id: 'jeunesse', name: 'Jeunesse', icon: '👦' },
    { id: 'intercession', name: 'Intercession', icon: '🙏' },
    { id: 'streaming', name: 'Streaming', icon: '🎥' },
    { id: 'nettoyage', name: 'Nettoyage', icon: '🧹' },
    { id: 'logistique', name: 'Logistique', icon: '📦' }
  ];

  const [departments, setDepartments] = useState(defaultDepts);
  const [stars, setStars] = useState([
    { id: 1, name: 'Elvis Jean', email: 'elvis@icc.com', phone: '0612345678', birthDate: '1985-03-15', departments: ['accueil', 'louange'] },
    { id: 2, name: 'Béni Koffi', email: 'beni@icc.com', phone: '0623456789', birthDate: '1990-07-22', departments: ['enfants', 'jeunesse'] },
    { id: 3, name: 'Déborah Sall', email: 'deborah@icc.com', phone: '0634567890', birthDate: '1988-05-10', departments: ['accueil', 'intercession'] },
    { id: 4, name: 'Jemima Diallo', email: 'jemima@icc.com', phone: '0645678901', birthDate: '1992-08-20', departments: ['accueil'] },
    { id: 5, name: 'Ange Nkwenchia', email: 'ange@icc.com', phone: '0656789012', birthDate: '1987-06-30', departments: ['louange', 'streaming'] }
  ]);
  
  const [events, setEvents] = useState([
    { id: 1, title: 'Culte Dimanche', date: '2026-07-05', startTime: '10:00', type: 'culte', location: 'Église ICC' }
  ]);
  
  const [birthdays, setBirthdays] = useState([
    { id: 1, name: 'Elvis Jean', date: '1985-03-15' },
    { id: 2, name: 'Béni Koffi', date: '1990-07-22' },
    { id: 3, name: 'Déborah Sall', date: '1988-05-10' },
    { id: 4, name: 'Jemima Diallo', date: '1992-08-20' },
    { id: 5, name: 'Ange Nkwenchia', date: '1987-06-30' }
  ]);

  const [availability, setAvailability] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedSundays, setExpandedSundays] = useState({});

  const [showStarForm, setShowStarForm] = useState(false);
  const [editingStar, setEditingStar] = useState(null);
  const [starForm, setStarForm] = useState({ name: '', email: '', phone: '', birthDate: '', departments: [] });

  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: '', icon: '', color: 'blue' });

  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const [birthdayForm, setBirthdayForm] = useState({ name: '', date: '' });

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', date: '', startTime: '', type: 'culte', location: '' });

  useEffect(() => {
    const saved = localStorage.getItem('availability');
    if (saved) setAvailability(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
    localStorage.setItem('stars', JSON.stringify(stars));
    localStorage.setItem('availability', JSON.stringify(availability));
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
    localStorage.setItem('events', JSON.stringify(events));
  }, [departments, stars, availability, birthdays, events]);

  const getSundays = (month, year) => {
    const sundays = [];
    const date = new Date(year, month - 1, 1);
    while (date.getDay() !== 0) date.setDate(date.getDate() + 1);
    while (date.getMonth() === month - 1) {
      sundays.push(new Date(date));
      date.setDate(date.getDate() + 7);
    }
    return sundays;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const toggleAvailability = (starId, dateStr) => {
    const key = `${starId}_${dateStr}`;
    setAvailability(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isAvailable = (starId, dateStr) => {
    return availability[`${starId}_${dateStr}`] || false;
  };

  const getStarsByDept = (deptId) => {
    return stars.filter(s => s.departments.includes(deptId));
  };

  const getServicesForSunday = (sunday) => {
    const dateStr = sunday.toISOString().split('T')[0];
    const result = {};
    departments.forEach(dept => {
      result[dept.id] = {
        name: dept.name,
        icon: dept.icon,
        stars: stars.filter(star => {
          const isInDept = star.departments.includes(dept.id);
          const isAvail = isAvailable(star.id, dateStr);
          return isInDept && isAvail;
        })
      };
    });
    return result;
  };

  const countTotalServers = (sunday) => {
    const services = getServicesForSunday(sunday);
    return Object.values(services).reduce((acc, dept) => acc + dept.stars.length, 0);
  };

  const handleLogin = () => {
    setLoginError('');
    if (loginEmail === 'admin@icc.com' && loginPassword === 'admin123') {
      setCurrentUser({ id: 1, name: 'Admin', email: loginEmail, role: 'admin' });
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleAddStar = () => {
    if (!starForm.name.trim()) { alert('Le nom est obligatoire'); return; }
    if (starForm.departments.length === 0) { alert('Sélectionnez au moins un département'); return; }
    if (editingStar) {
      setStars(stars.map(s => s.id === editingStar.id ? { ...editingStar, ...starForm } : s));
      setEditingStar(null);
    } else {
      setStars([...stars, { id: Date.now(), ...starForm }]);
    }
    setStarForm({ name: '', email: '', phone: '', birthDate: '', departments: [] });
    setShowStarForm(false);
  };

  const handleEditStar = (star) => {
    setEditingStar(star);
    setStarForm({ name: star.name, email: star.email, phone: star.phone, birthDate: star.birthDate, departments: star.departments });
    setShowStarForm(true);
  };

  const handleDeleteStar = (id) => {
    if (window.confirm('Êtes-vous sûr?')) setStars(stars.filter(s => s.id !== id));
  };

  const handleAddDept = () => {
    if (!deptForm.name.trim()) { alert('Le nom est obligatoire'); return; }
    if (!deptForm.icon.trim()) { alert('Un emoji est obligatoire'); return; }
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...editingDept, ...deptForm } : d));
      setEditingDept(null);
    } else {
      const newId = deptForm.name.toLowerCase().replace(/\s+/g, '_');
      setDepartments([...departments, { id: newId, ...deptForm }]);
    }
    setDeptForm({ name: '', icon: '', color: 'blue' });
    setShowDeptForm(false);
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    setDeptForm({ name: dept.name, icon: dept.icon, color: dept.color });
    setShowDeptForm(true);
  };

  const handleDeleteDept = (id) => {
    if (window.confirm('Êtes-vous sûr?')) setDepartments(departments.filter(d => d.id !== id));
  };

  const handleAddBirthday = () => {
    if (!birthdayForm.name.trim()) { alert('Le nom est obligatoire'); return; }
    if (!birthdayForm.date) { alert('La date est obligatoire'); return; }
    if (editingBirthday) {
      setBirthdays(birthdays.map(b => b.id === editingBirthday.id ? { ...editingBirthday, ...birthdayForm } : b));
      setEditingBirthday(null);
    } else {
      setBirthdays([...birthdays, { id: Date.now(), ...birthdayForm }]);
    }
    setBirthdayForm({ name: '', date: '' });
    setShowBirthdayForm(false);
  };

  const handleEditBirthday = (birthday) => {
    setEditingBirthday(birthday);
    setBirthdayForm({ name: birthday.name, date: birthday.date });
    setShowBirthdayForm(true);
  };

  const handleDeleteBirthday = (id) => {
    if (window.confirm('Êtes-vous sûr?')) setBirthdays(birthdays.filter(b => b.id !== id));
  };

  const handleAddEvent = () => {
    if (!eventForm.title.trim()) { alert('Le titre est obligatoire'); return; }
    if (!eventForm.date) { alert('La date est obligatoire'); return; }
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...editingEvent, ...eventForm } : e));
      setEditingEvent(null);
    } else {
      setEvents([...events, { id: Date.now(), ...eventForm }]);
    }
    setEventForm({ title: '', date: '', startTime: '', type: 'culte', location: '' });
    setShowEventForm(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({ title: event.title, date: event.date, startTime: event.startTime, type: event.type, location: event.location });
    setShowEventForm(true);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Êtes-vous sûr?')) setEvents(events.filter(e => e.id !== id));
  };

  const toggleDeptExpand = (deptId) => {
    setExpandedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  const toggleSundayExpand = (dateStr) => {
    setExpandedSundays(prev => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const sundays = getSundays(selectedMonth, selectedYear);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-light tracking-tight text-black">Plateforme de gestion</h1>
              <p className="text-sm font-light text-gray-500">ICC Lyon Sud</p>
            </div>
            <div className="space-y-6">
              {loginError && <div className="p-4 border border-red-200 bg-red-50"><p className="text-sm text-red-700">{loginError}</p></div>}
              <div className="space-y-4">
                <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} className="w-full px-4 py-3 border border-gray-200 bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:border-red-500" />
                <input type="password" placeholder="Mot de passe" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} className="w-full px-4 py-3 border border-gray-200 bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:border-red-500" />
              </div>
              <button onClick={handleLogin} className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">Connexion</button>
            </div>
            <div className="text-center space-y-2 pt-8 border-t border-gray-200">
              <p className="text-xs font-light text-gray-500">Identifiants de test</p>
              <p className="text-xs text-gray-600">admin@icc.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-40 overflow-y-auto`}>
        <div className="p-8 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-light tracking-tight text-black">Plateforme de gestion</h2>
          <p className="text-xs font-light text-gray-500 mt-3">{currentUser.name}</p>
        </div>
        <nav className="p-6 space-y-1">
          {[
            { id: 'dashboard', label: 'Tableau de bord' },
            { id: 'recap', label: 'Récapitulatif' },
            { id: 'planning', label: 'Planning' },
            { id: 'stars', label: 'Serviteurs' },
            { id: 'birthdays', label: 'Anniversaires' },
            { id: 'events', label: 'Événements' },
            { id: 'departments', label: 'Départements' }
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-light transition-colors ${activeTab === item.id ? 'text-red-600 border-l-2 border-red-600 bg-red-50' : 'text-gray-700 hover:text-black'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm font-light text-gray-700 hover:text-black border border-gray-200 hover:border-gray-400 transition-colors">Déconnexion</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
          <h2 className="font-light text-black">Plateforme</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="p-8 md:p-12 max-w-6xl">
          {activeTab === 'dashboard' && (
            <div className="space-y-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-light tracking-tight text-black">Tableau de bord</h1>
                <p className="text-sm font-light text-gray-500">Vue d'ensemble de votre plateforme</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-3"><p className="text-sm font-light text-gray-500">Serviteurs</p><p className="text-3xl font-light text-black">{stars.length}</p></div>
                <div className="space-y-3"><p className="text-sm font-light text-gray-500">Départements</p><p className="text-3xl font-light text-black">{departments.length}</p></div>
                <div className="space-y-3"><p className="text-sm font-light text-gray-500">Anniversaires</p><p className="text-3xl font-light text-black">{birthdays.length}</p></div>
                <div className="space-y-3"><p className="text-sm font-light text-gray-500">Événements</p><p className="text-3xl font-light text-black">{events.length}</p></div>
              </div>
            </div>
          )}

          {activeTab === 'recap' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-light tracking-tight text-black">Services dimanche</h1>
                  <p className="text-sm font-light text-gray-500">{monthNames[selectedMonth - 1]} {selectedYear}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <button onClick={() => setSelectedMonth(selectedMonth === 1 ? 12 : selectedMonth - 1)} className="p-2 hover:bg-gray-100">←</button>
                  <span className="text-sm font-light text-gray-700 w-32 text-center">{monthNames[selectedMonth - 1]}</span>
                  <button onClick={() => setSelectedMonth(selectedMonth === 12 ? 1 : selectedMonth + 1)} className="p-2 hover:bg-gray-100">→</button>
                </div>
              </div>
              <div className="space-y-4">
                {sundays.map(sunday => {
                  const dateStr = sunday.toISOString().split('T')[0];
                  const isExpanded = expandedSundays[dateStr];
                  const services = getServicesForSunday(sunday);
                  const totalServers = countTotalServers(sunday);
                  const deptsCovered = Object.values(services).filter(d => d.stars.length > 0).length;
                  return (
                    <div key={dateStr} className="border border-gray-200">
                      <button onClick={() => toggleSundayExpand(dateStr)} className="w-full p-6 hover:bg-gray-50 flex justify-between items-center transition-colors">
                        <div className="text-left">
                          <h2 className="text-sm font-medium text-black">{formatDate(sunday)}</h2>
                          <p className="text-xs font-light text-gray-500 mt-2">{totalServers} serviteur{totalServers > 1 ? 's' : ''} • {deptsCovered}/{departments.length} départements</p>
                        </div>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {departments.map(dept => {
                              const deptServices = services[dept.id];
                              const hasServers = deptServices.stars.length > 0;
                              return (
                                <div key={dept.id} className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-black">{dept.icon} {dept.name}</h3>
                                    {hasServers ? <span className="text-xs text-red-600">●</span> : <span className="text-xs text-gray-300">●</span>}
                                  </div>
                                  <p className="text-xs font-light text-gray-500">{deptServices.stars.length} serviteur{deptServices.stars.length > 1 ? 's' : ''}</p>
                                  <div className="space-y-2">
                                    {deptServices.stars.length === 0 ? (
                                      <p className="text-xs text-gray-400 italic">Aucun serviteur</p>
                                    ) : (
                                      deptServices.stars.map(star => (
                                        <div key={star.id} className="text-xs text-gray-700">{star.name}</div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'planning' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-light tracking-tight text-black">Planning disponibilités</h1>
                <p className="text-sm font-light text-gray-500">Gérez les disponibilités de vos serviteurs</p>
              </div>
              <div className="flex gap-4 items-center">
                <button onClick={() => setSelectedMonth(selectedMonth === 1 ? 12 : selectedMonth - 1)} className="p-2 hover:bg-gray-100">←</button>
                <span className="text-sm font-light text-gray-700 w-32 text-center">{monthNames[selectedMonth - 1]}</span>
                <button onClick={() => setSelectedMonth(selectedMonth === 12 ? 1 : selectedMonth + 1)} className="p-2 hover:bg-gray-100">→</button>
              </div>
              <div className="space-y-6">
                {departments.map(dept => {
                  const deptStars = getStarsByDept(dept.id);
                  const isExpanded = expandedDepts[dept.id];
                  return (
                    <div key={dept.id} className="border border-gray-200">
                      <button onClick={() => toggleDeptExpand(dept.id)} className="w-full p-6 hover:bg-gray-50 flex justify-between items-center transition-colors">
                        <div>
                          <h2 className="text-sm font-medium text-black">{dept.icon} {dept.name}</h2>
                          <p className="text-xs font-light text-gray-500 mt-1">{deptStars.length} serviteur{deptStars.length > 1 ? 's' : ''}</p>
                        </div>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                          {deptStars.map(star => (
                            <div key={star.id} className="space-y-3">
                              <h3 className="text-sm font-medium text-black">{star.name}</h3>
                              <div className="grid grid-cols-4 gap-2">
                                {sundays.map(sunday => {
                                  const dateStr = sunday.toISOString().split('T')[0];
                                  const avail = isAvailable(star.id, dateStr);
                                  return (
                                    <button key={dateStr} onClick={() => toggleAvailability(star.id, dateStr)} className={`p-2 border text-xs font-light transition-colors ${avail ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                      {sunday.getDate()}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'stars' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start md:items-center gap-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-light tracking-tight text-black">Serviteurs</h1>
                  <p className="text-sm font-light text-gray-500">Gérez vos serviteurs</p>
                </div>
                <button onClick={() => { setShowStarForm(!showStarForm); setEditingStar(null); setStarForm({ name: '', email: '', phone: '', birthDate: '', departments: [] }); }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">+ Ajouter</button>
              </div>
              {showStarForm && (
                <div className="border border-gray-200 p-8 space-y-6">
                  <h2 className="text-sm font-medium text-black">Nouveau serviteur</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Nom complet" value={starForm.name} onChange={(e) => setStarForm({ ...starForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-red-500" />
                    <input type="email" placeholder="Email" value={starForm.email} onChange={(e) => setStarForm({ ...starForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-red-500" />
                    <input type="tel" placeholder="Téléphone" value={starForm.phone} onChange={(e) => setStarForm({ ...starForm, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-red-500" />
                    <input type="date" value={starForm.birthDate} onChange={(e) => setStarForm({ ...starForm, birthDate: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-red-500" />
                    <div>
                      <p className="text-xs font-light text-gray-500 mb-3">Départements</p>
                      <div className="grid grid-cols-2 gap-2">
                        {departments.map(dept => (
                          <label key={dept.id} className="flex items-center gap-3 p-2 border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={starForm.departments.includes(dept.id)} onChange={(e) => { if (e.target.checked) { setStarForm({ ...starForm, departments: [...starForm.departments, dept.id] }); } else { setStarForm({ ...starForm, departments: starForm.departments.filter(d => d !== dept.id) }); }}} className="w-4 h-4" />
                            <span className="text-xs font-light text-gray-700">{dept.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleAddStar} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">Ajouter</button>
                      <button onClick={() => setShowStarForm(false)} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Annuler</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {stars.map(star => (
                  <div key={star.id} className="border border-gray-200 p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-black">{star.name}</h3>
                      <p className="text-xs font-light text-gray-500">{star.email}</p>
                      <div className="flex gap-2 mt-2">
                        {star.departments.map(d => {
                          const dept = departments.find(dp => dp.id === d);
                          return dept ? <span key={d} className="text-xs bg-red-50 text-red-700 px-2 py-1">{dept.icon}</span> : null;
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditStar(star)} className="text-gray-400 hover:text-black">✏️</button>
                      <button onClick={() => handleDeleteStar(star.id)} className="text-gray-400 hover:text-red-600">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'birthdays' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start md:items-center gap-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-light tracking-tight text-black">Anniversaires</h1>
                  <p className="text-sm font-light text-gray-500">Gérez les anniversaires</p>
                </div>
                <button onClick={() => { setShowBirthdayForm(!showBirthdayForm); setEditingBirthday(null); setBirthdayForm({ name: '', date: '' }); }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">+ Ajouter</button>
              </div>
              {showBirthdayForm && (
                <div className="border border-gray-200 p-8 space-y-6">
                  <h2 className="text-sm font-medium text-black">Nouvel anniversaire</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Nom complet" value={birthdayForm.name} onChange={(e) => setBirthdayForm({ ...birthdayForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-red-500" />
                    <input type="date" value={birthdayForm.date} onChange={(e) => setBirthdayForm({ ...birthdayForm, date: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-red-500" />
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleAddBirthday} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">Ajouter</button>
                      <button onClick={() => setShowBirthdayForm(false)} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Annuler</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {birthdays.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate()).map(bd => {
                  const bdDate = new Date(bd.date);
                  return (
                    <div key={bd.id} className="border border-gray-200 p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-black">{bd.name}</h3>
                        <p className="text-xs font-light text-gray-500">{bdDate.toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditBirthday(bd)} className="text-gray-400 hover:text-black">✏️</button>
                        <button onClick={() => handleDeleteBirthday(bd.id)} className="text-gray-400 hover:text-red-600">🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start md:items-center gap-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-light tracking-tight text-black">Événements</h1>
                  <p className="text-sm font-light text-gray-500">Gérez les événements</p>
                </div>
                <button onClick={() => { setShowEventForm(!showEventForm); setEditingEvent(null); setEventForm({ title: '', date: '', startTime: '', type: 'culte', location: '' }); }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">+ Ajouter</button>
              </div>
              {showEventForm && (
                <div className="border border-gray-200 p-8 space-y-6">
                  <h2 className="text-sm font-medium text-black">Nouvel événement</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Titre" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-red-500" />
                    <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-red-500" />
                    <input type="time" value={eventForm.startTime} onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-red-500" />
                    <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-red-500">
                      <option value="culte">Culte</option>
                      <option value="reunion">Réunion</option>
                      <option value="formation">Formation</option>
                      <option value="social">Social</option>
                      <option value="autre">Autre</option>
                    </select>
                    <input type="text" placeholder="Lieu" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-red-500" />
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleAddEvent} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">Ajouter</button>
                      <button onClick={() => setShowEventForm(false)} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Annuler</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => (
                  <div key={event.id} className="border border-gray-200 p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-black">{event.title}</h3>
                      <p className="text-xs font-light text-gray-500">{new Date(event.date).toLocaleDateString('fr-FR')} {event.startTime && `à ${event.startTime}`}</p>
                      {event.location && <p className="text-xs font-light text-gray-500">📍 {event.location}</p>}
                      <p className="text-xs font-light text-gray-500">Type: {event.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditEvent(event)} className="text-gray-400 hover:text-black">✏️</button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="text-gray-400 hover:text-red-600">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start md:items-center gap-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-light tracking-tight text-black">Départements</h1>
                  <p className="text-sm font-light text-gray-500">Gérez vos départements</p>
                </div>
                <button onClick={() => { setShowDeptForm(!showDeptForm); setEditingDept(null); setDeptForm({ name: '', icon: '', color: 'blue' }); }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">+ Ajouter</button>
              </div>
              {showDeptForm && (
                <div className="border border-gray-200 p-8 space-y-6">
                  <h2 className="text-sm font-medium text-black">Nouveau département</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Nom du département" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-red-500" />
                    <input type="text" placeholder="Emoji (ex: 🚪)" maxLength="2" value={deptForm.icon} onChange={(e) => setDeptForm({ ...deptForm, icon: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-red-500" />
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleAddDept} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">Ajouter</button>
                      <button onClick={() => setShowDeptForm(false)} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Annuler</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {departments.map(dept => {
                  const deptStars = stars.filter(s => s.departments.includes(dept.id));
                  return (
                    <div key={dept.id} className="border border-gray-200 p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-black">{dept.icon} {dept.name}</h3>
                        <p className="text-xs font-light text-gray-500">{deptStars.length} serviteur{deptStars.length > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditDept(dept)} className="text-gray-400 hover:text-black">✏️</button>
                        <button onClick={() => handleDeleteDept(dept.id)} className="text-gray-400 hover:text-red-600">🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}