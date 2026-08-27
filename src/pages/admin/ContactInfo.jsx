import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { getContactInfo, updateContactInfo } from '../../firebase';

const defaultData = {
  branches: [
    { label: 'Pune', address: 'Shop No. 109, ARV Royale, Handewadi Road, Hadapsar, Pune - 411028 - Maharashtra' },
    { label: 'Chh. Sambhajinagar', address: 'Shop No. 24, Bhagrathi Heights, Chate School Road, Satara Parisar, Chh. Sambhajinagar 431010 - Maharashtra' }
  ],
  phones: ['+91 7972475007', '+91 9673982555'],
  emails: ['info@aryaholidays.com'],
  workingHours: 'Mon - Sat: 9AM - 8PM | Sunday: 10AM - 6PM',
  facebook: '#', instagram: 'https://www.instagram.com/arya_holidays_?igsh=MTJkOTlzZjhsM2p2eA==', twitter: '#', youtube: '#'
};

const inputClass = "w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-[#F5B301]";

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
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#F5B301] animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Contact Info Settings</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage addresses, phone numbers & social links shown across website</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-[#F5B301] text-[#111111] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#ffc107] transition-colors disabled:opacity-60 self-start sm:self-auto cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved Successfully!' : 'Save Contact Info'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Branch Addresses */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm">Branch Addresses</h2>
            <button 
              onClick={() => setData(d => ({ ...d, branches: [...d.branches, { label: '', address: '' }] }))}
              className="flex items-center gap-1 text-[#F5B301] text-xs font-bold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Branch
            </button>
          </div>
          <div className="space-y-3">
            {data.branches.map((b, i) => (
              <div key={i} className="p-3 bg-[#1a1a1a] rounded-xl border border-[#333333] space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    value={b.label} 
                    onChange={e => updateBranch(i, 'label', e.target.value)}
                    placeholder="Enter branch name (e.g. Pune)" 
                    className={`${inputClass} w-36 sm:w-48`} 
                  />
                  <button 
                    onClick={() => setData(d => ({ ...d, branches: d.branches.filter((_, idx) => idx !== i) }))}
                    className="text-red-400 hover:text-red-300 p-2 ml-auto"
                    title="Remove Branch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea 
                  value={b.address} 
                  onChange={e => updateBranch(i, 'address', e.target.value)}
                  rows={2} 
                  placeholder="Enter full office address" 
                  className={`${inputClass} resize-none`} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Phones */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm">Phone Numbers</h2>
            <button onClick={() => addListItem('phones')} className="flex items-center gap-1 text-[#F5B301] text-xs font-bold hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add Phone
            </button>
          </div>
          <div className="space-y-2">
            {data.phones.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  value={p} 
                  onChange={e => updateListItem('phones', i, e.target.value)}
                  placeholder="Enter mobile number (+91 XXXXXXXXXX)" 
                  className={inputClass} 
                />
                <button onClick={() => removeListItem('phones', i)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emails */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm">Email Addresses</h2>
            <button onClick={() => addListItem('emails')} className="flex items-center gap-1 text-[#F5B301] text-xs font-bold hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add Email
            </button>
          </div>
          <div className="space-y-2">
            {data.emails.map((e, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  value={e} 
                  onChange={ev => updateListItem('emails', i, ev.target.value)}
                  placeholder="Enter email address (info@aryaholidays.com)" 
                  className={inputClass} 
                />
                <button onClick={() => removeListItem('emails', i)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222]">
          <h2 className="text-white font-bold text-sm mb-3">Working Hours</h2>
          <input 
            value={data.workingHours} 
            onChange={e => setData(d => ({ ...d, workingHours: e.target.value }))}
            placeholder="Enter working hours (e.g. Mon - Sat: 9AM - 8PM | Sunday: 10AM - 6PM)" 
            className={inputClass} 
          />
        </div>

        {/* Social Links */}
        <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 border border-[#222222]">
          <h2 className="text-white font-bold text-sm mb-3">Social Media Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['facebook', 'instagram', 'twitter', 'youtube'].map(key => (
              <div key={key}>
                <label className="block text-gray-400 text-[11px] font-semibold mb-1 capitalize">{key} Profile URL</label>
                <input 
                  value={data[key] || ''} 
                  onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
                  placeholder={`https://${key}.com/...`} 
                  className={inputClass} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
