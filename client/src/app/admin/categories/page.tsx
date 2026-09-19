'use client';

import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  FolderOpen,
} from 'lucide-react';

interface CategoryForm {
  name: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
}

const defaultForm: CategoryForm = {
  name: '',
  description: '',
  sortOrder: '0',
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data?.categories || res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      sortOrder: String(cat.sortOrder || 0),
      isActive: cat.isActive ?? true,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };

      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteId}`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete category', err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await api.put(`/categories/${cat._id}`, {
        isActive: !cat.isActive,
      });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err) {
      console.error('Failed to toggle active', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream">Categories</h1>
          <p className="text-brand-cream/50 mt-1">{categories.length} total categories</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-brand-yellow text-brand-black font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-yellow/90 transition-colors inline-flex items-center gap-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-yellow" size={32} />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-12 text-center">
          <FolderOpen size={48} className="mx-auto text-brand-cream/20 mb-4" />
          <p className="text-brand-cream/50 text-lg">No categories yet</p>
          <button
            onClick={openAdd}
            className="mt-4 inline-flex items-center gap-2 text-brand-yellow hover:underline"
          >
            <Plus size={16} /> Add your first category
          </button>
        </div>
      ) : (
        <div className="bg-brand-surface-light rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Name</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden sm:table-cell">Slug</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden md:table-cell">Sort</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Active</th>
                  <th className="text-right text-brand-cream/50 text-sm font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-white/5 last:border-0 hover:bg-brand-surface-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-brand-cream text-sm font-medium">{cat.name}</p>
                        {cat.description && (
                          <p className="text-brand-cream/40 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brand-cream/50 text-sm hidden sm:table-cell">
                      {cat.slug}
                    </td>
                    <td className="px-5 py-3 text-brand-cream/50 text-sm hidden md:table-cell">
                      {cat.sortOrder || 0}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(cat)}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          cat.isActive ? 'bg-green-500' : 'bg-white/20'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            cat.isActive ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 text-brand-cream/50 hover:text-brand-yellow hover:bg-brand-surface-hover rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat._id)}
                          className="p-2 text-brand-cream/50 hover:text-red-400 hover:bg-brand-surface-hover rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-brand-cream font-semibold text-lg">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
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
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                  placeholder="Optional description"
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
                  onClick={() => setShowModal(false)}
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
                  {editingId ? 'Save Changes' : 'Create'}
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
              <h3 className="text-brand-cream font-semibold text-lg">Delete Category</h3>
            </div>
            <p className="text-brand-cream/60 mb-6">
              Are you sure? This may affect menu items in this category.
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
