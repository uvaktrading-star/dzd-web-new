import React, { useState, useEffect } from 'react';
import {
  Ticket,
  MessageCircle,
  CheckCircle,
  Clock,
  PlusCircle,
  Mail,
  ArrowUpRight,
  X,
  Send,
  Loader,
  Inbox,
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  priority: string;
  description: string;
  status: string;
  createdAt: string;
  userEmail: string;
  userName: string;
}

// Priority badge color mapping
const priorityColors: Record<string, string> = {
  Low: 'text-slate-500 bg-slate-500/10',
  Medium: 'text-blue-500 bg-blue-500/10',
  High: 'text-orange-500 bg-orange-500/10',
  Urgent: 'text-red-500 bg-red-500/10',
};

export default function TicketsView({ user }: any) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'Medium',
    description: ''
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load tickets from localStorage on mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('supportTickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCreateModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email via API
      const response = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userEmail: user?.email || 'unknown@email.com',
          userName: user?.fullName || user?.displayName || 'User'
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Create new ticket object
        const newTicket: Ticket = {
          id: result.ticketId,
          ...formData,
          status: 'Open',
          createdAt: new Date().toISOString(),
          userEmail: user?.email || 'unknown@email.com',
          userName: user?.fullName || user?.displayName || 'User'
        };

        // Save to localStorage
        const updatedTickets = [newTicket, ...tickets];
        setTickets(updatedTickets);
        localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));

        // Show success message
        setShowSuccessMessage(true);

        // Reset form and close modal
        setFormData({ subject: '', priority: 'Medium', description: '' });
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const stats = {
    total: tickets.length
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header with CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Support Tickets
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Customer Support • {user?.fullName || user?.email || 'User'}
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-sm hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle size={18} /> Create Ticket
        </button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-6 rounded-3xl flex items-center gap-4 animate-slide-down">
          <CheckCircle size={24} />
          <div>
            <p className="font-black text-sm">Ticket Created Successfully!</p>
            <p className="text-xs opacity-80 mt-1">Our team will contact you via email shortly.</p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="ml-auto hover:opacity-70"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Simple Stats Card - Just Total */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-xs">
        <div className="bg-white dark:bg-[#0f172a]/40 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-purple-600 shadow-lg">
              <Inbox size={22} />
            </div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
              Total
            </span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Your Tickets
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.total}
          </h3>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">
              Your Submitted Tickets
            </h3>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl">
              {tickets.length} total
            </span>
          </div>

          <div className="space-y-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 group hover:bg-white dark:hover:bg-blue-600/5 transition-all cursor-default"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm border border-slate-100 dark:border-white/5">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          {ticket.subject}
                        </p>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            priorityColors[ticket.priority]
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                        <span>#{ticket.id}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="max-w-[200px] truncate">{ticket.description.substring(0, 50)}...</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full">
                      {ticket.status}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-slate-300"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
                  <Inbox size={32} />
                </div>
                <p className="text-slate-500 font-black text-sm uppercase tracking-widest">
                  No tickets yet
                </p>
                <p className="text-slate-400 text-[10px] font-bold mt-1">
                  Create your first support ticket
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-6 flex items-center gap-2 mx-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs hover:scale-105 transition-all"
                >
                  <PlusCircle size={14} />
                  Create Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl max-w-md w-full p-8 animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Create New Ticket</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Brief description"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full mt-1 p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                
                {/* User info preview */}
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    From:
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.fullName || user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.email || 'No email provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-white/5 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
