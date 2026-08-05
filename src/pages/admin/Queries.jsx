import { useState, useEffect } from 'react';
import { Mail, Phone, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { subscribeToContactQueries, updateQueryStatus } from '../../firebase';

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
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
    <div className="p-8 flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Contact Queries</h1>
        <p className="text-gray-400 text-sm mt-1">Messages submitted via the contact form</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'new', 'read', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              filter === s ? 'bg-primary-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
            }`}>
            {s} <span className="ml-1 opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-dark-800 rounded-2xl p-12 text-center border border-dark-700">
          <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No queries found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(q => (
            <div key={q.id} className="bg-dark-800 rounded-2xl border border-dark-700 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-white font-semibold">{q.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColors[q.status] || statusColors.new}`}>
                      {q.status}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {q.createdAt ? new Date(q.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{q.email}</span>
                    {q.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{q.phone}</span>}
                  </div>
                  {q.subject && <p className="text-[#F5B301] text-sm font-medium mb-1">{q.subject}</p>}
                  <p className="text-gray-300 text-sm leading-relaxed">{q.message}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {q.status !== 'read' && (
                    <button onClick={() => updateQueryStatus(q.id, 'read')}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors">
                      <Circle className="w-3 h-3" /> Mark Read
                    </button>
                  )}
                  {q.status !== 'resolved' && (
                    <button onClick={() => updateQueryStatus(q.id, 'resolved')}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                      <CheckCircle className="w-3 h-3" /> Resolve
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
