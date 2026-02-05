
import React, { useEffect, useState, useRef } from 'react';
import { Medication, HistoryLog } from '../types.ts';

interface Props {
  medication: Medication;
  onConfirm: (log: HistoryLog) => void;
}

const AlarmScreen: React.FC<Props> = ({ medication, onConfirm }) => {
  const [pulse, setPulse] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    
    const announce = () => {
      const audio = new SpeechSynthesisUtterance(`ถึงเวลาทานยา ${medication.name} จำนวน ${medication.dosage} แล้วค่ะ`);
      audio.lang = 'th-TH';
      audio.rate = 1.0;
      window.speechSynthesis.speak(audio);
    };

    const playBeep = () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        console.error("Audio error", e);
      }
    };

    announce();
    const beepInterval = setInterval(playBeep, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(beepInterval);
      window.speechSynthesis.cancel();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [medication]);

  const handleAction = (status: 'taken' | 'skipped') => {
    onConfirm({
      id: Date.now().toString(),
      medicationName: medication.name,
      timeTaken: new Date().toLocaleTimeString('th-TH'),
      status,
      timestamp: Date.now()
    });
  };

  return (
    <div className="h-screen bg-red-600 text-white flex flex-col items-center justify-center p-8 text-center overflow-hidden animate-pulse-bg">
      <style>{`
        @keyframes pulse-bg {
          0% { background-color: #dc2626; }
          50% { background-color: #991b1b; }
          100% { background-color: #dc2626; }
        }
        .animate-pulse-bg { animation: pulse-bg 2s infinite; }
      `}</style>
      
      <div className={`w-48 h-48 bg-white/20 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${pulse ? 'scale-110' : 'scale-100'}`}>
        <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <i className={`fas ${medication.icon} text-6xl text-red-600`}></i>
        </div>
      </div>

      <h1 className="text-3xl font-black mb-2 uppercase">Alarm! ได้เวลาแล้ว</h1>
      <p className="text-xl opacity-90 mb-8">{medication.name}</p>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-full mb-12">
        <p className="text-sm opacity-70 mb-1">ปริมาณ</p>
        <p className="text-4xl font-black">{medication.dosage}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <button 
          onClick={() => handleAction('skipped')}
          className="bg-white/10 border border-white/30 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all"
        >
          ข้าม
        </button>
        <button 
          onClick={() => handleAction('taken')}
          className="bg-green-500 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-green-400 transition-all"
        >
          ทานแล้ว
        </button>
      </div>
    </div>
  );
};

export default AlarmScreen;
