/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, 
  Briefcase, 
  Phone, 
  Link as LinkIcon, 
  Hash, 
  QrCode, 
  ChevronRight,
  Share2,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Github,
  RotateCcw
} from 'lucide-react';

// --- Types ---
interface CardData {
  name: string;
  title: string;
  organization: string;
  phone: string;
  email: string;
  links: {
    instagram: string;
    twitter: string;
    github: string;
    website: string;
  };
  mbti: string;
}

const INITIAL_DATA: CardData = {
  name: 'Seunghun Oh',
  title: 'Lead Designer',
  organization: 'Apple Vision Korea',
  phone: '010-1234-5678',
  email: 'hello@studio.com',
  links: {
    instagram: 'oh_designer',
    twitter: '@oh_seung',
    github: 'oh-design',
    website: 'https://apple.com'
  },
  mbti: 'ENFJ'
};

// --- Components ---

const InputField = ({ label, icon: Icon, value, onChange, placeholder, name, type = "text" }: any) => (
  <div className="flex flex-col gap-1.5 w-full mb-4">
    <label className="text-[12px] font-medium text-gray-500 ml-1 flex items-center gap-1">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-sans"
    />
  </div>
);

export default function App() {
  const [data, setData] = useState<CardData>(INITIAL_DATA);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const shareUrl = useMemo(() => {
    // In a real app, this would be a link to the specific card profile
    return typeof window !== 'undefined' ? window.location.href : 'https://digitalcard.studio';
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center py-12 px-6">
      <header className="max-w-5xl w-full mb-12 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 rounded-full bg-black/5 text-[12px] font-semibold tracking-wider uppercase mb-3"
        >
          Studio Edition
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">Digital Identity</h1>
        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-lg">
          실시간으로 완성되는 당신만의 고급스러운 3D 디지털 명함을 경험해보세요.
        </p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Input Form */}
        <section className="bg-white/50 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 md:p-10 shadow-sm order-2 lg:order-1">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <User size={24} />
            정보 입력
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField label="이름 (Name)" name="name" value={data.name} onChange={handleInputChange} placeholder="홍길동" />
            <InputField label="소속 (Organization)" name="organization" value={data.organization} onChange={handleInputChange} placeholder="Apple Design Team" />
            <InputField label="직함 (Title)" name="title" value={data.title} onChange={handleInputChange} placeholder="Senior Developer" />
            <InputField label="연락처 (Phone)" name="phone" value={data.phone} onChange={handleInputChange} placeholder="010-0000-0000" />
            <InputField label="이메일 (Email)" name="email" value={data.email} onChange={handleInputChange} placeholder="address@email.com" />
            <InputField label="MBTI" name="mbti" value={data.mbti} onChange={handleInputChange} placeholder="ENFJ" />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InputField label="Instagram" name="links.instagram" icon={Instagram} value={data.links.instagram} onChange={handleInputChange} placeholder="username" />
              <InputField label="Twitter (X)" name="links.twitter" icon={Twitter} value={data.links.twitter} onChange={handleInputChange} placeholder="@handle" />
              <InputField label="GitHub" name="links.github" icon={Github} value={data.links.github} onChange={handleInputChange} placeholder="username" />
              <InputField label="Website" name="links.website" icon={LinkIcon} value={data.links.website} onChange={handleInputChange} placeholder="https://..." />
            </div>
          </div>

          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full mt-8 bg-black text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
          >
            {isFlipped ? <RotateCcw size={20} /> : <QrCode size={20} />}
            {isFlipped ? "앞면으로 돌아가기" : "QR 코드 생성하기"}
          </button>
        </section>

        {/* Right: Preview Card */}
        <div className="sticky top-12 flex flex-col items-center order-1 lg:order-2">
          <div 
            className="perspective-1000 w-full max-w-[450px] aspect-[1.6/1]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="w-full h-full preserve-3d relative cursor-default"
              style={{ rotateX, rotateY }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden w-full h-full bg-white rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 flex flex-col justify-between overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-zinc-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 text-zinc-300 mb-6">
                    <div className="w-10 h-1 h-px bg-zinc-200" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Premium Card</span>
                  </div>
                  
                  <motion.h3 
                    key={data.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold tracking-tight mb-1 text-black font-display"
                  >
                    {data.name || "Full Name"}
                  </motion.h3>
                  
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="text-sm font-medium">{data.title || "Job Title"}</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span className="text-sm font-bold text-black">{data.organization || "Organization"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                      <Phone size={12} className="text-zinc-400" />
                      {data.phone || "010-0000-0000"}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                      <Mail size={12} className="text-zinc-400" />
                      {data.email || "hello@example.com"}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-600 tracking-wider">
                      {data.mbti?.toUpperCase() || "MBTI"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Side (QR Code) */}
              <div className="absolute inset-0 backface-hidden w-full h-full bg-zinc-950 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-8 flex flex-col items-center justify-center rotate-y-180">
                <div className="bg-white p-3 rounded-2xl shadow-xl mb-4">
                  <QRCodeSVG 
                    value={shareUrl} 
                    size={160}
                    level="H"
                    includeMargin={false}
                    fgColor="#000000"
                  />
                </div>
                <p className="text-white font-bold text-lg mb-1 tracking-tight">Scan my card</p>
                <p className="text-zinc-500 text-sm">{data.name.toLowerCase().replace(/\s/g, '')}.contact</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 flex gap-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-black/20" />
              <div className={`w-2 h-2 rounded-full transition-all ${isFlipped ? 'bg-black' : 'bg-black/20'}`} />
            </div>
          </div>
          
          <div className="mt-10 flex gap-6 text-zinc-400">
             {data.links.instagram && <Instagram size={18} className="hover:text-black cursor-pointer transition-colors" />}
             {data.links.twitter && <Twitter size={18} className="hover:text-black cursor-pointer transition-colors" />}
             {data.links.github && <Github size={18} className="hover:text-black cursor-pointer transition-colors" />}
             {data.links.website && <LinkIcon size={18} className="hover:text-black cursor-pointer transition-colors" />}
          </div>
        </div>
      </main>

      <footer className="mt-24 text-center text-gray-400 text-sm">
        <p>&copy; 2026 Digital Card Studio. 모든 권리 보유.</p>
        <p className="mt-1 font-medium">Handcrafted with precision & minimalist aesthetics.</p>
      </footer>
    </div>
  );
}
