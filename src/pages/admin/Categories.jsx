import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { addCategory, updateCategory, deleteCategory, uploadCompressedImage, subscribeToCategories } from '../../firebase';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(JSON.parse(JSON.stringify(category)));
    setShowModal(true);
    setError(null);
  };

  const handleAddNew = () => {
    setEditingCategory({
      name: '',
      title: '',
      description: '',
      image: '',
      icon: '',
      order: categories.length + 1,
      status: 'active'
    });
    setShowModal(true);
    setError(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadCompressedImage(file, `categories/${Date.now()}_${file.name}`, 200);
      setEditingCategory({ ...editingCategory, image: url });
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const form = e.target;
      const formData = new FormData(form);

      const categoryData = {
        name: formData.get('name') || editingCategory.name,
        title: formData.get('title') || editingCategory.title,
        description: formData.get('description') || editingCategory.description,
        image: editingCategory.image || '',
        icon: editingCategory.icon || '',
        order: parseInt(formData.get('order')) || editingCategory.order || 1,
        status: formData.get('status') || 'active'
      };

      if (editingCategory.id) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await addCategory(categoryData);
      }

      setShowModal(false);
    } catch (err) {
      setError('Failed to save category. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
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
      {/* Top Header */}
      <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Manage Categories</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{categories.length} total categories registered</p>
        </div>
        <button 
          onClick={handleAddNew} 
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5B301] text-[#111111] font-bold rounded-xl text-xs hover:bg-[#ffc107] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} /> 
          <span>Add Category</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-400 text-xs font-semibold">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden">
        {/* Search */}
        <div className="p-3.5 sm:p-5 border-b border-[#222222]">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#F5B301]" 
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#222222] bg-[#161616]">
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Category</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Order</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Status</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b border-[#222222] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={category.image || category.icon || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200'} 
                        alt={category.name || category.title} 
                        className="w-12 h-10 rounded-lg object-cover bg-gray-800 flex-shrink-0" 
                      />
                      <div>
                        <div className="text-white font-bold">{category.name || category.title}</div>
                        <div className="text-gray-400 text-[11px] line-clamp-1">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-300 font-bold">{category.order || 1}</td>
                  <td className="p-3 sm:p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      category.status === 'active' || !category.status ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {(category.status || 'Active').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(category)} 
                        className="w-8 h-8 bg-[#F5B301]/20 rounded-lg flex items-center justify-center text-[#F5B301] hover:bg-[#F5B301]/30 transition-colors"
                        title="Edit category"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)} 
                        className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && editingCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#111111] rounded-2xl w-full max-w-lg overflow-hidden border border-[#333333] shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white">
                {editingCategory.id ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-[#222222] rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Category Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingCategory.name || editingCategory.title} 
                  required
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301]" 
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingCategory.title}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301]" 
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows={2} 
                  defaultValue={editingCategory.description}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301] resize-none" 
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Category Image</label>
                <div className="flex items-center gap-3">
                  {editingCategory.image && (
                    <img src={editingCategory.image} alt="" className="w-16 h-12 rounded-lg object-cover bg-gray-800" />
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#333333] rounded-xl cursor-pointer hover:border-[#F5B301] transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-[#F5B301] animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-xs font-semibold">Upload Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Display Order</label>
                  <input 
                    type="number" 
                    name="order" 
                    defaultValue={editingCategory.order || 1} 
                    min="1"
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301]" 
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Status</label>
                  <select 
                    name="status" 
                    defaultValue={editingCategory.status || 'active'}
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#333333] rounded-xl text-gray-300 font-semibold hover:bg-[#222222]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#F5B301] text-[#111111] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#ffc107]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingCategory.id ? 'Save Changes' : 'Add Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
