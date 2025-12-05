import React, { useState } from 'react';
import { Users, FileText, AlertCircle, BarChart3, Download, Trash2, Edit, ChevronRight, Server, Activity, Laptop, FileDown, ShieldAlert } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-stone-800">Admin Control Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             System Online
        </div>
      </div>

      {/* Operational Flowchart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">System Operational Flow</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            {/* Connecting Line (Mobile hidden) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 -z-10"></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <Activity className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-stone-700">IoT Sensors</span>
                <span className="text-[10px] text-stone-400">ESP32 + Pulse</span>
            </div>

            <div className="hidden md:block text-stone-300"><ChevronRight /></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <Laptop className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-stone-700">Client Processing</span>
                <span className="text-[10px] text-stone-400">Web Serial API</span>
            </div>

            <div className="hidden md:block text-stone-300"><ChevronRight /></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <Server className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-stone-700">Analysis Engine</span>
                <span className="text-[10px] text-stone-400">Stress Algorithm</span>
            </div>

            <div className="hidden md:block text-stone-300"><ChevronRight /></div>

            <div className="flex flex-col items-center bg-white p-2 z-10">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2 ring-4 ring-white">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-stone-700">Action & Alert</span>
                <span className="text-[10px] text-stone-400">Yoga/Music Recs</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Users className="w-5 h-5"/></div>
             <span className="text-stone-500 text-sm font-medium">Total Students</span>
           </div>
           <p className="text-2xl font-bold text-stone-800">{students.length + 138}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle className="w-5 h-5"/></div>
             <span className="text-stone-500 text-sm font-medium">High Stress Alerts</span>
           </div>
           <p className="text-2xl font-bold text-stone-800">{students.filter(s => s.status === 'High Stress').length + 10}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-50 rounded-lg text-green-600"><BarChart3 className="w-5 h-5"/></div>
             <span className="text-stone-500 text-sm font-medium">Avg Stress Level</span>
           </div>
           <p className="text-2xl font-bold text-stone-800">Normal</p>
        </div>
        
        {/* New Data Management Console Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col justify-between">
           <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-stone-100 rounded-lg text-stone-600"><FileDown className="w-5 h-5"/></div>
                 <span className="text-stone-500 text-sm font-medium">Data Management</span>
               </div>
               <p className="text-xs text-stone-400 mb-2">1.2GB Logs Available</p>
           </div>
           <button 
                onClick={handleDownloadReport}
                className="w-full mt-2 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-200 flex items-center justify-center gap-2 transition-colors"
           >
                <Download className="w-3 h-3" /> Download Reports
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
          <h2 className="font-semibold text-stone-800">User Data Management</h2>
          <div className="flex gap-2">
              <button className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50">
                  <ShieldAlert className="w-3 h-3" /> Audit Log
              </button>
          </div>
        </div>
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="bg-stone-50 text-stone-500 font-medium">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">USN</th>
              <th className="px-6 py-3">Current Status</th>
              <th className="px-6 py-3">Last Active</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-3 font-medium text-stone-800">{student.name}</td>
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
                <td className="px-6 py-3 text-stone-500">{student.lastActive}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Edit User">
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
                    <td colSpan={5} className="text-center py-6 text-stone-400">No student records found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};