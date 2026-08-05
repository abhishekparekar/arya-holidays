import { useState, useEffect } from 'react';
import { Mail, Phone, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { subscribeToContactQueries, updateQueryStatus } from '../../firebase';

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  read: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsub = subscribeToContactQueries(data => {
      setQueries(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = filter === 'all' ? queries : queries.filter(q => q.status === filter);

  const counts = {
    all: queries.length,
    new: queries.filter(q => q.status === 'new').length,
    read: queries.filter(q => q.status === 'read').length,
    resolved: queries.filter(q => q.status === 'resolved').length,
  };

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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Contact Enquiries</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Messages and trip requests submitted via contact form</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap text-xs font-bold">
        {['all', 'new', 'read', 'resolved'].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full capitalize transition-colors ${
              filter === s 
                ? 'bg-[#F5B301] text-[#111111]' 
                : 'bg-[#111111] text-gray-300 hover:text-white border border-[#222222]'
            }`}
          >
            {s} <span className="opacity-75 ml-0.5">({counts[s]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#111111] rounded-2xl p-10 text-center border border-[#222222]">
          <Mail className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-xs sm:text-sm">No contact queries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => (
            <div key={q.id} className="bg-[#111111] rounded-2xl border border-[#222222] p-4 text-xs">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-white font-bold text-sm">{q.name || 'Guest User'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusColors[q.status] || statusColors.new}`}>
                      {q.status || 'New'}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      {q.createdAt ? new Date(q.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-2 text-gray-400">
                    <a href={`mailto:${q.email}`} className="flex items-center gap-1 hover:text-[#F5B301]">
                      <Mail className="w-3.5 h-3.5 text-[#F5B301]" />
                      <span>{q.email}</span>
                    </a>
                    {q.phone && (
                      <a href={`tel:${q.phone}`} className="flex items-center gap-1 hover:text-[#F5B301]">
                        <Phone className="w-3.5 h-3.5 text-[#F5B301]" />
                        <span>{q.phone}</span>
                      </a>
                    )}
                  </div>

                  {q.subject && <p className="text-[#F5B301] font-bold mb-1">{q.subject}</p>}
                  <p className="text-gray-200 leading-relaxed bg-[#1a1a1a] p-3 rounded-xl border border-[#333333] mt-2">
                    {q.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                  {q.status !== 'read' && (
                    <button 
                      onClick={() => updateQueryStatus(q.id, 'read')}
                      className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors"
                    >
                      <Circle className="w-3 h-3" /> Mark Read
                    </button>
                  )}
                  {q.status !== 'resolved' && (
                    <button 
                      onClick={() => updateQueryStatus(q.id, 'resolved')}
                      className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Queries;
