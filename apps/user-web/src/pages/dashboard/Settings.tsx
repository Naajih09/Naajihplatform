import React from 'react';
import { User, Bell, Lock, LogOut } from 'lucide-react';
import Button from '../../components/Button';

const Settings = () => {
  const sections = [
    { title: 'Account', icon: User, items: ['Personal Information', 'Language', 'Role Management'] },
    { title: 'Notifications', icon: Bell, items: ['Email Alerts', 'Push Notifications', 'Newsletter'] },
    { title: 'Security', icon: Lock, items: ['Change Password', 'Two-Factor Authentication'] },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans text-white pb-20">
      <h1 className="text-3xl font-black tracking-tight text-white">Settings</h1>

      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl overflow-hidden">
        {sections.map((section, idx) => (
            <div key={section.title} className={`p-6 ${idx !== sections.length - 1 ? 'border-b border-gray-800' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                    <section.icon className="text-primary" size={20} />
                    <h3 className="font-bold text-lg">{section.title}</h3>
                </div>
                <div className="space-y-3 pl-8">
                    {section.items.map(item => (
                        <div key={item} className="flex justify-between items-center group cursor-pointer">
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{item}</span>
                            <span className="text-xs text-gray-600 group-hover:text-primary">Edit</span>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="text-red-500 border-red-900 hover:bg-red-900/20">
            <LogOut size={16} className="mr-2" /> Sign out of all devices
        </Button>
      </div>
    </div>
  );
};

export default Settings;