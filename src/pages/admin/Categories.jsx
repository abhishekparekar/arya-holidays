import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Loader2, GripVertical, AlertCircle } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory, uploadCompressedImage, subscribeToCategories } from '../../firebase';

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
    console.log('Admin Categories: Setting up subscription...');
    const unsubscribe = subscribeToCategories((data) => {
      console.log('Admin Categories: Categories received:', data);
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
        order: parseInt(formData.get('order')) || editingCategory.order,
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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
          <p className="text-gray-400">{categories.length} categories total</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Category
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

        <div className="bg-dark-800 rounded-2xl">
          <div className="p-6 border-b border-dark-700">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-dark-700">
                  <th className="p-6 font-medium">Category</th>
                  <th className="p-6 font-medium">Order</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={category.image || category.icon || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200'} 
                          alt={category.name || category.title} 
                          className="w-16 h-12 rounded-lg object-cover bg-dark-700" 
                        />
                        <div>
                          <div className="text-white font-medium">{category.name || category.title}</div>
                          <div className="text-gray-500 text-sm line-clamp-1">{category.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-gray-300">{category.order}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        category.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {category.status?.charAt(0).toUpperCase() + category.status?.slice(1)}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(category)} 
                          className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)} 
                          className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && editingCategory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-dark-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingCategory.id ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Category Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingCategory.name || editingCategory.title} 
                  required
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingCategory.title}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  defaultValue={editingCategory.description}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none" 
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Category Image</label>
                <div className="flex items-center gap-4">
                  {editingCategory.image && (
                    <img src={editingCategory.image} alt="" className="w-20 h-16 rounded-lg object-cover bg-dark-700" />
                  )}
                  <label className="flex-1 flex items-center justify-center gap-3 py-3 border-2 border-dashed border-dark-600 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
                      <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-400 text-sm">Upload Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Display Order</label>
                  <input 
                    type="number" 
                    name="order" 
                    defaultValue={editingCategory.order} 
                    min="1"
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  <select 
                    name="status" 
                    defaultValue={editingCategory.status || 'active'}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-dark-600 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingCategory.id ? 'Save Changes' : 'Add Category'
                  )}
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
