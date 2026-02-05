
import React from 'react';
import { Medication, UserProfile } from '../types.ts';

interface Props {
  meds: Medication[];
  user: UserProfile;
  onToggle: (id: string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
}

const DashboardScreen: React.FC<Props> = ({ meds, user, onToggle, onAdd, onEdit, onViewHistory, onViewProfile }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 p-6 text-white rounded-b-[2.5rem] shadow-xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onViewProfile} 
            className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/50 flex items-center justify-center bg-blue-500 shadow-lg active:scale-90 transition-transform"
          >
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-user-circle text-2xl"></i>
            )}
          </button>
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tight leading-none">MedReminder</h1>
            <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Health Assistant</p>
          </div>
          <button 
            onClick={onViewHistory} 
            className="w-11 h-11 flex items-center justify-center text-xl bg-white/10 rounded-full active:scale-90 transition-transform"
          >
            <i className="fas fa-book-medical"></i>
          </button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl flex items-center space-x-4 border border-white/20">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg">
            <i className="fas fa-id-card-alt text-2xl"></i>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase opacity-60">ผู้ใช้งาน</span>
              <div className="h-1 w-1 rounded-full bg-green-400"></div>
            </div>
            <p className="text-lg font-bold truncate leading-tight">{user.name || 'ไม่ได้ระบุชื่อ'}</p>
            <p className="text-xs opacity-80 truncate mt-0.5">
              <i className="fas fa-notes-medical mr-1 text-[10px]"></i>
              {user.disease || 'ไม่มีข้อมูลโรคประจำตัว'}
            </p>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 pt-8">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">รายการแจ้งเตือน</h2>
          <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
            {meds.filter(m => m.active).length} กำลังทำงาน
          </span>
        </div>

        {meds.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
              <i className="fas fa-pills text-3xl text-gray-300"></i>
            </div>
            <p className="text-gray-400 font-bold">ยังไม่มีข้อมูลการทานยา</p>
            <p className="text-xs text-gray-400 mt-1 px-10 leading-relaxed">กดปุ่ม + ด้านล่างเพื่อเริ่มสร้างตารางการแจ้งเตือนส่วนตัวของคุณ</p>
          </div>
        ) : (
          meds.map((med) => (
            <div 
              key={med.id} 
              className={`bg-white border rounded-3xl p-4 flex items-center justify-between shadow-sm transition-all duration-300 ${!med.active ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md'}`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div 
                  className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-white text-xl shadow-inner transition-colors duration-500 ${med.active ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <i className={`fas ${med.icon || 'fa-capsules'}`}></i>
                </div>
                <div onClick={() => onEdit(med.id)} className="cursor-pointer flex-1">
                  <h3 className="font-black text-gray-800 text-base leading-tight">{med.name}</h3>
                  <div className="flex items-center text-xs font-bold text-blue-500 mt-1">
                    <i className="far fa-clock mr-1"></i>
                    <span>{med.time} น.</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-500">{med.dosage}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onToggle(med.id)}
                  className={`w-14 h-7 rounded-full relative transition-all duration-500 shadow-inner ${med.active ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${med.active ? 'left-8' : 'left-1'}`}></div>
                </button>
                <button onClick={() => onEdit(med.id)} className="text-gray-300 hover:text-blue-500 p-2 transition-colors">
                  <i className="fas fa-pen-square text-xl"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Nav */}
      <div className="p-6 bg-white/80 backdrop-blur-lg border-t flex justify-center pb-10">
        <button 
          onClick={onAdd}
          className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-90 transition-all flex items-center justify-center -mt-14 border-[6px] border-gray-50 group"
        >
          <i className="fas fa-plus text-2xl group-hover:rotate-90 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;
