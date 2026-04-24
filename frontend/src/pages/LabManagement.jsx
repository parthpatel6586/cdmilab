import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Database, ChevronRight, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LabManagement = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLab, setNewLab] = useState({ name: '', description: '', totalPCs: 25 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const { data } = await axios.get('/api/labs');
      setLabs(data);
    } catch (error) {
      toast.error('Failed to load labs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLab = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/labs', newLab);
      toast.success('Lab created successfully');
      setShowModal(false);
      setNewLab({ name: '', description: '', totalPCs: 25 });
      fetchLabs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lab');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lab Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-green-200"
        >
          <Plus size={18} />
          Create New Lab
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <div
            key={lab._id}
            onClick={() => navigate(`/labs/${lab._id}`)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <Database size={24} />
              </div>
              <div className="text-gray-400 group-hover:text-green-500 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{lab.name}</h3>
            <p className="text-gray-500 text-sm mb-4 h-10 overflow-hidden">{lab.description || 'No description provided'}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capacity</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-700">{lab.totalPCs} PCs</span>
            </div>
          </div>
        ))}
        {labs.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">No labs created yet. Click "Create New Lab" to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Create New Lab</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateLab} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name (e.g. Lab A)</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={newLab.name}
                  onChange={(e) => setNewLab({ ...newLab, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-24"
                  value={newLab.description}
                  onChange={(e) => setNewLab({ ...newLab, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total PCs</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={newLab.totalPCs}
                  onChange={(e) => setNewLab({ ...newLab, totalPCs: parseInt(e.target.value) })}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  Create Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabManagement;
