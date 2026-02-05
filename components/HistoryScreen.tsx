
import React from 'react';
import { HistoryLog } from '../types';

interface Props {
  history: HistoryLog[];
  onBack: () => void;
}

const HistoryScreen: React.FC<Props> = ({ history, onBack }) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-600 text-white p-6 flex items-center space-x-4 rounded-b-3xl">
        <button onClick={onBack} className="text-xl"><i className="fas fa-arrow-left"></i></button>
        <h1 className="text-xl font-bold">สมุดบันทึกประวัติการทานยา</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {history.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <i className="fas fa-history text-5xl mb-4 opacity-20"></i>
            <p>ยังไม่มีประวัติการทานยา</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((log) => (
              <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{log.medicationName}</h3>
                    <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleDateString('th-TH')} - {log.timeTaken}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === 'taken' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {log.status === 'taken' ? 'ทานแล้ว' : 'ข้าม'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t text-center text-xs text-gray-400">
        เพื่อให้ผู้ติดตามคนป่วยตรวจสอบและดูแลได้อย่างใกล้ชิด
      </div>
    </div>
  );
};

export default HistoryScreen;
