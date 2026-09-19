'use client';

import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';
import { GalleryImage } from '@/types';
import { cn } from '@/lib/utils';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

type GalleryCategory = 'all' | 'food' | 'place' | 'vibe';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editImage, setEditImage] = useState<GalleryImage | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('food');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await api.get('/gallery');
      setImages(res.data.data?.images || res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const resetForm = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setTitle('');
    setCategory('food');
    setError('');
    setEditImage(null);
  };

  const openUpload = () => {
    resetForm();
    setShowUpload(true);
  };

  const openEdit = (img: GalleryImage) => {
    setEditImage(img);
    setTitle(img.title || '');
    setCategory(img.category || 'food');
    setUploadFile(null);
    setUploadPreview(img.image || null);
    setError('');
    setShowUpload(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!editImage && !uploadFile) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let imageUrl = editImage?.image || '';

      if (uploadFile) {
        const formData = new FormData();
        formData.append('image', uploadFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e: any) => {
            if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
          },
        });
        imageUrl = uploadRes.data.data?.url || uploadRes.data.url || '';
      }

      const payload = {
        title: title.trim(),
        category,
        image: imageUrl,
      };

      if (editImage) {
        await api.put(`/gallery/${editImage._id}`, payload);
      } else {
        await api.post('/gallery', payload);
      }

      setShowUpload(false);
      resetForm();
      fetchImages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/gallery/${deleteId}`);
      setImages((prev) => prev.filter((i) => i._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete image', err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (img: GalleryImage) => {
    try {
      await api.put(`/gallery/${img._id}`, { isActive: !img.isActive });
      setImages((prev) =>
        prev.map((i) => (i._id === img._id ? { ...i, isActive: !i.isActive } : i))
      );
    } catch (err) {
      console.error('Failed to toggle active', err);
    }
  };

  const categoryColors: Record<string, string> = {
    food: 'bg-orange-400/10 text-orange-400',
    place: 'bg-blue-400/10 text-blue-400',
    vibe: 'bg-purple-400/10 text-purple-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream">Gallery</h1>
          <p className="text-brand-cream/50 mt-1">{images.length} photos</p>
        </div>
        <button
          onClick={openUpload}
          className="bg-brand-yellow text-brand-black font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-yellow/90 transition-colors inline-flex items-center gap-2"
        >
          <Plus size={18} />
          Upload
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-yellow" size={32} />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-brand-cream/20 mb-4" />
          <p className="text-brand-cream/50 text-lg">No images yet</p>
          <button
            onClick={openUpload}
            className="mt-4 inline-flex items-center gap-2 text-brand-yellow hover:underline"
          >
            <Upload size={16} /> Upload your first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="bg-brand-surface-light rounded-xl border border-white/10 overflow-hidden group hover:border-white/20 transition-colors"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                {img.image ? (
                  <img
                    src={img.image}
                    alt={img.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-surface flex items-center justify-center">
                    <ImageIcon size={32} className="text-brand-cream/20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(img)}
                    className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(img._id)}
                    className="p-1.5 bg-black/60 rounded-lg text-red-400 hover:bg-red-500/80 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 flex gap-1.5">
                  {img.category && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                        categoryColors[img.category] || 'bg-white/10 text-white/70'
                      )}
                    >
                      {img.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-brand-cream text-sm font-medium truncate">
                    {img.title || 'Untitled'}
                  </p>
                  <button
                    onClick={() => toggleActive(img)}
                    className={cn(
                      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0',
                      img.isActive !== false ? 'bg-green-500' : 'bg-white/20'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                        img.isActive !== false ? 'translate-x-4.5 ml-[3px]' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-brand-cream font-semibold text-lg">
                {editImage ? 'Edit Image' : 'Upload Image'}
              </h3>
              <button
                onClick={() => {
                  setShowUpload(false);
                  resetForm();
                }}
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
                  {!editImage ? 'Image *' : 'Replace Image'}
                </label>
                <div className="flex items-start gap-4">
                  {uploadPreview ? (
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-brand-surface rounded-lg border border-white/10 border-dashed flex items-center justify-center">
                      <Upload size={24} className="text-brand-cream/30" />
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream/70 text-sm hover:border-brand-yellow hover:text-brand-cream transition-colors self-start">
                    <Upload size={16} />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  placeholder="Image title"
                />
              </div>

              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                  className="w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                >
                  <option value="food">Food</option>
                  <option value="place">Place</option>
                  <option value="vibe">Vibe</option>
                </select>
              </div>

              {uploading && uploadProgress > 0 && (
                <div>
                  <div className="flex items-center justify-between text-sm text-brand-cream/60 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-brand-surface rounded-full h-2">
                    <div
                      className="bg-brand-yellow h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpload(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-brand-cream/60 hover:text-brand-cream text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-brand-yellow text-brand-black font-semibold px-5 py-2 rounded-lg hover:bg-brand-yellow/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Uploading...
                    </>
                  ) : editImage ? (
                    'Save Changes'
                  ) : (
                    'Upload'
                  )}
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
              <h3 className="text-brand-cream font-semibold text-lg">Delete Image</h3>
            </div>
            <p className="text-brand-cream/60 mb-6">
              Are you sure you want to delete this image from the gallery?
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
