import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get('/api/dashboard/analytics');
      setLogs(data.recentActivity || []);
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Recent Activity Logs</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-800">
          <Clock size={20} className="text-green-600" />
          System Activity
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
              {logs.map((log) => (
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
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No recent activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
