import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Clock, X, Monitor, Laptop, Armchair, Database, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchData, setBatchData] = useState({ pcs: [], allocations: [] });
  const [newBatch, setNewBatch] = useState({ name: '', startTime: '', endTime: '' });
  
  // PC Details Popup in Summary
  const [activePCInfo, setActivePCInfo] = useState(null);

  useEffect(() => {
    fetchBatches();
    fetchLabs();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data } = await axios.get('/api/batches');
      setBatches(data);
    } catch (error) {
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const fetchLabs = async () => {
    try {
      const { data } = await axios.get('/api/labs');
      setLabs(data);
    } catch (error) {}
  };

  const fetchBatchSummary = async (batch) => {
    setSelectedBatch(batch);
    setLoading(true);
    try {
      const allPcs = [];
      const allAllocations = [];
      
      for (const lab of labs) {
        const { data } = await axios.get(`/api/labs/${lab._id}?batchId=${batch._id}`);
        const pcsWithLab = data.pcs.map(p => ({ ...p, labName: lab.name }));
        allPcs.push(...pcsWithLab);
        allAllocations.push(...data.allocations);
      }
      
      setBatchData({ pcs: allPcs, allocations: allAllocations });
      setShowSummaryModal(true);
    } catch (error) {
      toast.error('Failed to load batch summary');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/batches', newBatch);
      toast.success('Batch created');
      setShowModal(false);
      setNewBatch({ name: '', startTime: '', endTime: '' });
      fetchBatches();
    } catch (error) {
      toast.error('Failed to create batch');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Batch Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
        >
          <Plus size={18} />
          Add New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div 
            key={batch._id} 
            onClick={() => fetchBatchSummary(batch)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{batch.name}</h3>
                <p className="text-xs text-gray-400">{batch.startTime} - {batch.endTime}</p>
              </div>
            </div>
            <div className="text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              View Status
            </div>
          </div>
        ))}
      </div>

      {/* Batch Summary Modal */}
      {showSummaryModal && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col relative">
            
            {/* Inner Details Popup */}
            {activePCInfo && (
              <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center rounded-2xl">
                 <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xs w-full text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-blue-900 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                       {activePCInfo.pc.category === 'Laptop' ? <Laptop size={32}/> : <Monitor size={32}/>}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">PC {activePCInfo.pc.pcNumber}</h4>
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-4">{activePCInfo.pc.labName}</p>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Student Status</p>
                       {activePCInfo.allocation ? (
                         <>
                           <p className="text-md font-bold text-gray-800 uppercase">{activePCInfo.allocation.student.name}</p>
                           <p className="text-xs text-gray-500">{activePCInfo.allocation.student.studentId}</p>
                         </>
                       ) : (
                         <p className="text-md font-bold text-gray-400 uppercase tracking-widest italic">NULL (Free)</p>
                       )}
                    </div>
                    
                    <button onClick={() => setActivePCInfo(null)} className="w-full bg-blue-900 text-white py-2 rounded-lg font-bold">Close Details</button>
                 </div>
              </div>
            )}

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Batch Status: {selectedBatch.name}</h3>
                <p className="text-sm text-gray-500">Global PC allocation across all labs</p>
              </div>
              <button onClick={() => setShowSummaryModal(false)} className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
               {labs.map(lab => {
                 const labPcs = batchData.pcs.filter(p => p.lab === lab._id);
                 return (
                   <div key={lab._id} className="space-y-4">
                     <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Database size={18} className="text-blue-900" />
                        <h4 className="font-bold text-gray-800 uppercase tracking-widest text-xs">{lab.name}</h4>
                     </div>
                     <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                        {labPcs.map(pc => {
                          const allocation = batchData.allocations.find(a => (a.pc._id || a.pc) === pc._id);
                          return (
                            <div key={pc._id} className="flex flex-col items-center group cursor-pointer" onClick={() => setActivePCInfo({ pc, allocation })}>
                              <span className="text-[9px] font-bold text-gray-400 mb-1">{pc.pcNumber}</span>
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-sm group-hover:scale-110 ${
                                  allocation 
                                    ? 'bg-blue-900 text-white' 
                                    : 'bg-gray-50 border border-gray-200 text-gray-400 hover:border-blue-400'
                                }`}
                              >
                                {pc.category === 'Laptop' ? <Laptop size={18} /> : allocation ? <Monitor size={18} /> : <Armchair size={18} />}
                              </div>
                            </div>
                          );
                        })}
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Add New Batch</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name (e.g. 8 to 10)</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBatch.startTime}
                    onChange={(e) => setNewBatch({ ...newBatch, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBatch.endTime}
                    onChange={(e) => setNewBatch({ ...newBatch, endTime: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg font-bold mt-4 shadow-lg shadow-blue-100">Create Batch</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;
