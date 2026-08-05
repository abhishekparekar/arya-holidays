import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, GripVertical, X } from 'lucide-react';
import { subscribeToTravelServices, updateTravelServices, getTravelServices } from '../../firebase';

const inputClass = "w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500";

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
    // Seed defaults if empty, then subscribe
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
    <div className="p-8 flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Travel Solutions</h1>
          <p className="text-gray-400 text-sm mt-1">Manage the "Complete Travel Solutions" cards shown on the website</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addService}
            className="flex items-center gap-2 border border-primary-500 text-primary-400 px-4 py-2.5 rounded-xl text-sm hover:bg-primary-500/10 transition-colors">
            <Plus className="w-4 h-4" /> Add Service
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {services.map((service, si) => (
          <div key={service.id} className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-dark-700/30">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-500" />
                <span className="text-white font-medium">{service.title || `Service ${si + 1}`}</span>
              </div>
              <button onClick={() => removeService(si)} className="text-red-400 hover:text-red-300 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Title</label>
                <input value={service.title} onChange={e => updateService(si, 'title', e.target.value)}
                  placeholder="e.g. Flight Tickets" className={inputClass} />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Image URL</label>
                <input value={service.image} onChange={e => updateService(si, 'image', e.target.value)}
                  placeholder="https://images.unsplash.com/..." className={inputClass} />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs mb-1.5">Description</label>
                <textarea value={service.description} onChange={e => updateService(si, 'description', e.target.value)}
                  rows={2} placeholder="Short description..." className={`${inputClass} resize-none`} />
              </div>

              {/* Image Preview */}
              {service.image && (
                <div className="md:col-span-2">
                  <img src={service.image} alt={service.title} className="h-32 w-full object-cover rounded-xl" />
                </div>
              )}

              {/* Features */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 text-xs">Features</label>
                  <button onClick={() => addFeature(si)} className="text-primary-400 text-xs flex items-center gap-1 hover:text-primary-300">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(service.features || []).map((f, fi) => (
                    <div key={fi} className="flex gap-1">
                      <input value={f} onChange={e => updateFeature(si, fi, e.target.value)}
                        placeholder={`Feature ${fi + 1}`}
                        className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-primary-500" />
                      <button onClick={() => removeFeature(si, fi)} className="text-red-400 hover:text-red-300 px-1">
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
