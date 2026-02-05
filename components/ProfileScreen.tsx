
import React, { useRef, useState } from 'react';
import { UserProfile } from '../types.ts';

interface Props {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  onNext: () => void;
}

const ProfileScreen: React.FC<Props> = ({ user, setUser, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // สร้าง Canvas เพื่อย่อขนาดรูปป้องกันหน่วยความจำเต็ม
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // บีบอัดคุณภาพเหลือ 0.7 เพื่อประหยัดพื้นที่ TinyDB
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setUser({ ...user, profileImage: compressedBase64 });
          }
          setIsProcessing(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="text-center mb-8">
        <div 
          onClick={triggerUpload}
          className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4 cursor-pointer overflow-hidden border-4 border-white shadow-md hover:scale-105 transition-transform relative"
        >
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <i className="fas fa-camera text-3xl text-blue-500"></i>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          className="hidden" 
        />
        <h1 className="text-2xl font-bold text-gray-800">โปรไฟล์ผู้ใช้งาน</h1>
        <p className="text-gray-500 text-sm">แตะที่รูปเพื่อเปลี่ยนรูปโปรไฟล์</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="ระบุชื่อของคุณ"
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">สาเหตุ/โรคประจำตัว</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="ระบุโรคประจำตัว"
            value={user.disease}
            onChange={(e) => setUser({...user, disease: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เดือนปีเกิด</label>
          <input 
            type="date" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={user.birthDate}
            onChange={(e) => setUser({...user, birthDate: e.target.value})}
          />
        </div>

        <button 
          onClick={onNext}
          disabled={!user.name || !user.disease || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-8 transition-all disabled:bg-gray-300 shadow-lg"
        >
          {isProcessing ? 'กำลังประมวลผล...' : 'บันทึกข้อมูลและเข้าสู่หน้าหลัก'}
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
