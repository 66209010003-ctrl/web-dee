
import React, { useState } from 'react';
import { Medication } from '../types.ts';

interface Props {
  med: Medication;
  onSave: (med: Medication) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const EditMedScreen: React.FC<Props> = ({ med, onSave, onDelete, onCancel }) => {
  const [name, setName] = useState(med.name);
  const [dosage, setDosage] = useState(med.dosage);
  const [time, setTime] = useState(med.time);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...med, name, dosage, time });
  };

  const handleDelete = () => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบการแจ้งเตือนยา "${med.name}"?`)) {
      onDelete(med.id);
    }
  };

  return (
    <div className="h-screen p-6 bg-white flex flex-col animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-800">แก้ไขข้อมูลยา</h2>
        <button onClick={handleDelete} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors">
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        <div className="bg-gray-50 p-4 rounded-2xl space-y-4 border border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">ชื่อยา</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">ปริมาณที่ทาน</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-sm"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">เวลาแจ้งเตือน</label>
            <input 
              required
              type="time" 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-3xl font-black text-center text-blue-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-auto space-y-3 pb-6">
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <i className="fas fa-check-circle"></i>
            <span>บันทึกการแก้ไขสำเร็จ</span>
          </button>
          
          <button 
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <i className="fas fa-trash"></i>
            <span>ลบการแจ้งเตือนนี้</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMedScreen;
