import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, GripVertical, X } from 'lucide-react';
import { subscribeToTravelServices, updateTravelServices, getTravelServices } from '../../firebase';

const inputClass = "w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-[#F5B301]";

const emptyService = () => ({
  id: `service_${Date.now()}`,
  title: '',
  description: '',
  image: '',
  features: ['', '', '', ''],
  order: 0
});

const TravelServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getTravelServices().then(() => {
      const unsub = subscribeToTravelServices(items => {
        setServices(items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        setLoading(false);
      });
      return () => unsub();
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const ordered = services.map((s, i) => ({ ...s, order: i }));
      await updateTravelServices(ordered);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Error saving: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateService = (i, field, val) => {
    setServices(prev => {
      const arr = [...prev];
      arr[i] = { ...arr[i], [field]: val };
      return arr;
    });
  };

  const updateFeature = (si, fi, val) => {
    setServices(prev => {
      const arr = [...prev];
      const features = [...(arr[si].features || [])];
      features[fi] = val;
      arr[si] = { ...arr[si], features };
      return arr;
    });
  };

  const addFeature = (si) => {
    setServices(prev => {
      const arr = [...prev];
      arr[si] = { ...arr[si], features: [...(arr[si].features || []), ''] };
      return arr;
    });
  };

  const removeFeature = (si, fi) => {
    setServices(prev => {
      const arr = [...prev];
      arr[si] = { ...arr[si], features: arr[si].features.filter((_, idx) => idx !== fi) };
      return arr;
    });
  };

  const removeService = (i) => setServices(prev => prev.filter((_, idx) => idx !== i));
  const addService = () => setServices(prev => [...prev, emptyService()]);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#F5B301] animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Travel Solutions Settings</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage the "Complete Travel Solutions" cards shown on the home page</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button 
            onClick={addService}
            className="flex items-center gap-1.5 border border-[#F5B301] text-[#F5B301] px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#F5B301]/10 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#F5B301] text-[#111111] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#ffc107] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service, si) => (
          <div key={service.id} className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222222] bg-[#161616]">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-500" />
                <span className="text-white font-bold text-xs sm:text-sm">{service.title || `Service ${si + 1}`}</span>
              </div>
              <button onClick={() => removeService(si)} className="text-red-400 hover:text-red-300 p-1" title="Delete Service">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 text-[11px] font-semibold mb-1">Title</label>
                <input 
                  value={service.title} 
                  onChange={e => updateService(si, 'title', e.target.value)}
                  placeholder="Enter service title (e.g. Flight Tickets)" 
                  className={inputClass} 
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] font-semibold mb-1">Image URL</label>
                <input 
                  value={service.image} 
                  onChange={e => updateService(si, 'image', e.target.value)}
                  placeholder="Enter image URL (https://...)" 
                  className={inputClass} 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 text-[11px] font-semibold mb-1">Description</label>
                <textarea 
                  value={service.description} 
                  onChange={e => updateService(si, 'description', e.target.value)}
                  rows={2} 
                  placeholder="Enter short service description..." 
                  className={`${inputClass} resize-none`} 
                />
              </div>

              {service.image && (
                <div className="sm:col-span-2">
                  <img src={service.image} alt={service.title} className="h-28 w-full object-cover rounded-xl bg-gray-800" />
                </div>
              )}

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-400 text-[11px] font-semibold">Features Bullet List</label>
                  <button onClick={() => addFeature(si)} className="text-[#F5B301] text-xs font-bold flex items-center gap-1 hover:underline">
                    <Plus className="w-3 h-3" /> Add Feature
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {(service.features || []).map((f, fi) => (
                    <div key={fi} className="flex gap-1">
                      <input 
                        value={f} 
                        onChange={e => updateFeature(si, fi, e.target.value)}
                        placeholder={`Enter feature ${fi + 1}`}
                        className="flex-1 bg-[#1a1a1a] border border-[#333333] rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#F5B301]" 
                      />
                      <button onClick={() => removeFeature(si, fi)} className="text-red-400 hover:text-red-300 p-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelServices;
