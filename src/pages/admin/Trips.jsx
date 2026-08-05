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
    if (confirm('Are you sure you want to delete this trip?')) {
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
      rating: 0,
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
      // Find the selected category to get its name
      const selectedCategory = categories.find(c => c.id === editingTrip.categoryId);
      
      // Prepare trip data with both categoryId and categoryName
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

  const handleAddAddon = () => {
    setEditingTrip({ 
      ...editingTrip, 
      addons: [...(editingTrip.addons || []), { name: '', price: 0, description: '' }] 
    });
  };

  const handleAddonChange = (index, field, value) => {
    const newAddons = [...(editingTrip.addons || [])];
    newAddons[index] = { 
      ...newAddons[index], 
      [field]: field === 'price' ? parseInt(value) || 0 : value 
    };
    setEditingTrip({ ...editingTrip, addons: newAddons });
  };

  const handleRemoveAddon = (index) => {
    const newAddons = editingTrip.addons.filter((_, i) => i !== index);
    setEditingTrip({ ...editingTrip, addons: newAddons });
  };

  // Pickup Location handlers
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
    Easy: 'bg-green-500/20 text-green-400', 
    Moderate: 'bg-yellow-500/20 text-yellow-400', 
    Difficult: 'bg-red-500/20 text-red-400', 
    Expert: 'bg-purple-500/20 text-purple-400' 
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
          <h1 className="text-2xl font-bold text-white">Manage Trips</h1>
          <p className="text-gray-400">{trips.length} trips total</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Trip
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
                placeholder="Search trips..." 
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
                  <th className="p-6 font-medium">Trip</th>
                  <th className="p-6 font-medium">Type</th>
                  <th className="p-6 font-medium">Category</th>
                  <th className="p-6 font-medium">Duration</th>
                  <th className="p-6 font-medium">Price</th>
                  <th className="p-6 font-medium">Difficulty</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium">Featured</th>
                  <th className="p-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={trip.images?.[0]} alt={trip.title} className="w-20 h-14 rounded-lg object-cover bg-dark-700" />
                        <div>
                          <div className="text-white font-medium">{trip.title}</div>
                          <div className="text-gray-500 text-sm">{trip.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${trip.tripType === 'international' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                        {trip.tripType === 'international' ? '🌍 International' : '🇮🇳 Domestic'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">{trip.categoryName}</span>
                    </td>
                    <td className="p-6 text-gray-300">{trip.nights}N/{trip.days ?? (trip.nights + 1)}D</td>
                    <td className="p-6 text-white font-semibold">₹{trip.price?.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[trip.difficulty]}`}>{trip.difficulty}</span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${trip.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                      </span>
                    </td>
                    <td className="p-6">
                      {trip.featured ? (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">⭐ Featured</span>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(trip)} className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(trip.id)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
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

      {showModal && editingTrip && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-dark-800 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden my-4 flex flex-col">
            <div className="p-6 border-b border-dark-700 flex items-center justify-between flex-shrink-0 bg-dark-800">
              <h2 className="text-xl font-semibold text-white">
                {editingTrip.id ? 'Edit Trip' : 'Add New Trip'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* Basic Information Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('basic')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">1</span>
                    Basic Information
                  </span>
                  {expandedSections.includes('basic') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('basic') && (
                  <div className="p-6 pt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Trip Title *</label>
                        <input 
                          type="text" 
                          value={editingTrip.title} 
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          placeholder="Enter trip title..."
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Description</label>
                        <textarea 
                          value={editingTrip.description || ''} 
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          rows={3}
                          placeholder="Enter description..."
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Location *</label>
                        <input 
                          type="text" 
                          value={editingTrip.location || ''} 
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                          placeholder="e.g., Manali, HP"
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Trip Type *</label>
                        <select 
                          value={editingTrip.tripType || 'domestic'} 
                          onChange={(e) => handleFieldChange('tripType', e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                        >
                          <option value="domestic">🇮🇳 Domestic (India)</option>
                          <option value="international">🌍 International</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Category *</label>
                        <select 
                          value={editingTrip.categoryId} 
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title || cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Price (₹) *</label>
                        <input 
                          type="number" 
                          value={editingTrip.price || 0} 
                          onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Rating (0-5)</label>
                        <input 
                          type="number" 
                          value={editingTrip.rating || 0} 
                          onChange={(e) => handleFieldChange('rating', parseFloat(e.target.value) || 0)}
                          step="0.1" 
                          min="0" 
                          max="5"
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Duration (Nights)</label>
                        <input 
                          type="number" 
                          value={editingTrip.nights || 0} 
                          onChange={(e) => handleFieldChange('nights', parseInt(e.target.value) || 0)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Duration (Days)</label>
                        <input 
                          type="number" 
                          value={editingTrip.days ?? ''} 
                          onChange={(e) => handleFieldChange('days', parseInt(e.target.value) || 0)}
                          placeholder={editingTrip.nights ? String(editingTrip.nights + 1) : ''}  
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Difficulty *</label>
                        <select 
                          value={editingTrip.difficulty || 'Moderate'} 
                          onChange={(e) => handleFieldChange('difficulty', e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Difficult">Difficult</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Max Group Size</label>
                        <input 
                          type="number" 
                          value={editingTrip.maxGroupSize || 15} 
                          onChange={(e) => handleFieldChange('maxGroupSize', parseInt(e.target.value) || 15)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Status</label>
                        <select 
                          value={editingTrip.status || 'active'} 
                          onChange={(e) => handleFieldChange('status', e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-3 cursor-pointer mt-3">
                          <input 
                            type="checkbox" 
                            checked={editingTrip.featured || false}
                            onChange={(e) => handleFieldChange('featured', e.target.checked)}
                            className="w-5 h-5 bg-dark-700 border-dark-600 rounded text-primary-500 focus:ring-primary-500" 
                          />
                          <span className="text-gray-300">Featured Trip</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('images')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">2</span>
                    Trip Images ({editingTrip.images?.length || 0})
                  </span>
                  {expandedSections.includes('images') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('images') && (
                  <div className="p-6 pt-2 space-y-4">
                    <p className="text-gray-400 text-sm">Upload images (auto-compressed to 100-200KB)</p>
                    
                    {editingTrip.images?.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {editingTrip.images.map((url, index) => (
                          <div key={index} className="relative group">
                            <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded-xl bg-dark-700" />
                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <label className="flex items-center justify-center gap-3 py-4 border-2 border-dashed border-dark-600 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {uploading ? (
                        <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-gray-400">Click to upload image</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {/* Highlights Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('highlights')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">3</span>
                    Trip Highlights ({(editingTrip.highlights || []).length})
                  </span>
                  {expandedSections.includes('highlights') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('highlights') && (
                  <div className="p-6 pt-2 space-y-4">
                    {(editingTrip.highlights || []).map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleItemChange('highlights', index, e.target.value)}
                          placeholder="Enter highlight..."
                          className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                        <button type="button" onClick={() => handleRemoveItem('highlights', index)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                          <Trash size={18} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddItem('highlights')} className="w-full py-3 border border-dashed border-dark-600 rounded-xl text-gray-400 hover:text-primary-400 hover:border-primary-500 transition-colors flex items-center justify-center gap-2">
                      <PlusCircle size={18} /> Add Highlight
                    </button>
                  </div>
                )}
              </div>

              {/* Inclusions Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('inclusions')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">4</span>
                    Inclusions & Exclusions
                  </span>
                  {expandedSections.includes('inclusions') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('inclusions') && (
                  <div className="p-6 pt-2 space-y-6">
                    <div>
                      <h4 className="text-green-400 font-medium mb-3">✓ What's Included</h4>
                      {(editingTrip.inclusions || []).map((item, index) => (
                        <div key={index} className="flex gap-3 items-center mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <input 
                            type="text" 
                            value={item} 
                            onChange={(e) => handleItemChange('inclusions', index, e.target.value)}
                            placeholder="Enter inclusion..."
                            className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                          />
                          <button type="button" onClick={() => handleRemoveItem('inclusions', index)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                            <Trash size={18} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddItem('inclusions')} className="w-full py-2 border border-dashed border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2 text-sm">
                        <PlusCircle size={16} /> Add Inclusion
                      </button>
                    </div>

                    <div>
                      <h4 className="text-red-400 font-medium mb-3">✗ Excluded</h4>
                      {(editingTrip.exclusions || []).map((item, index) => (
                        <div key={index} className="flex gap-3 items-center mb-3">
                          <X size={18} className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <input 
                            type="text" 
                            value={item} 
                            onChange={(e) => handleItemChange('exclusions', index, e.target.value)}
                            placeholder="Enter exclusion..."
                            className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                          />
                          <button type="button" onClick={() => handleRemoveItem('exclusions', index)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                            <Trash size={18} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddItem('exclusions')} className="w-full py-2 border border-dashed border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 text-sm">
                        <PlusCircle size={16} /> Add Exclusion
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Itinerary Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('itinerary')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">5</span>
                    Day-wise Itinerary ({(editingTrip.itinerary || []).length})
                  </span>
                  {expandedSections.includes('itinerary') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('itinerary') && (
                  <div className="p-6 pt-2 space-y-4">
                    {(editingTrip.itinerary || []).map((day, index) => (
                      <div key={index} className="bg-dark-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold">D{day.day}</span>
                            </div>
                            <input 
                              type="number" 
                              value={day.day} 
                              onChange={(e) => handleItineraryChange(index, 'day', e.target.value)} 
                              min="1"
                              className="w-20 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500" 
                            />
                          </div>
                          <button type="button" onClick={() => handleRemoveItinerary(index)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                            <Trash size={18} />
                          </button>
                        </div>
                        <input 
                          type="text" 
                          value={day.title} 
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                          placeholder="Day title..."
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                        <textarea 
                          value={day.description} 
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} 
                          rows={2} 
                          placeholder="Day description..."
                          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none" 
                        />
                      </div>
                    ))}
                    <button type="button" onClick={handleAddItinerary} className="w-full py-3 border border-dashed border-dark-600 rounded-xl text-gray-400 hover:text-primary-400 hover:border-primary-500 transition-colors flex items-center justify-center gap-2">
                      <PlusCircle size={18} /> Add Day
                    </button>
                  </div>
                )}
              </div>

              {/* Pickup Information Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('pickup')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">6</span>
                    Pickup Locations ({(editingTrip.pickupLocations || []).length})
                  </span>
                  {expandedSections.includes('pickup') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('pickup') && (
                  <div className="p-6 pt-2 space-y-4">
                    <p className="text-gray-400 text-sm">Add multiple pickup locations with date and time for this trip</p>
                    
                    {(editingTrip.pickupLocations || []).map((loc, index) => (
                      <div key={loc.id || index} className="bg-dark-800 rounded-xl p-4 space-y-3 border border-dark-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-primary-400 text-sm font-medium">Location {index + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemovePickupLocation(index)} 
                            className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-xs mb-1.5">Location Name *</label>
                          <input 
                            type="text" 
                            value={loc.location || ''} 
                            onChange={(e) => handlePickupLocationChange(index, 'location', e.target.value)}
                            placeholder="e.g., Manali Bus Stand, ISBT Delhi"
                            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-xs mb-1.5">Full Address</label>
                          <input 
                            type="text" 
                            value={loc.address || ''} 
                            onChange={(e) => handlePickupLocationChange(index, 'address', e.target.value)}
                            placeholder="e.g., Near Main Market, Mall Road"
                            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Pickup Date</label>
                            <input 
                              type="date" 
                              value={loc.date || ''} 
                              onChange={(e) => handlePickupLocationChange(index, 'date', e.target.value)}
                              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs mb-1.5">Pickup Time</label>
                            <input 
                              type="time" 
                              value={loc.time || ''} 
                              onChange={(e) => handlePickupLocationChange(index, 'time', e.target.value)}
                              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      onClick={handleAddPickupLocation} 
                      className="w-full py-3 border border-dashed border-primary-500/50 rounded-xl text-primary-400 hover:bg-primary-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={18} /> Add Pickup Location
                    </button>
                  </div>
                )}
              </div>

              {/* Things to Carry Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('thingsToCarry')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">7</span>
                    Things to Carry ({(editingTrip.thingsToCarry || []).length})
                  </span>
                  {expandedSections.includes('thingsToCarry') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('thingsToCarry') && (
                  <div className="p-6 pt-2 space-y-4">
                    <p className="text-gray-400 text-sm">Add items that trekkers should carry for this trip</p>
                    {(editingTrip.thingsToCarry || []).map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleItemChange('thingsToCarry', index, e.target.value)}
                          placeholder="Enter item to carry..."
                          className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                        <button type="button" onClick={() => handleRemoveItem('thingsToCarry', index)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                          <Trash size={18} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddItem('thingsToCarry')} className="w-full py-3 border border-dashed border-dark-600 rounded-xl text-gray-400 hover:text-primary-400 hover:border-primary-500 transition-colors flex items-center justify-center gap-2">
                      <PlusCircle size={18} /> Add Item
                    </button>
                  </div>
                )}
              </div>

              {/* Cancellation Policy Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('cancellationPolicy')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">8</span>
                    Cancellation Policy ({(editingTrip.cancellationPolicy || []).length})
                  </span>
                  {expandedSections.includes('cancellationPolicy') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('cancellationPolicy') && (
                  <div className="p-6 pt-2 space-y-4">
                    <p className="text-gray-400 text-sm">Add cancellation policy rules for this trip</p>
                    {(editingTrip.cancellationPolicy || []).map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <X size={18} className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleItemChange('cancellationPolicy', index, e.target.value)}
                          placeholder="Enter cancellation rule (e.g., 'Free cancellation up to 7 days before')..."
                          className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                        <button type="button" onClick={() => handleRemoveItem('cancellationPolicy', index)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                          <Trash size={18} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddItem('cancellationPolicy')} className="w-full py-3 border border-dashed border-dark-600 rounded-xl text-gray-400 hover:text-primary-400 hover:border-primary-500 transition-colors flex items-center justify-center gap-2">
                      <PlusCircle size={18} /> Add Policy
                    </button>
                  </div>
                )}
              </div>

              {/* Trip Rules Section */}
              <div className="bg-dark-700/30 rounded-2xl overflow-hidden border border-dark-700">
                <button type="button" onClick={() => toggleSection('rules')} className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
                  <span className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">9</span>
                    Trip Rules ({(editingTrip.rules || []).length})
                  </span>
                  {expandedSections.includes('rules') ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedSections.includes('rules') && (
                  <div className="p-6 pt-2 space-y-4">
                    <p className="text-gray-400 text-sm">Add rules and guidelines for this trip</p>
                    {(editingTrip.rules || []).map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <AlertCircle size={18} className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => handleItemChange('rules', index, e.target.value)}
                          placeholder="Enter trip rule (e.g., 'No smoking during trek')..."
                          className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" 
                        />
                        <button type="button" onClick={() => handleRemoveItem('rules', index)} className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                          <Trash size={18} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddItem('rules')} className="w-full py-3 border border-dashed border-dark-600 rounded-xl text-gray-400 hover:text-primary-400 hover:border-primary-500 transition-colors flex items-center justify-center gap-2">
                      <PlusCircle size={18} /> Add Rule
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 p-6 border-t border-dark-700 bg-dark-800">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-dark-600 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingTrip.id ? 'Save Changes' : 'Add Trip'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;
