import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Monitor, User, Trash2, Settings, X, Search, Check, Laptop, Armchair, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LabView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [labData, setLabData] = useState(null);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchStudent, setSearchStudent] = useState('');
  
  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    fetchBatches();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      fetchLabDetails();
    }
  }, [id, selectedBatchId]);

  const fetchBatches = async () => {
    try {
      const { data } = await api.get('/api/batches');
      setBatches(data);
      if (data.length > 0 && !selectedBatchId) setSelectedBatchId(data[0]._id);
    } catch (error) {
      toast.error('Failed to load batches');
    }
  };

  const fetchLabDetails = async () => {
    try {
      const { data } = await api.get(`/api/labs/${id}?batchId=${selectedBatchId}`);
      setLabData(data);
    } catch (error) {
      toast.error('Failed to load lab details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/api/students');
      setStudents(data);
    } catch (error) {}
  };

  const handlePCAction = (pc) => {
    setSelectedPC(pc);
    const allocation = labData.allocations.find(a => (a.pc._id || a.pc) === pc._id);
    if (!allocation) {
      setShowAssignModal(true);
    } else {
      setSelectedAllocation(allocation);
      setShowInfoModal(true);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return toast.error('Please select a student');
    try {
      await api.put('/api/pc/assign', {
        pcId: selectedPC._id,
        studentId: selectedStudentId,
        batchId: selectedBatchId
      });
      toast.success('PC assigned successfully');
      setShowAssignModal(false);
      setSelectedStudentId('');
      fetchLabDetails();
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    }
  };

  const handleRemove = async () => {
    try {
      await api.put('/api/pc/remove', { pcId: selectedPC._id, batchId: selectedBatchId });
      toast.success('PC deallocated');
      setShowInfoModal(false);
      fetchLabDetails();
      fetchStudents();
    } catch (error) {
      toast.error('Failed to remove student');
    }
  };

  const updatePCCategory = async (category) => {
    try {
      await api.put('/api/pc/category', { pcId: selectedPC._id, category });
      toast.success(`Category updated to ${category}`);
      setShowStatusModal(false);
      fetchLabDetails();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (loading || !labData) return <div className="h-full flex items-center justify-center font-bold text-gray-400">Loading Lab System...</div>;

  const currentBatch = batches.find(b => b._id === selectedBatchId);

  const categorizedPCs = {
    Design: labData.pcs.filter(p => p.category === 'Design'),
    Development: labData.pcs.filter(p => p.category === 'Development'),
    Laptop: labData.pcs.filter(p => p.category === 'Laptop')
  };

  // Filter students by batch and check if already assigned in this batch
  const unassignedStudents = students.filter(s => 
    s.batch?._id === selectedBatchId && // Must be in current batch
    !labData.allocations.find(a => a.student._id === s._id) // Must not be already assigned
  );

  const getPCAllocation = (pcId) => labData.allocations.find(a => (a.pc._id || a.pc) === pcId);

  const PCGrid = ({ pcs, title }) => (
    <div className="space-y-4">
      <h3 className="text-center text-xl font-bold text-gray-800 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {pcs.map((pc) => {
          const allocation = getPCAllocation(pc._id);
          return (
            <div key={pc._id} className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 mb-1">{pc.pcNumber}</span>
              <button
                onClick={() => handlePCAction(pc)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedPC(pc);
                  setShowStatusModal(true);
                }}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                  allocation 
                    ? 'bg-blue-900 text-white ring-2 ring-offset-2 ring-blue-900' 
                    : 'bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {pc.category === 'Laptop' ? <Laptop size={20} /> : allocation ? <Monitor size={20} /> : <Armchair size={20} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Time : {currentBatch?.name.toUpperCase()}</h1>
        <div className="flex items-center justify-center gap-4">
           <select 
             value={selectedBatchId} 
             onChange={(e) => setSelectedBatchId(e.target.value)}
             className="bg-white border border-gray-300 rounded px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
           >
             {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-12">
        <PCGrid pcs={categorizedPCs.Design} title="Design PC" />
        <PCGrid pcs={categorizedPCs.Development} title="Development PC" />
        <PCGrid pcs={categorizedPCs.Laptop} title="Laptop" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 text-center font-bold text-gray-500 text-xs uppercase tracking-wider">
          PC Not Assigned in {currentBatch?.name} Batch
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-gray-50">
              <tr>
                <th className="px-6 py-3 font-bold text-gray-400 uppercase text-[10px]">Reg No</th>
                <th className="px-6 py-3 font-bold text-gray-400 uppercase text-[10px]">PC No</th>
                <th className="px-6 py-3 font-bold text-gray-400 uppercase text-[10px]">Student Name</th>
                <th className="px-6 py-3 font-bold text-gray-400 uppercase text-[10px]">Course</th>
                <th className="px-6 py-3 font-bold text-gray-400 uppercase text-[10px]">Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {unassignedStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-600 font-medium">{student.studentId}</td>
                  <td className="px-6 py-3 text-gray-600 font-medium">0</td>
                  <td className="px-6 py-3 text-gray-800 font-bold uppercase">{student.name}</td>
                  <td className="px-6 py-3 text-gray-600 font-medium uppercase">{student.course}</td>
                  <td className="px-6 py-3 text-gray-600 font-medium italic">N/A</td>
                </tr>
              ))}
              {unassignedStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium italic">All students in this batch are assigned</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Assign PC {selectedPC.pcNumber}</h3>
                <button onClick={() => setShowAssignModal(false)}><X size={20}/></button>
             </div>
             <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search student..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {students
                  .filter(s => 
                    s.batch?._id === selectedBatchId && 
                    !labData.allocations.find(a => a.student._id === s._id) && 
                    s.name.toLowerCase().includes(searchStudent.toLowerCase())
                  )
                  .map(student => (
                    <div
                      key={student._id}
                      onClick={() => setSelectedStudentId(student._id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer flex justify-between items-center ${
                        selectedStudentId === student._id ? 'border-blue-500 bg-blue-50' : 'border-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-800">{student.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{student.course} {student.hasLaptop ? '(Has Laptop)' : ''}</p>
                      </div>
                      {selectedStudentId === student._id && <Check size={18} className="text-blue-600" />}
                    </div>
                  ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={handleAssign} className="flex-1 bg-blue-900 text-white py-2 rounded-lg font-bold">Confirm Allocation</button>
              </div>
          </div>
        </div>
      )}

      {/* Info Modal (View Allocation) */}
      {showInfoModal && selectedPC && selectedAllocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-8 text-center relative">
            <button onClick={() => setShowInfoModal(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
            <div className="w-20 h-20 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              {selectedPC.category === 'Laptop' ? <Laptop size={40} /> : <Monitor size={40} />}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">PC {selectedPC.pcNumber}</h3>
            <p className="text-blue-600 font-bold text-sm mb-6 uppercase tracking-widest">{selectedPC.category}</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Allocated Student</p>
              <p className="text-lg font-bold text-gray-800 uppercase">{selectedAllocation.student.name}</p>
              <p className="text-xs text-gray-500">{selectedAllocation.student.studentId} | {selectedAllocation.student.course}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowInfoModal(false)} className="flex-1 border py-2 rounded-lg font-bold text-gray-600">Close</button>
              <button onClick={handleRemove} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold shadow-lg shadow-red-100 flex items-center justify-center gap-2">
                <Trash2 size={16} />
                Free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xs shadow-2xl p-6 space-y-3">
            <h3 className="font-bold text-center">Set PC Category</h3>
            {['Design', 'Development', 'Laptop'].map(cat => (
              <button 
                key={cat} 
                onClick={() => updatePCCategory(cat)}
                className="w-full py-2 border rounded-lg hover:bg-gray-50"
              >
                {cat}
              </button>
            ))}
            <button onClick={() => setShowStatusModal(false)} className="w-full text-xs text-gray-400">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabView;
