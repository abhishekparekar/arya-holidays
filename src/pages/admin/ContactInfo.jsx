import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { getContactInfo, updateContactInfo } from '../../firebase';

const defaultData = {
  branches: [
    { label: 'Pune', address: 'Shop No. 109, ARV Royale, Handewadi Road, Hadapsar, Pune - 411028 - Maharashtra' },
    { label: 'Chh. Sambhajinagar', address: 'Shop No. 24, Bhagrathi Heights, Chate School Road, Satara Parisar, Chh. Sambhajinagar 431010 - Maharashtra' }
  ],
  phones: ['+91 9673982555', '+91 9637476999'],
  emails: ['info@aryaholidays.com', 'santosh@aryaholidays.com'],
  workingHours: 'Mon - Sat: 9AM - 8PM | Sunday: 10AM - 6PM',
  facebook: '#', instagram: '#', twitter: '#', youtube: '#'
};

const inputClass = "w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500";

const ContactInfo = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getContactInfo().then(info => {
      if (info) setData({ ...defaultData, ...info });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContactInfo(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Error saving: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateBranch = (i, field, val) => {
    const branches = [...data.branches];
    branches[i] = { ...branches[i], [field]: val };
    setData(d => ({ ...d, branches }));
  };

  const updateListItem = (key, i, val) => {
    const arr = [...data[key]];
    arr[i] = val;
    setData(d => ({ ...d, [key]: arr }));
  };

  const addListItem = (key) => setData(d => ({ ...d, [key]: [...d[key], ''] }));
  const removeListItem = (key, i) => setData(d => ({ ...d, [key]: d[key].filter((_, idx) => idx !== i) }));

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Info</h1>
          <p className="text-gray-400 text-sm mt-1">Manage address, phones, emails shown on the website</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Branches */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Branch Addresses</h2>
            <button onClick={() => setData(d => ({ ...d, branches: [...d.branches, { label: '', address: '' }] }))}
              className="flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300">
              <Plus className="w-4 h-4" /> Add Branch
            </button>
          </div>
          <div className="space-y-4">
            {data.branches.map((b, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-2">
                  <input value={b.label} onChange={e => updateBranch(i, 'label', e.target.value)}
                    placeholder="Branch name (e.g. Pune)" className={`${inputClass} w-40`} />
                  <button onClick={() => setData(d => ({ ...d, branches: d.branches.filter((_, idx) => idx !== i) }))}
                    className="text-red-400 hover:text-red-300 px-2"><Trash2 className="w-4 h-4" /></button>
                </div>
                <textarea value={b.address} onChange={e => updateBranch(i, 'address', e.target.value)}
                  rows={2} placeholder="Full address" className={`${inputClass} resize-none`} />
              </div>
            ))}
          </div>
        </div>

        {/* Phones */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Phone Numbers</h2>
            <button onClick={() => addListItem('phones')} className="flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {data.phones.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input value={p} onChange={e => updateListItem('phones', i, e.target.value)}
                  placeholder="+91 XXXXXXXXXX" className={inputClass} />
                <button onClick={() => removeListItem('phones', i)} className="text-red-400 hover:text-red-300 px-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emails */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Email Addresses</h2>
            <button onClick={() => addListItem('emails')} className="flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {data.emails.map((e, i) => (
              <div key={i} className="flex gap-2">
                <input value={e} onChange={ev => updateListItem('emails', i, ev.target.value)}
                  placeholder="email@example.com" className={inputClass} />
                <button onClick={() => removeListItem('emails', i)} className="text-red-400 hover:text-red-300 px-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <h2 className="text-white font-semibold mb-4">Working Hours</h2>
          <input value={data.workingHours} onChange={e => setData(d => ({ ...d, workingHours: e.target.value }))}
            placeholder="Mon - Sat: 9AM - 8PM | Sunday: 10AM - 6PM" className={inputClass} />
        </div>

        {/* Social Links */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <h2 className="text-white font-semibold mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['facebook', 'instagram', 'twitter', 'youtube'].map(key => (
              <div key={key}>
                <label className="block text-gray-400 text-xs mb-1 capitalize">{key}</label>
                <input value={data[key] || ''} onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
                  placeholder={`https://${key}.com/...`} className={inputClass} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
