'use client';

import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';
import { Offer } from '@/types';
import { cn } from '@/lib/utils';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Tag,
  Calendar,
  Upload,
} from 'lucide-react';

interface OfferForm {
  title: string;
  description: string;
  discount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  sortOrder: string;
}

const defaultForm: OfferForm = {
  title: '',
  description: '',
  discount: '',
  startDate: '',
  endDate: '',
  isActive: true,
  sortOrder: '0',
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OfferForm>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOffers = async () => {
    try {
      const res = await api.get('/offers');
      setOffers(res.data.data?.offers || res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch offers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (offer: Offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      discount: offer.discount || '',
      startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
      endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
      isActive: offer.isActive ?? true,
      sortOrder: String(offer.sortOrder || 0),
    });
    setImageFile(null);
    setImagePreview(offer.image || null);
    setError('');
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = imagePreview || '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.data?.url || uploadRes.data.url || '';
      }

      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        discount: form.discount.trim(),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder),
      };

      if (imageUrl) payload.image = imageUrl;

      if (editingId) {
        await api.put(`/offers/${editingId}`, payload);
      } else {
        await api.post('/offers', payload);
      }

      setShowForm(false);
      fetchOffers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save offer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/offers/${deleteId}`);
      setOffers((prev) => prev.filter((o) => o._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete offer', err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (offer: Offer) => {
    try {
      await api.put(`/offers/${offer._id}`, { isActive: !offer.isActive });
      setOffers((prev) =>
        prev.map((o) => (o._id === offer._id ? { ...o, isActive: !o.isActive } : o))
      );
    } catch (err) {
      console.error('Failed to toggle offer', err);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream">Offers</h1>
          <p className="text-brand-cream/50 mt-1">{offers.length} total offers</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-brand-yellow text-brand-black font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-yellow/90 transition-colors inline-flex items-center gap-2"
        >
          <Plus size={18} />
          Create Offer
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-yellow" size={32} />
        </div>
      ) : offers.length === 0 && !showForm ? (
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-12 text-center">
          <Tag size={48} className="mx-auto text-brand-cream/20 mb-4" />
          <p className="text-brand-cream/50 text-lg">No offers yet</p>
          <button
            onClick={openAdd}
            className="mt-4 inline-flex items-center gap-2 text-brand-yellow hover:underline"
          >
            <Plus size={16} /> Create your first offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-brand-surface-light rounded-xl border border-white/10 p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-brand-cream font-semibold truncate">{offer.title}</h3>
                    <button
                      onClick={() => toggleActive(offer)}
                      className={cn(
                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0',
                        offer.isActive ? 'bg-green-500' : 'bg-white/20'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                          offer.isActive ? 'translate-x-4.5 ml-[3px]' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                  {offer.description && (
                    <p className="text-brand-cream/50 text-sm line-clamp-2 mb-2">
                      {offer.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {offer.discount && (
                      <span className="inline-flex items-center gap-1 bg-brand-yellow/10 text-brand-yellow px-2.5 py-0.5 rounded-full text-xs font-medium">
                        <Tag size={12} />
                        {offer.discount}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-brand-cream/40 text-xs">
                      <Calendar size={12} />
                      {formatDate(offer.startDate)} — {formatDate(offer.endDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(offer)}
                    className="p-2 text-brand-cream/50 hover:text-brand-yellow hover:bg-brand-surface-hover rounded-lg transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(offer._id)}
                    className="p-2 text-brand-cream/50 hover:text-red-400 hover:bg-brand-surface-hover rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 max-w-lg w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-brand-cream font-semibold text-lg">
                {editingId ? 'Edit Offer' : 'Create Offer'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-brand-cream/50 hover:text-brand-cream"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  placeholder="e.g., 20% off Biryani"
                />
              </div>

              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                  placeholder="Describe this offer..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-cream/70 text-sm font-medium mb-2">Discount</label>
                  <input
                    type="text"
                    value={form.discount}
                    onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
                    className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                    placeholder="e.g., 20%"
                  />
                </div>
                <div>
                  <label className="block text-brand-cream/70 text-sm font-medium mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                    className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-cream/70 text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-brand-cream/70 text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-2">Image</label>
                <div className="flex items-start gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-brand-surface rounded-lg border border-white/10 border-dashed flex items-center justify-center">
                      <Upload size={20} className="text-brand-cream/30" />
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-brand-surface border border-white/10 rounded-lg px-4 py-2 text-brand-cream/70 text-sm hover:border-brand-yellow hover:text-brand-cream transition-colors self-start">
                    <Upload size={14} />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    form.isActive ? 'bg-green-500' : 'bg-white/20'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      form.isActive ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
                <label className="text-brand-cream/70 text-sm">Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-brand-cream/60 hover:text-brand-cream text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-yellow text-brand-black font-semibold px-5 py-2 rounded-lg hover:bg-brand-yellow/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  {editingId ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="text-brand-cream font-semibold text-lg">Delete Offer</h3>
            </div>
            <p className="text-brand-cream/60 mb-6">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-brand-cream/60 hover:text-brand-cream text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 className="animate-spin" size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
