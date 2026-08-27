import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Calendar, ChevronDown, ChevronUp, PlusCircle, Trash, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { deleteTrip, updateTrip, addTrip, uploadCompressedImage, subscribeToTrips, subscribeToCategories } from '../../firebase';

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [expandedSections, setExpandedSections] = useState(['basic']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubTrips = subscribeToTrips((data) => {
      setTrips(data);
    });

    const unsubCategories = subscribeToCategories((data) => {
      setCategories(data);
      setLoading(false);
    });

    return () => {
      unsubTrips();
      unsubCategories();
    };
  }, []);

  const filteredTrips = trips.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this trip package?')) {
      try {
        await deleteTrip(id);
      } catch (err) {
        setError('Failed to delete trip');
      }
    }
  };

  const handleEdit = (trip) => {
    const deepCopy = JSON.parse(JSON.stringify(trip));
    setEditingTrip(deepCopy);
    setShowModal(true);
    setError(null);
  };

  const handleAddNew = () => {
    const firstCategory = categories[0] || {};
    const newTrip = {
      title: '',
      location: '',
      categoryId: firstCategory.id || 'himalayan',
      categoryName: firstCategory.title || firstCategory.name || 'Himalayan Adventure',
      tripType: 'domestic',
      price: 0,
      nights: 0,
      days: 0,
      rating: 4.8,
      difficulty: 'Moderate',
      maxGroupSize: 15,
      minAge: 18,
      maxAltitude: '0m',
      status: 'active',
      featured: false,
      images: [],
      description: '',
      highlights: [],
      inclusions: [],
      exclusions: [],
      itinerary: [],
      addons: [],
      availableDates: [],
      thingsToCarry: [],
      cancellationPolicy: [],
      rules: [],
      pickupLocations: []
    };
    setEditingTrip(newTrip);
    setShowModal(true);
    setError(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadCompressedImage(file, `trips/${Date.now()}_${file.name}`, 200);
      setEditingTrip(prev => ({ ...prev, images: [...(prev.images || []), url] }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = editingTrip.images.filter((_, i) => i !== index);
    setEditingTrip({ ...editingTrip, images: newImages });
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    setEditingTrip(prev => ({ 
      ...prev, 
      categoryId,
      categoryName: category?.title || category?.name || categoryId
    }));
  };

  const handleSave = async () => {
    if (!editingTrip.title) {
      setError('Trip title is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const selectedCategory = categories.find(c => c.id === editingTrip.categoryId);
      
      const tripData = {
        ...editingTrip,
        categoryId: editingTrip.categoryId,
        categoryName: selectedCategory?.title || selectedCategory?.name || editingTrip.categoryId
      };

      if (editingTrip.id) {
        await updateTrip(editingTrip.id, tripData);
      } else {
        await addTrip(tripData);
      }
      setShowModal(false);
    } catch (err) {
      setError('Failed to save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditingTrip(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (field, defaultValue = '') => {
    setEditingTrip(prev => ({ 
      ...prev, 
      [field]: [...(prev[field] || []), defaultValue] 
    }));
  };

  const handleItemChange = (field, index, value) => {
    const newItems = [...(editingTrip[field] || [])];
    newItems[index] = value;
    setEditingTrip({ ...editingTrip, [field]: newItems });
  };

  const handleRemoveItem = (field, index) => {
    const newItems = (editingTrip[field] || []).filter((_, i) => i !== index);
    setEditingTrip({ ...editingTrip, [field]: newItems });
  };

  const handleAddItinerary = () => {
    const currentItinerary = editingTrip.itinerary || [];
    const newDay = currentItinerary.length > 0 
      ? currentItinerary[currentItinerary.length - 1].day + 1 
      : 1;
    setEditingTrip({ 
      ...editingTrip, 
      itinerary: [...currentItinerary, { day: newDay, title: '', description: '' }] 
    });
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...(editingTrip.itinerary || [])];
    newItinerary[index] = { 
      ...newItinerary[index], 
      [field]: field === 'day' ? parseInt(value) || 1 : value 
    };
    setEditingTrip({ ...editingTrip, itinerary: newItinerary });
  };

  const handleRemoveItinerary = (index) => {
    const newItinerary = editingTrip.itinerary.filter((_, i) => i !== index);
    setEditingTrip({ ...editingTrip, itinerary: newItinerary });
  };

  const handleAddPickupLocation = () => {
    const newLocations = editingTrip.pickupLocations || [];
    newLocations.push({
      id: Date.now().toString(),
      location: '',
      date: '',
      time: '',
      address: ''
    });
    setEditingTrip({ ...editingTrip, pickupLocations: newLocations });
  };

  const handlePickupLocationChange = (index, field, value) => {
    const newLocations = [...(editingTrip.pickupLocations || [])];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setEditingTrip({ ...editingTrip, pickupLocations: newLocations });
  };

  const handleRemovePickupLocation = (index) => {
    const newLocations = (editingTrip.pickupLocations || []).filter((_, i) => i !== index);
    setEditingTrip({ ...editingTrip, pickupLocations: newLocations });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const difficultyColors = { 
    Easy: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', 
    Moderate: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', 
    Difficult: 'bg-red-500/20 text-red-400 border border-red-500/30', 
    Expert: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
  };

  const inputStyle = "w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B301] text-xs sm:text-sm";

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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Manage Trip Packages</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{trips.length} active and domestic/international tour packages</p>
        </div>
        <button 
          onClick={handleAddNew} 
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5B301] text-[#111111] font-bold rounded-xl text-xs hover:bg-[#ffc107] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} /> Add New Trip
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-400 text-xs font-semibold">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden">
        {/* Search */}
        <div className="p-3.5 sm:p-5 border-b border-[#222222]">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by trip title or location..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#F5B301]" 
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#222222] bg-[#161616]">
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Trip Title</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Type</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Category</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Duration</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Price</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Difficulty</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Status</th>
                <th className="p-3 sm:p-4 font-bold uppercase text-[10px] tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-[#222222] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={trip.images?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200'} 
                        alt={trip.title} 
                        className="w-12 h-10 rounded-lg object-cover bg-gray-800 flex-shrink-0" 
                      />
                      <div>
                        <div className="text-white font-bold max-w-[200px] truncate">{trip.title}</div>
                        <div className="text-gray-400 text-[11px]">{trip.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      trip.tripType === 'international' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {trip.tripType === 'international' ? '🌍 Int\'l' : '🇮🇳 Domestic'}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className="px-2.5 py-0.5 bg-[#F5B301]/20 text-[#F5B301] border border-[#F5B301]/30 rounded-full text-[10px] font-bold whitespace-nowrap">
                      {trip.categoryName || 'Trek'}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-300 font-semibold">{trip.nights}N/{trip.days ?? (trip.nights + 1)}D</td>
                  <td className="p-3 sm:p-4 text-[#F5B301] font-bold">₹{trip.price?.toLocaleString()}</td>
                  <td className="p-3 sm:p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${difficultyColors[trip.difficulty] || difficultyColors.Moderate}`}>
                      {trip.difficulty || 'Moderate'}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      trip.status === 'active' || !trip.status ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {(trip.status || 'Active').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(trip)} 
                        className="w-8 h-8 bg-[#F5B301]/20 rounded-lg flex items-center justify-center text-[#F5B301] hover:bg-[#F5B301]/30 transition-colors"
                        title="Edit Trip"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(trip.id)} 
                        className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete Trip"
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

      {/* Edit / Create Modal */}
      {showModal && editingTrip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#111111] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden border border-[#333333] shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-[#222222] flex items-center justify-between bg-[#161616]">
              <h2 className="text-sm sm:text-base font-bold text-white">
                {editingTrip.id ? 'Edit Trip Package' : 'Add New Trip Package'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-[#222222] rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3.5 text-xs">
              
              {/* Section 1: Basic Information */}
              <div className="bg-[#161616] rounded-xl overflow-hidden border border-[#222222]">
                <button type="button" onClick={() => toggleSection('basic')} className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#F5B301] text-[#111111] rounded-md flex items-center justify-center font-extrabold text-[10px]">1</span>
                    Basic Information
                  </span>
                  {expandedSections.includes('basic') ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('basic') && (
                  <div className="p-4 pt-1 space-y-3 border-t border-[#222222]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-gray-300 font-semibold mb-1">Trip Title *</label>
                        <input 
                          type="text" 
                          value={editingTrip.title} 
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          placeholder="Enter trip title (e.g. Kedarkantha Trek 2026)"
                          className={inputStyle} 
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-gray-300 font-semibold mb-1">Description</label>
                        <textarea 
                          value={editingTrip.description || ''} 
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          rows={2} 
                          placeholder="Enter short summary or overview of trip package..."
                          className={`${inputStyle} resize-none`} 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Location *</label>
                        <input 
                          type="text" 
                          value={editingTrip.location || ''} 
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                          placeholder="Enter trip location (e.g. Sankri, Uttarakhand)"
                          className={inputStyle} 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Trip Type *</label>
                        <select 
                          value={editingTrip.tripType || 'domestic'} 
                          onChange={(e) => handleFieldChange('tripType', e.target.value)}
                          className={inputStyle}
                        >
                          <option value="domestic">🇮🇳 Domestic (India)</option>
                          <option value="international">🌍 International</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Category *</label>
                        <select 
                          value={editingTrip.categoryId} 
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className={inputStyle}
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title || cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Price (₹) *</label>
                        <input 
                          type="number" 
                          value={editingTrip.price || 0} 
                          onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                          className={inputStyle} 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Rating (0 - 5)</label>
                        <input 
                          type="number" 
                          value={editingTrip.rating || 4.8} 
                          onChange={(e) => handleFieldChange('rating', parseFloat(e.target.value) || 0)}
                          step="0.1" min="0" max="5"
                          className={inputStyle} 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Duration (Nights)</label>
                        <input 
                          type="number" 
                          value={editingTrip.nights || 0} 
                          onChange={(e) => handleFieldChange('nights', parseInt(e.target.value) || 0)}
                          className={inputStyle} 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Duration (Days)</label>
                        <input 
                          type="number" 
                          value={editingTrip.days ?? ''} 
                          onChange={(e) => handleFieldChange('days', parseInt(e.target.value) || 0)}
                          placeholder={editingTrip.nights ? String(editingTrip.nights + 1) : ''}  
                          className={inputStyle} 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Difficulty</label>
                        <select 
                          value={editingTrip.difficulty || 'Moderate'} 
                          onChange={(e) => handleFieldChange('difficulty', e.target.value)}
                          className={inputStyle}
                        >
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Difficult">Difficult</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Max Group Size</label>
                        <input 
                          type="number" 
                          value={editingTrip.maxGroupSize || 15} 
                          onChange={(e) => handleFieldChange('maxGroupSize', parseInt(e.target.value) || 15)}
                          className={inputStyle} 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Status</label>
                        <select 
                          value={editingTrip.status || 'active'} 
                          onChange={(e) => handleFieldChange('status', e.target.value)}
                          className={inputStyle}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer mt-3">
                          <input 
                            type="checkbox" 
                            checked={editingTrip.featured || false}
                            onChange={(e) => handleFieldChange('featured', e.target.checked)}
                            className="w-4 h-4 rounded text-[#F5B301] focus:ring-[#F5B301]" 
                          />
                          <span className="text-gray-300 font-semibold text-xs">Featured Trip (Show on Home)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Trip Images */}
              <div className="bg-[#161616] rounded-xl overflow-hidden border border-[#222222]">
                <button type="button" onClick={() => toggleSection('images')} className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#F5B301] text-[#111111] rounded-md flex items-center justify-center font-extrabold text-[10px]">2</span>
                    Trip Images ({editingTrip.images?.length || 0})
                  </span>
                  {expandedSections.includes('images') ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('images') && (
                  <div className="p-4 pt-1 space-y-3 border-t border-[#222222]">
                    {editingTrip.images?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {editingTrip.images.map((url, index) => (
                          <div key={index} className="relative group">
                            <img src={url} alt={`Trip ${index + 1}`} className="w-full h-24 object-cover rounded-xl bg-gray-800 border border-[#333333]" />
                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 rounded-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <label className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#333333] rounded-xl cursor-pointer hover:border-[#F5B301] transition-colors bg-[#1a1a1a]">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {uploading ? (
                        <Loader2 className="w-4 h-4 text-[#F5B301] animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 font-semibold text-xs">Upload Compressed Image</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {/* Section 3: Highlights */}
              <div className="bg-[#161616] rounded-xl overflow-hidden border border-[#222222]">
                <button type="button" onClick={() => toggleSection('highlights')} className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#F5B301] text-[#111111] rounded-md flex items-center justify-center font-extrabold text-[10px]">3</span>
                    Trip Highlights ({(editingTrip.highlights || []).length})
                  </span>
                  {expandedSections.includes('highlights') ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('highlights') && (
                  <div className="p-4 pt-1 space-y-2 border-t border-[#222222]">
                    {(editingTrip.highlights || []).map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleItemChange('highlights', index, e.target.value)}
                          placeholder="Enter key highlight (e.g. Scenic summit view)..."
                          className={inputStyle} 
                        />
                        <button type="button" onClick={() => handleRemoveItem('highlights', index)} className="p-2 text-red-400 hover:text-red-300">
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddItem('highlights')} className="w-full py-2 border border-dashed border-[#333333] rounded-xl text-gray-300 font-bold hover:border-[#F5B301] flex items-center justify-center gap-1.5 text-xs">
                      <PlusCircle size={14} /> Add Highlight
                    </button>
                  </div>
                )}
              </div>

              {/* Section 4: Inclusions & Exclusions */}
              <div className="bg-[#161616] rounded-xl overflow-hidden border border-[#222222]">
                <button type="button" onClick={() => toggleSection('inclusions')} className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#F5B301] text-[#111111] rounded-md flex items-center justify-center font-extrabold text-[10px]">4</span>
                    Inclusions & Exclusions
                  </span>
                  {expandedSections.includes('inclusions') ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('inclusions') && (
                  <div className="p-4 pt-1 space-y-4 border-t border-[#222222]">
                    <div>
                      <h4 className="text-emerald-400 font-bold mb-2 text-xs">✓ What's Included</h4>
                      {(editingTrip.inclusions || []).map((item, index) => (
                        <div key={index} className="flex gap-2 items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <input 
                            type="text" 
                            value={item} 
                            onChange={(e) => handleItemChange('inclusions', index, e.target.value)}
                            placeholder="Enter included feature (e.g. Hotel stay & meals)..."
                            className={inputStyle} 
                          />
                          <button type="button" onClick={() => handleRemoveItem('inclusions', index)} className="p-2 text-red-400">
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddItem('inclusions')} className="w-full py-1.5 border border-dashed border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 text-xs font-bold">
                        <PlusCircle size={14} /> Add Inclusion
                      </button>
                    </div>

                    <div>
                      <h4 className="text-red-400 font-bold mb-2 text-xs">✗ What's Excluded</h4>
                      {(editingTrip.exclusions || []).map((item, index) => (
                        <div key={index} className="flex gap-2 items-center mb-2">
                          <X size={16} className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <input 
                            type="text" 
                            value={item} 
                            onChange={(e) => handleItemChange('exclusions', index, e.target.value)}
                            placeholder="Enter excluded item (e.g. Personal expenses)..."
                            className={inputStyle} 
                          />
                          <button type="button" onClick={() => handleRemoveItem('exclusions', index)} className="p-2 text-red-400">
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddItem('exclusions')} className="w-full py-1.5 border border-dashed border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5 text-xs font-bold">
                        <PlusCircle size={14} /> Add Exclusion
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 5: Day-wise Itinerary */}
              <div className="bg-[#161616] rounded-xl overflow-hidden border border-[#222222]">
                <button type="button" onClick={() => toggleSection('itinerary')} className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#F5B301] text-[#111111] rounded-md flex items-center justify-center font-extrabold text-[10px]">5</span>
                    Day-wise Itinerary ({(editingTrip.itinerary || []).length})
                  </span>
                  {expandedSections.includes('itinerary') ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('itinerary') && (
                  <div className="p-4 pt-1 space-y-3 border-t border-[#222222]">
                    {(editingTrip.itinerary || []).map((day, index) => (
                      <div key={index} className="bg-[#1a1a1a] rounded-xl p-3 space-y-2 border border-[#333333]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#F5B301] font-bold text-xs">Day {day.day} Details</span>
                          <button type="button" onClick={() => handleRemoveItinerary(index)} className="p-1 text-red-400">
                            <Trash size={14} />
                          </button>
                        </div>
                        <input 
                          type="text" 
                          value={day.title} 
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                          placeholder="Enter day title (e.g. Arrival in Manali)..."
                          className={inputStyle} 
                        />
                        <textarea 
                          value={day.description} 
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} 
                          rows={2} 
                          placeholder="Enter day description & activities..."
                          className={`${inputStyle} resize-none`} 
                        />
                      </div>
                    ))}
                    <button type="button" onClick={handleAddItinerary} className="w-full py-2 border border-dashed border-[#333333] rounded-xl text-gray-300 font-bold hover:border-[#F5B301] flex items-center justify-center gap-1.5 text-xs">
                      <PlusCircle size={14} /> Add Itinerary Day
                    </button>
                  </div>
                )}
              </div>

              {/* Section 6: Pickup Locations */}
              <div className="bg-[#161616] rounded-xl overflow-hidden border border-[#222222]">
                <button type="button" onClick={() => toggleSection('pickup')} className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1a1a] transition-colors">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#F5B301] text-[#111111] rounded-md flex items-center justify-center font-extrabold text-[10px]">6</span>
                    Pickup Locations ({(editingTrip.pickupLocations || []).length})
                  </span>
                  {expandedSections.includes('pickup') ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('pickup') && (
                  <div className="p-4 pt-1 space-y-3 border-t border-[#222222]">
                    {(editingTrip.pickupLocations || []).map((loc, index) => (
                      <div key={loc.id || index} className="bg-[#1a1a1a] rounded-xl p-3 space-y-2 border border-[#333333]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#F5B301] text-xs font-bold">Pickup #{index + 1}</span>
                          <button type="button" onClick={() => handleRemovePickupLocation(index)} className="p-1 text-red-400">
                            <Trash size={14} />
                          </button>
                        </div>
                        <input 
                          type="text" 
                          value={loc.location || ''} 
                          onChange={(e) => handlePickupLocationChange(index, 'location', e.target.value)}
                          placeholder="Enter pickup location name (e.g. Pune Swargate)"
                          className={inputStyle} 
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="date" 
                            value={loc.date || ''} 
                            onChange={(e) => handlePickupLocationChange(index, 'date', e.target.value)}
                            className={inputStyle} 
                          />
                          <input 
                            type="time" 
                            value={loc.time || ''} 
                            onChange={(e) => handlePickupLocationChange(index, 'time', e.target.value)}
                            className={inputStyle} 
                          />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={handleAddPickupLocation} className="w-full py-2 border border-dashed border-[#333333] rounded-xl text-gray-300 font-bold hover:border-[#F5B301] flex items-center justify-center gap-1.5 text-xs">
                      <PlusCircle size={14} /> Add Pickup Point
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="flex gap-3 p-4 border-t border-[#222222] bg-[#161616]">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#333333] rounded-xl text-gray-300 font-semibold hover:bg-[#222222]">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#F5B301] text-[#111111] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#ffc107]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingTrip.id ? 'Save Changes' : 'Add Trip Package')}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;
