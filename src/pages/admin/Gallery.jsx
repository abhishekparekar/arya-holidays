import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload, Image, X, Search, Loader2, AlertCircle } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, uploadCompressedImage } from '../../firebase';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'himalayan',
    featured: false
  });
  const fileInputRef = useRef(null);

  // Subscribe to gallery in real-time
  useEffect(() => {
    console.log('Setting up gallery subscription...');
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Gallery loaded:', data.length);
      setImages(data);
      setLoading(false);
    }, (err) => {
      console.error('Gallery subscription error:', err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredImages = images.filter(img => 
    img.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    img.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      // Auto-fill title from first file name
      if (!formData.title) {
        const fileName = files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setFormData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(`Uploading image ${i + 1}/${selectedFiles.length}:`, file.name);
        
        const imageName = selectedFiles.length > 1 
          ? `${formData.title} ${i + 1}` 
          : formData.title;
        
        const url = await uploadCompressedImage(file, `gallery/${Date.now()}_${file.name}`, 200);
        
        await addDoc(collection(db, 'gallery'), {
          title: imageName,
          url: url,
          category: formData.category,
          featured: formData.featured && i === 0,
          createdAt: new Date().toISOString()
        });

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      console.log('All images uploaded successfully');
      setShowModal(false);
      setSelectedFiles([]);
      setFormData({ title: '', category: 'himalayan', featured: false });
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        console.log('Deleting image:', id);
        await deleteDoc(doc(db, 'gallery', id));
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete image');
      }
    }
  };

  const toggleFeatured = async (img) => {
    try {
      console.log('Toggling featured:', img.id);
      await updateDoc(doc(db, 'gallery', img.id), { featured: !img.featured });
    } catch (err) {
      console.error('Toggle error:', err);
      setError('Failed to update image');
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
          <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
          <p className="text-gray-400">{images.length} images</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Images
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
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search images..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{filteredImages.length} images</span>
              </div>
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="p-12 text-center">
              <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No images in gallery yet</p>
              <button onClick={() => setShowModal(true)} className="btn-primary">
                <Plus size={18} className="inline mr-2" /> Add Images
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
              {filteredImages.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleFeatured(img)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${img.featured ? 'bg-yellow-500 text-white' : 'bg-dark-900/80 text-gray-300 hover:bg-yellow-500 hover:text-white'}`}>
                      <span className="text-lg">⭐</span>
                    </button>
                    <button onClick={() => handleDelete(img.id)} className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-dark-900/80">
                    <h4 className="text-white text-sm font-medium truncate">{img.title}</h4>
                    <span className="text-primary-400 text-xs">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-dark-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Upload Images</h2>
              <button onClick={() => { setShowModal(false); setSelectedFiles([]); }} className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Drop Zone */}
              <div 
                className="border-2 border-dashed border-dark-600 rounded-2xl p-8 text-center hover:border-primary-500/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                {selectedFiles.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-primary-400 font-medium">{selectedFiles.length} file(s) selected</p>
                    <p className="text-gray-400 text-sm">{selectedFiles.map(f => f.name).join(', ')}</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFiles([]); }} className="text-red-400 text-sm hover:underline">
                      Clear selection
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-white mb-2">Drag & drop images here</p>
                    <p className="text-gray-500 text-sm mb-4">or</p>
                    <button type="button" className="px-6 py-2 bg-dark-700 border border-dark-600 rounded-xl text-white hover:bg-dark-600">
                      Browse Files
                    </button>
                    <p className="text-gray-500 text-xs mt-4">Images will be auto-compressed to 100-200KB</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Image Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500">
                    <option value="himalayan">Himalayan</option>
                    <option value="camping">Camping</option>
                    <option value="weekend">Weekend</option>
                    <option value="winter">Winter</option>
                    <option value="summer">Summer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Featured</label>
                  <label className="flex items-center gap-3 cursor-pointer mt-3">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-5 h-5 bg-dark-700 border-dark-600 rounded text-primary-500 focus:ring-primary-500" />
                    <span className="text-gray-300">Mark as featured</span>
                  </label>
                </div>
              </div>

              {uploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Uploading...</span>
                    <span className="text-primary-400">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setSelectedFiles([]); }} className="flex-1 py-3 border border-dark-600 rounded-xl text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="button" onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
