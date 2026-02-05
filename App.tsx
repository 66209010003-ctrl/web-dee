
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Medication, HistoryLog, AppScreen } from './types.ts';
import ProfileScreen from './components/ProfileScreen.tsx';
import SetupMedScreen from './components/SetupMedScreen.tsx';
import DashboardScreen from './components/DashboardScreen.tsx';
import AlarmScreen from './components/AlarmScreen.tsx';
import HistoryScreen from './components/HistoryScreen.tsx';
import EditMedScreen from './components/EditMedScreen.tsx';

const App: React.FC = () => {
  // --- TinyDB Emulation with Error Handling ---
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      return saved ? JSON.parse(saved) : { name: '', disease: '', birthDate: '' };
    } catch (e) {
      console.error("Load user error", e);
      return { name: '', disease: '', birthDate: '' };
    }
  });

  const [meds, setMeds] = useState<Medication[]>(() => {
    try {
      const saved = localStorage.getItem('medications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [history, setHistory] = useState<HistoryLog[]>(() => {
    try {
      const saved = localStorage.getItem('med_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // --- Navigation ---
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(
    user.name ? AppScreen.DASHBOARD : AppScreen.PROFILE
  );
  const [activeMedForAlarm, setActiveMedForAlarm] = useState<Medication | null>(null);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);

  // --- Sync to LocalStorage with Quota Error Handling ---
  useEffect(() => {
    try {
      localStorage.setItem('user_profile', JSON.stringify(user));
    } catch (e) {
      console.warn("Storage full, profile image might be too large", e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('medications', JSON.stringify(meds));
    } catch (e) {
      console.error("Save meds error", e);
    }
  }, [meds]);

  useEffect(() => {
    try {
      localStorage.setItem('med_history', JSON.stringify(history));
    } catch (e) {
      console.error("Save history error", e);
    }
  }, [history]);

  // --- Notification System (Clock) ---
  const lastAlarmRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (lastAlarmRef.current === currentTime) return;

      const triggerMed = meds.find(m => m.active && m.time === currentTime);
      if (triggerMed) {
        lastAlarmRef.current = currentTime;
        setActiveMedForAlarm(triggerMed);
        setCurrentScreen(AppScreen.ALARM);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [meds]);

  // --- Actions ---
  const addMed = (med: Medication) => {
    setMeds([...meds, med]);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const updateMed = (updated: Medication) => {
    setMeds(meds.map(m => m.id === updated.id ? updated : m));
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const deleteMed = (id: string) => {
    // ลำดับสำคัญ: กลับหน้าหลักก่อนแล้วค่อยลบเพื่อไม่ให้ Component พัง
    setCurrentScreen(AppScreen.DASHBOARD);
    setTimeout(() => {
      setMeds(prev => prev.filter(m => m.id !== id));
      setEditingMedId(null);
    }, 10);
  };

  const toggleMedStatus = (id: string) => {
    setMeds(meds.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const recordLog = (log: HistoryLog) => {
    setHistory([log, ...history]);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const goToEdit = (id: string) => {
    setEditingMedId(id);
    setCurrentScreen(AppScreen.EDIT_MED);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.PROFILE:
        return <ProfileScreen user={user} setUser={setUser} onNext={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.DASHBOARD:
        return (
          <DashboardScreen 
            meds={meds} 
            user={user}
            onToggle={toggleMedStatus} 
            onAdd={() => setCurrentScreen(AppScreen.SETTING_MED)} 
            onEdit={goToEdit}
            onViewHistory={() => setCurrentScreen(AppScreen.HISTORY)}
            onViewProfile={() => setCurrentScreen(AppScreen.PROFILE)}
          />
        );
      case AppScreen.SETTING_MED:
        return <SetupMedScreen onAdd={addMed} onCancel={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.EDIT_MED:
        const medToEdit = meds.find(m => m.id === editingMedId);
        return medToEdit ? (
          <EditMedScreen med={medToEdit} onSave={updateMed} onDelete={deleteMed} onCancel={() => setCurrentScreen(AppScreen.DASHBOARD)} />
        ) : (
          <DashboardScreen meds={meds} user={user} onToggle={toggleMedStatus} onAdd={() => setCurrentScreen(AppScreen.SETTING_MED)} onEdit={goToEdit} onViewHistory={() => setCurrentScreen(AppScreen.HISTORY)} onViewProfile={() => setCurrentScreen(AppScreen.PROFILE)} />
        );
      case AppScreen.HISTORY:
        return <HistoryScreen history={history} onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.ALARM:
        return activeMedForAlarm ? (
          <AlarmScreen medication={activeMedForAlarm} onConfirm={(log) => { recordLog(log); setActiveMedForAlarm(null); }} />
        ) : null;
      default:
        return <DashboardScreen meds={meds} user={user} onToggle={toggleMedStatus} onAdd={() => setCurrentScreen(AppScreen.SETTING_MED)} onEdit={goToEdit} onViewHistory={() => setCurrentScreen(AppScreen.HISTORY)} onViewProfile={() => setCurrentScreen(AppScreen.PROFILE)} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden bg-white font-sans">
      {renderScreen()}
    </div>
  );
};

export default App;
