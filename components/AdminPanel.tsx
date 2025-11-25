import React, { useState } from 'react';
import { Users, FileText, AlertCircle, BarChart3, Download, Trash2, Edit, ChevronRight, Server, Activity, Laptop } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  // State for students to allow "Management" simulation
  const [students, setStudents] = useState([
    { id: '1', name: 'Guruganesh N Bhat', usn: '4MW23CS044', status: 'Normal', lastActive: '2 mins ago', bpm: 72 },
    { id: '2', name: 'Karthik S', usn: '4MW23CS055', status: 'High Stress', lastActive: 'Now', bpm: 115 },
    { id: '3', name: 'K J Manya', usn: '4MW23CS051', status: 'Normal', lastActive: '5 mins ago', bpm: 68 },
    { id: '4', name: 'K Kamakshi G Nayak', usn: '4MW23CS052', status: 'Mild Stress', lastActive: '10 mins ago', bpm: 95 },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this student's data?")) {
        setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleDownloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,USN,Current Status,Last Active,Last BPM\n" 
        + students.map(s => `${s.name},${s.usn},${s.status},${s.lastActive},${s.bpm}`).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_wellness_report_2025.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Admin Control Dashboard</h1>
        <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
            <Download className="w-4 h-4" /> Download Reports
        </button>
      </div>

      {/* Operational Flowchart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">System Operational Flow</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            {/* Connecting Line (Mobile hidden) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <Activity className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700">IoT Sensors</span>
                <span className="text-[10px] text-slate-400">ESP32 + Pulse</span>
            </div>

            <div className="hidden md:block text-slate-300"><ChevronRight /></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <Laptop className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700">Client Processing</span>
                <span className="text-[10px] text-slate-400">Web Serial API</span>
            </div>

            <div className="hidden md:block text-slate-300"><ChevronRight /></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <Server className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700">Analysis Engine</span>
                <span className="text-[10px] text-slate-400">Stress Algorithm</span>
            </div>

            <div className="hidden md:block text-slate-300"><ChevronRight /></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700">Action & Alert</span>
                <span className="text-[10px] text-slate-400">Yoga/Music Recs</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-5 h-5"/></div>
             <span className="text-slate-500 text-sm font-medium">Total Students</span>
           </div>
           <p className="text-2xl font-bold text-slate-800">{students.length + 138}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle className="w-5 h-5"/></div>
             <span className="text-slate-500 text-sm font-medium">High Stress Alerts</span>
           </div>
           <p className="text-2xl font-bold text-slate-800">{students.filter(s => s.status === 'High Stress').length + 10}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-50 rounded-lg text-green-600"><BarChart3 className="w-5 h-5"/></div>
             <span className="text-slate-500 text-sm font-medium">Avg Stress Level</span>
           </div>
           <p className="text-2xl font-bold text-slate-800">Normal</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><FileText className="w-5 h-5"/></div>
             <span className="text-slate-500 text-sm font-medium">Data Logs</span>
           </div>
           <p className="text-2xl font-bold text-slate-800">1.2GB</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">User Data Management</h2>
          <div className="text-sm text-slate-500">Live Database</div>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">USN</th>
              <th className="px-6 py-3">Current Status</th>
              <th className="px-6 py-3">Last Active</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-800">{student.name}</td>
                <td className="px-6 py-3">{student.usn}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.status === 'High Stress' ? 'bg-red-100 text-red-700' :
                    student.status === 'Mild Stress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-500">{student.lastActive}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit User">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">No student records found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};