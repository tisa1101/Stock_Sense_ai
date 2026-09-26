import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import { Settings, User, Shield, Info, Sun, Moon, Laptop, ShieldCheck, Server } from 'lucide-react';
import { getAllUsers, getMyProfile, updateProfile, changePassword, changeUserRole, toggleUserStatus, deleteUser } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  
  const isAdmin = user?.role === UserRole.Admin;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your profile, appearance, and system configuration</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Tabs sidebar */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 p-4 space-y-1">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
            <User className="w-4 h-4" /> Profile Details
          </button>
          <button onClick={() => setActiveTab('appearance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
            <Sun className="w-4 h-4" /> Appearance
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
              <Shield className="w-4 h-4" /> User Management
            </button>
          )}
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'about' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
            <Info className="w-4 h-4" /> About System
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Profile Information</h2>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label><input type="text" defaultValue={user?.name} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label><input type="email" defaultValue={user?.email} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" /></div>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">Save Changes</button>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Change Password</h2>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" /></div>
                  <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Theme Preferences</h2>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-colors ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:border-slate-300'}`}>
                  <Sun className="w-8 h-8" /> <span className="font-medium">Light Mode</span>
                </button>
                <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-colors ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:border-slate-300'}`}>
                  <Moon className="w-8 h-8" /> <span className="font-medium">Dark Mode</span>
                </button>
                <button onClick={() => setTheme('system')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-colors ${theme === 'system' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:border-slate-300'}`}>
                  <Laptop className="w-8 h-8" /> <span className="font-medium">System</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && isAdmin && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">User Management</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Manage system users, roles, and access permissions.</p>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
                User management list will be loaded here.
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-xl space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">About StockSense</h2>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2 mb-2"><Server className="w-5 h-5" /> StockSense v1.0.0</h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">Intelligent Inventory Management System built for Hackathon 2026.</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white">Tech Stack</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> React 18 & Tailwind CSS</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> .NET 8 Web API & C#</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> SQL Server & EF Core</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Python & Google Gemini AI</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
