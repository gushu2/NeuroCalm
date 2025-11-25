import React from 'react';
import { Users, FileText, AlertCircle, BarChart3 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  // Mock data for admin view
  const students = [
    { id: '1', name: 'Guruganesh N Bhat', usn: '4MW23CS044', status: 'Normal', lastActive: '2 mins ago' },
    { id: '2', name: 'Karthik S', usn: '4MW23CS055', status: 'High Stress', lastActive: 'Now' },
    { id: '3', name: 'K J Manya', usn: '4MW23CS051', status: 'Normal', lastActive: '5 mins ago' },
    { id: '4', name: 'K Kamakshi G Nayak', usn: '4MW23CS052', status: 'Mild Stress', lastActive: '10 mins ago' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Admin Control Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Download Reports</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-5 h-5"/></div>
             <span className="text-slate-500 text-sm font-medium">Total Students</span>
           </div>
           <p className="text-2xl font-bold text-slate-800">142</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle className="w-5 h-5"/></div>
             <span className="text-slate-500 text-sm font-medium">High Stress Alerts</span>
           </div>
           <p className="text-2xl font-bold text-slate-800">12</p>
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
          <h2 className="font-semibold text-slate-800">Student Monitoring</h2>
          <div className="text-sm text-slate-500">Real-time updates</div>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">USN</th>
              <th className="px-6 py-3">Current Status</th>
              <th className="px-6 py-3">Last Active</th>
              <th className="px-6 py-3">Actions</th>
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
                <td className="px-6 py-3">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
