'use client';

import { useEffect, useState, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Category, MenuItem } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2, Upload, X, Star, Plus, Image as ImageIcon } from 'lucide-react';

interface ImageItem {
  id: string;
  file?: File;
  url: string;
  isPrimary: boolean;
}

export default function AdminMenuEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imagesList, setImagesList] = useState<ImageItem[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    servingSize: '',
    isFeatured: false,
    isAvailable: true,
    sortOrder: '0',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, catRes] = await Promise.all([
          api.get(`/menu/${id}`),
          api.get('/categories'),
        ]);
        const item: MenuItem = itemRes.data.data || itemRes.data;
        setCategories(catRes.data.data?.categories || catRes.data.data || []);
        setForm({
          name: item.name || '',
          category:
            typeof item.category === 'object' ? item.category?._id || '' : item.category || '',
          description: item.description || '',
          price: String(item.price || ''),
          servingSize: item.servingSize || '',
          isFeatured: item.isFeatured || false,
          isAvailable: item.isAvailable ?? true,
          sortOrder: String(item.sortOrder || 0),
        });

        // Populate images list
        const initialImages: ImageItem[] = [];
        if (item.images && item.images.length > 0) {
          item.images.forEach((imgUrl, index) => {
            initialImages.push({
              id: `existing-${index}-${Date.now()}`,
              url: imgUrl,
              isPrimary: item.image ? imgUrl === item.image : index === 0,
            });
          });
        } else if (item.image) {
          initialImages.push({
            id: `existing-0-${Date.now()}`,
            url: item.image,
            isPrimary: true,
          });
        }
        setImagesList(initialImages);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ImageItem[] = [];
    Array.from(files).forEach((file, index) => {
      const imgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const url = URL.createObjectURL(file);
      const isPrimary = imagesList.length === 0 && index === 0;
      newItems.push({ id: imgId, file, url, isPrimary });
    });

    setImagesList((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    const imgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const isPrimary = imagesList.length === 0;
    setImagesList((prev) => [...prev, { id: imgId, url: customImageUrl.trim(), isPrimary }]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (imgId: string) => {
    setImagesList((prev) => {
      const filtered = prev.filter((img) => img.id !== imgId);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimary = (imgId: string) => {
    setImagesList((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === imgId,
      }))
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.price) {
      setError('Name and price are required');
      return;
    }

    setSubmitting(true);

    try {
      // Process and upload any new file images
      const uploadedUrls: { url: string; isPrimary: boolean }[] = [];

      for (const img of imagesList) {
        if (img.file) {
          const formData = new FormData();
          formData.append('image', img.file);
          const uploadRes = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const url = uploadRes.data.data?.url || uploadRes.data.url || '';
          uploadedUrls.push({ url, isPrimary: img.isPrimary });
        } else if (img.url) {
          uploadedUrls.push({ url: img.url, isPrimary: img.isPrimary });
        }
      }

      const primaryImg = uploadedUrls.find((img) => img.isPrimary)?.url || uploadedUrls[0]?.url || '';
      const allUrls = uploadedUrls.map((u) => u.url).filter(Boolean);

      await api.patch(`/menu/${id}`, {
        name: form.name.trim(),
        category: form.category || undefined,
        description: form.description.trim(),
        price: Number(form.price),
        servingSize: form.servingSize.trim() || undefined,
        image: primaryImg || undefined,
        images: allUrls,
        isFeatured: form.isFeatured,
        isAvailable: form.isAvailable,
        sortOrder: Number(form.sortOrder),
      });

      router.push('/admin/menu');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update menu item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-yellow" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/menu"
          className="inline-flex items-center gap-2 text-brand-cream/50 hover:text-brand-cream text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Menu
        </Link>
      </div>

      <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-brand-cream mb-6">Edit Menu Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="e.g., Chicken Biryani"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-brand-cream/70 text-sm font-medium mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm focus:outline-none focus:border-brand-yellow transition-colors"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-brand-cream/70 text-sm font-medium mb-2">
                Price (৳) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
                min="0"
                step="0.01"
                className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-cream/70 text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors resize-none"
              placeholder="Describe this menu item..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-brand-cream/70 text-sm font-medium mb-2">Serving Size</label>
              <input
                type="text"
                value={form.servingSize}
                onChange={(e) => setForm((p) => ({ ...p, servingSize: e.target.value }))}
                className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                placeholder="e.g., 500g, 2 servings"
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

          {/* Product Gallery & Multiple Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-brand-cream/90 text-sm font-semibold">
                Product Images / Gallery ({imagesList.length})
              </label>
              <span className="text-xs text-brand-cream/40">
                ⭐ Star marked image is used as primary card thumbnail
              </span>
            </div>

            {/* Images Grid */}
            {imagesList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {imagesList.map((img) => (
                  <div
                    key={img.id}
                    className={cn(
                      'relative group aspect-square rounded-xl overflow-hidden border-2 bg-brand-surface transition-all',
                      img.isPrimary
                        ? 'border-brand-yellow ring-2 ring-brand-yellow/30'
                        : 'border-white/10 hover:border-white/30'
                    )}
                  >
                    <img
                      src={img.url}
                      alt="Product thumbnail"
                      className="w-full h-full object-cover"
                    />

                    {/* Primary Badge / Button */}
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      title={img.isPrimary ? 'Primary Image' : 'Set as Primary Image'}
                      className={cn(
                        'absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all',
                        img.isPrimary
                          ? 'bg-brand-yellow text-black shadow-md'
                          : 'bg-black/70 text-white/70 hover:bg-brand-yellow hover:text-black'
                      )}
                    >
                      <Star size={10} fill={img.isPrimary ? 'currentColor' : 'none'} />
                      <span>{img.isPrimary ? 'Primary' : 'Make Primary'}</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      title="Remove Image"
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors shadow-md opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload & URL Input Options */}
            <div className="bg-brand-surface p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-brand-surface-light border border-white/15 hover:border-brand-yellow rounded-lg px-4 py-2.5 text-brand-cream text-xs sm:text-sm font-semibold hover:text-brand-yellow transition-colors">
                  <Upload size={16} />
                  <span>Upload Image Files (Multi-Select)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleFiles}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-brand-cream/40">Select multiple files at once</span>
              </div>

              {/* Add image via URL */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Or paste image URL (e.g., /images/Steam Momo.png or https://...)"
                  className="flex-1 bg-brand-surface-light border border-white/10 rounded-lg px-3.5 py-2 text-xs text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  disabled={!customImageUrl.trim()}
                  className="px-3 py-2 bg-brand-surface-light hover:bg-brand-yellow hover:text-black border border-white/15 rounded-lg text-xs font-bold text-brand-cream transition-colors disabled:opacity-40 flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add URL</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isAvailable: !p.isAvailable }))}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  form.isAvailable ? 'bg-green-500' : 'bg-white/20'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    form.isAvailable ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
              <label className="text-brand-cream/70 text-sm">Available</label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  form.isFeatured ? 'bg-brand-yellow' : 'bg-white/20'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    form.isFeatured ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
              <div>
                <label className="text-brand-cream/90 text-sm font-medium">Featured (Hero Slider)</label>
                <p className="text-brand-cream/40 text-xs">Showcases this product in the homepage hero carousel slider</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand-yellow text-brand-black font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-yellow/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              Save Changes
            </button>
            <Link
              href="/admin/menu"
              className="px-6 py-2.5 text-brand-cream/60 hover:text-brand-cream text-sm font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
