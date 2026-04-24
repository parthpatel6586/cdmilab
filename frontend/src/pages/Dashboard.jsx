import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Monitor, CheckCircle, AlertTriangle, Clock, FileDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/dashboard/analytics');
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await axios.get('/api/dashboard/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'allocation-report.csv');
      document.body.appendChild(link);
      link.click();
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) return <div>Loading...</div>;

  const stats = [
    { label: 'Total Students', value: analytics.totalStudents, icon: <Users />, color: 'bg-blue-500' },
    { label: 'Total PCs', value: analytics.totalPCs, icon: <Monitor />, color: 'bg-gray-700' },
    { label: 'Allocated PCs', value: analytics.allocatedPCs, icon: <CheckCircle />, color: 'bg-green-500' },
    { label: 'Under Maintenance', value: analytics.maintenancePCs, icon: <AlertTriangle />, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FileDown size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`w-14 h-14 ${stat.color} text-white rounded-lg flex items-center justify-center shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-800">
          <Clock size={20} className="text-green-600" />
          Recent Activity Log
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">PC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics.recentActivity.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      log.action === 'ALLOCATED' ? 'bg-green-100 text-green-700' :
                      log.action === 'DEALLOCATED' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">PC {log.pc?.pcNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{log.student?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{log.admin?.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
