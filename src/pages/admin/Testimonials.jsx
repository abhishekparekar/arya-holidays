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

  // Subscribe to testimonials in real-time
  useEffect(() => {
    console.log('Setting up testimonials subscription...');
    const unsubscribe = subscribeToTestimonials((data) => {
      console.log('Testimonials data received:', data);
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
      console.log('Uploading avatar:', file.name);
      const url = await uploadCompressedImage(file, `testimonials/${Date.now()}_${file.name}`, 100);
      console.log('Avatar uploaded:', url);
      setFormData(prev => ({ ...prev, avatar: url }));
    } catch (err) {
      console.error('Upload error:', err);
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

      console.log('Saving testimonial:', testimonialData);

      if (editingId) {
        await updateTestimonial(editingId, testimonialData);
      } else {
        await addTestimonial(testimonialData);
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial) => {
    console.log('Editing testimonial:', testimonial);
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
        console.log('Deleting testimonial:', id);
        await deleteTestimonial(id);
      } catch (err) {
        console.error('Delete error:', err);
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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Testimonials</h1>
          <p className="text-gray-400">{testimonials.length} testimonials</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto"><X size={18} /></button>
          </div>
        )}

        {testimonials.length === 0 ? (
          <div className="bg-dark-800 rounded-2xl p-12 text-center">
            <p className="text-gray-400 mb-4">No testimonials yet. Add your first one!</p>
            <button onClick={openAddModal} className="btn-primary">
              <Plus size={18} className="inline mr-2" /> Add Testimonial
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-dark-800 rounded-2xl p-6 relative">
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.avatar ? (
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-dark-700 flex items-center justify-center text-gray-400">
                      {testimonial.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                  <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${testimonial.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {testimonial.status}
                  </span>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{testimonial.text}"</p>

                <div className="flex gap-2 pt-4 border-t border-dark-700">
                  <button onClick={() => handleEdit(testimonial)} className="flex-1 py-2 bg-primary-500/20 rounded-lg text-primary-400 text-sm hover:bg-primary-500/30 transition-colors flex items-center justify-center gap-1">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(testimonial.id)} className="flex-1 py-2 bg-red-500/20 rounded-lg text-red-400 text-sm hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-700 flex items-center justify-between sticky top-0 bg-dark-800">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Role</label>
                  <input type="text" name="role" value={formData.role} onChange={handleInputChange}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Rating</label>
                  <select name="rating" value={formData.rating} onChange={handleInputChange}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Avatar</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 py-3 bg-dark-700 border border-dark-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                      {uploading ? (
                        <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-gray-400 text-sm">{formData.avatar ? 'Change' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {formData.avatar && (
                      <img src={formData.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Review Text *</label>
                <textarea name="text" value={formData.text} onChange={handleInputChange} rows={4} required
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 resize-none" />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="flex-1 py-3 border border-dark-600 rounded-xl text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
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
