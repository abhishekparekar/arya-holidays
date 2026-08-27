import { useState, useEffect } from 'react';
import { Plus, Star, Trash2, X, Edit, Loader2, AlertCircle, Upload } from 'lucide-react';
import { subscribeToTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, uploadCompressedImage } from '../../firebase';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    rating: 5,
    avatar: '',
    text: '',
    status: 'active'
  });

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((data) => {
      setTestimonials(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadCompressedImage(file, `testimonials/${Date.now()}_${file.name}`, 100);
      setFormData(prev => ({ ...prev, avatar: url }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const testimonialData = {
        name: formData.name,
        role: formData.role,
        location: formData.location,
        rating: parseInt(formData.rating),
        avatar: formData.avatar,
        text: formData.text,
        status: formData.status
      };

      if (editingId) {
        await updateTestimonial(editingId, testimonialData);
      } else {
        await addTestimonial(testimonialData);
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name || '',
      role: testimonial.role || '',
      location: testimonial.location || '',
      rating: testimonial.rating || 5,
      avatar: testimonial.avatar || '',
      text: testimonial.text || '',
      status: testimonial.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
      } catch (err) {
        setError('Failed to delete testimonial');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      location: '',
      rating: 5,
      avatar: '',
      text: '',
      status: 'active'
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingId(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#F5B301] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Manage Testimonials</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{testimonials.length} reviews published</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5B301] text-[#111111] font-bold rounded-xl text-xs hover:bg-[#ffc107] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-400 text-xs font-semibold">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Cards Grid */}
      {testimonials.length === 0 ? (
        <div className="bg-[#111111] rounded-2xl p-10 text-center border border-[#222222]">
          <p className="text-gray-400 text-xs sm:text-sm mb-3">No testimonials added yet.</p>
          <button onClick={openAddModal} className="px-4 py-2 bg-[#F5B301] text-[#111111] font-bold rounded-xl text-xs">
            Add First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-[#111111] rounded-2xl p-4 border border-[#222222] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {testimonial.avatar ? (
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover bg-gray-800" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#F5B301]/20 flex items-center justify-center text-[#F5B301] font-bold text-xs">
                        {testimonial.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-bold text-xs sm:text-sm">{testimonial.name}</h3>
                      {testimonial.location && <p className="text-gray-400 text-[11px]">{testimonial.location}</p>}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${testimonial.status === 'active' || !testimonial.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {(testimonial.status || 'Active').toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-0.5 mb-2">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} size={12} className="text-[#F5B301] fill-[#F5B301]" />
                  ))}
                </div>

                <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">"{testimonial.text || testimonial.message}"</p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#222222] mt-auto">
                <button 
                  onClick={() => handleEdit(testimonial)} 
                  className="flex-1 py-1.5 bg-[#F5B301]/20 rounded-lg text-[#F5B301] text-xs font-bold hover:bg-[#F5B301]/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit size={12} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(testimonial.id)} 
                  className="flex-1 py-1.5 bg-red-500/20 rounded-lg text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#111111] rounded-2xl w-full max-w-lg overflow-hidden border border-[#333333] shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-white">
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="w-8 h-8 bg-[#222222] rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    placeholder="Enter customer name"
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301]" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                    placeholder="Enter location (e.g. Pune, India)"
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Rating</label>
                  <select name="rating" value={formData.rating} onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Avatar Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] border border-[#333333] rounded-xl cursor-pointer hover:border-[#F5B301] transition-colors">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-[#F5B301] animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-gray-300 font-semibold text-xs">{formData.avatar ? 'Change Image' : 'Upload Avatar'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {formData.avatar && (
                    <img src={formData.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Review Text *</label>
                <textarea name="text" value={formData.text} onChange={handleInputChange} rows={3} required
                  placeholder="Enter customer review text..."
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301] resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="flex-1 py-2.5 border border-[#333333] rounded-xl text-gray-300 font-semibold hover:bg-[#222222]">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#F5B301] text-[#111111] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#ffc107]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? 'Saving...' : (editingId ? 'Update' : 'Add Testimonial')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
