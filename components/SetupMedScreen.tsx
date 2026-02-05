
import React, { useState } from 'react';
import { Medication } from '../types';

interface Props {
  onAdd: (med: Medication) => void;
  onCancel: () => void;
}

const SetupMedScreen: React.FC<Props> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [icon, setIcon] = useState('fa-pills');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: Medication = {
      id: Date.now().toString(),
      name,
      dosage,
      time,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      active: true,
      icon
    };
    onAdd(newMed);
  };

  const icons = ['fa-pills', 'fa-capsules', 'fa-vial', 'fa-prescription-bottle', 'fa-tablets'];

  return (
    <div className="h-screen bg-gray-50 flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onCancel} className="text-gray-500"><i className="fas fa-arrow-left"></i></button>
        <h2 className="text-xl font-bold">ตั้งค่าการแจ้งเตือนยา</h2>
        <div className="w-6"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ไอคอนยา</label>
          <div className="flex space-x-2">
            {icons.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center border ${icon === i ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400'}`}
              >
                <i className={`fas ${i}`}></i>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อยา</label>
          <input 
            required
            type="text" 
            className="w-full p-3 border rounded-lg"
            placeholder="ตัวอย่าง: พาราเซตามอล"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ปริมาณ (เช่น กี่เม็ด)</label>
          <input 
            required
            type="text" 
            className="w-full p-3 border rounded-lg"
            placeholder="ตัวอย่าง: 1 เม็ด"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เวลาแจ้งเตือน</label>
          <input 
            required
            type="time" 
            className="w-full p-3 border rounded-lg text-xl font-bold text-center"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700"
          >
            บันทึกและเปิดแจ้งเตือน
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupMedScreen;
