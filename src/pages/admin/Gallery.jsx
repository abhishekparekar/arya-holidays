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

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

      setShowModal(false);
      setSelectedFiles([]);
      setFormData({ title: '', category: 'himalayan', featured: false });
    } catch (err) {
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
      } catch (err) {
        setError('Failed to delete image');
      }
    }
  };

  const toggleFeatured = async (img) => {
    try {
      await updateDoc(doc(db, 'gallery', img.id), { featured: !img.featured });
    } catch (err) {
      setError('Failed to update image');
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Gallery Management</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{images.length} photos published in gallery</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5B301] text-[#111111] font-bold rounded-xl text-xs hover:bg-[#ffc107] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} /> Add Images
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-400 text-xs font-semibold">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Main Grid Container */}
      <div className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden">
        <div className="p-3.5 sm:p-5 border-b border-[#222222]">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search images by title or category..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#F5B301]" 
            />
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="p-10 text-center">
            <Image className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-xs sm:text-sm mb-3">No images in gallery yet</p>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F5B301] text-[#111111] font-bold rounded-xl text-xs">
              Upload First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3.5 sm:p-5">
            {filteredImages.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#222222]">
                <img src={img.url} alt={img.title} className="w-full h-36 sm:h-44 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => toggleFeatured(img)} 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      img.featured ? 'bg-[#F5B301] text-[#111111]' : 'bg-black/70 text-white hover:bg-[#F5B301]'
                    }`}
                    title={img.featured ? 'Featured' : 'Mark as featured'}
                  >
                    ⭐
                  </button>
                  <button 
                    onClick={() => handleDelete(img.id)} 
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-2.5 bg-[#161616]">
                  <h4 className="text-white text-xs font-bold truncate">{img.title || 'Untitled'}</h4>
                  <span className="text-[#F5B301] text-[10px] uppercase font-bold">{img.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#111111] rounded-2xl w-full max-w-lg overflow-hidden border border-[#333333] shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-white">Upload New Images</h2>
              <button onClick={() => { setShowModal(false); setSelectedFiles([]); }} className="w-8 h-8 bg-[#222222] rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              <div 
                className="border-2 border-dashed border-[#333333] rounded-2xl p-6 text-center hover:border-[#F5B301] transition-colors cursor-pointer bg-[#1a1a1a]"
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
                  <div className="space-y-1">
                    <p className="text-[#F5B301] font-bold text-xs">{selectedFiles.length} file(s) selected</p>
                    <p className="text-gray-400 text-[11px] truncate">{selectedFiles.map(f => f.name).join(', ')}</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFiles([]); }} className="text-red-400 text-[11px] hover:underline font-bold">
                      Clear selection
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#F5B301] mx-auto mb-2" />
                    <p className="text-white font-bold mb-1">Click or drag images here</p>
                    <p className="text-gray-500 text-[10px]">Images are auto-compressed for ultra-fast loading</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Image Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]"
                  >
                    <option value="himalayan">Himalayan</option>
                    <option value="camping">Camping</option>
                    <option value="weekend">Weekend</option>
                    <option value="winter">Winter</option>
                    <option value="summer">Summer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Featured</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input 
                      type="checkbox" 
                      checked={formData.featured} 
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#F5B301] focus:ring-[#F5B301]" 
                    />
                    <span className="text-gray-300 text-xs font-medium">Mark as featured</span>
                  </label>
                </div>
              </div>

              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400 font-semibold">Uploading...</span>
                    <span className="text-[#F5B301] font-bold">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-[#222222] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#F5B301] h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setSelectedFiles([]); }} className="flex-1 py-2.5 border border-[#333333] rounded-xl text-gray-300 font-semibold hover:bg-[#222222]">
                  Cancel
                </button>
                <button type="button" onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className="flex-1 py-2.5 bg-[#F5B301] text-[#111111] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#ffc107] disabled:opacity-50">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Upload Images'}
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
