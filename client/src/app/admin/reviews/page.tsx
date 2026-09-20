'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  RefreshCw,
  Utensils,
  Phone,
  MessageSquare,
} from 'lucide-react';
import api from '@/lib/api';
import { Review } from '@/types';
import { cn } from '@/lib/utils';
import AdminTableSkeleton from '@/components/skeletons/AdminTableSkeleton';
import StarRating from '@/components/common/StarRating';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [approvedFilter, setApprovedFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (search.trim()) params.set('search', search.trim());
      if (ratingFilter !== 'all') params.set('rating', ratingFilter);
      if (approvedFilter !== 'all') params.set('approved', approvedFilter);

      const res = await api.get(`/reviews/admin?${params.toString()}`);
      const data = res.data.data;
      if (data) {
        setReviews(data.reviews || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, ratingFilter, approvedFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  const handleToggleApproved = async (rev: Review) => {
    try {
      await api.patch(`/reviews/${rev._id}`, { isApproved: !rev.isApproved });
      setReviews((prev) =>
        prev.map((r) => (r._id === rev._id ? { ...r, isApproved: !r.isApproved } : r))
      );
    } catch {
      alert('Failed to update review approval');
    }
  };

  const handleToggleFeatured = async (rev: Review) => {
    try {
      await api.patch(`/reviews/${rev._id}`, { isFeatured: !rev.isFeatured });
      setReviews((prev) =>
        prev.map((r) => (r._id === rev._id ? { ...r, isFeatured: !r.isFeatured } : r))
      );
    } catch {
      alert('Failed to update featured status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/reviews/${deleteId}`);
      setReviews((prev) => prev.filter((r) => r._id !== deleteId));
      setDeleteId(null);
    } catch {
      alert('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  const handleClearAllReviews = async () => {
    setClearingAll(true);
    try {
      await api.delete('/reviews/admin/clear-all');
      setReviews([]);
      setTotalCount(0);
      setClearAllOpen(false);
    } catch {
      alert('Failed to clear reviews');
    } finally {
      setClearingAll(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-cream tracking-tight">Customer Reviews</h1>
          <p className="text-sm text-brand-cream/60 mt-1">
            Manage, feature, and moderate authentic ratings from beach foodies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {reviews.length > 0 && (
            <button
              onClick={() => setClearAllOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>Clear All Reviews</span>
            </button>
          )}

          <button
            onClick={fetchReviews}
            className="btn-secondary !h-10 px-4 text-xs gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-bb p-5 bg-brand-surface-light border-brand-border">
          <p className="text-xs text-brand-cream/50 uppercase font-semibold">Total Reviews</p>
          <p className="text-2xl font-extrabold text-brand-cream mt-1">{totalCount}</p>
        </div>
        <div className="card-bb p-5 bg-brand-surface-light border-brand-border">
          <p className="text-xs text-brand-cream/50 uppercase font-semibold">Average Rating</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-extrabold text-brand-yellow">{avgRating}</span>
            <Star size={18} className="text-brand-yellow fill-brand-yellow" />
          </div>
        </div>
        <div className="card-bb p-5 bg-brand-surface-light border-brand-border">
          <p className="text-xs text-brand-cream/50 uppercase font-semibold">Approved</p>
          <p className="text-2xl font-extrabold text-green-400 mt-1">
            {reviews.filter((r) => r.isApproved).length}
          </p>
        </div>
        <div className="card-bb p-5 bg-brand-surface-light border-brand-border">
          <p className="text-xs text-brand-cream/50 uppercase font-semibold">Featured on Home</p>
          <p className="text-2xl font-extrabold text-brand-yellow mt-1">
            {reviews.filter((r) => r.isFeatured).length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-bb p-4 bg-brand-surface-light border-brand-border flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-cream/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, comment, dish..."
              className="w-full bg-brand-surface border border-brand-border rounded-lg pl-9 pr-3 py-2 text-brand-cream text-xs placeholder-brand-cream/40 focus:outline-none focus:border-brand-yellow"
            />
          </div>
          <button type="submit" className="btn-primary !h-9 px-4 text-xs">
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-brand-cream text-xs focus:outline-none focus:border-brand-yellow"
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★</option>
            <option value="3">3 Stars ★★★</option>
            <option value="2">2 Stars ★★</option>
            <option value="1">1 Star ★</option>
          </select>

          {/* Approved Filter */}
          <select
            value={approvedFilter}
            onChange={(e) => {
              setApprovedFilter(e.target.value);
              setPage(1);
            }}
            className="bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-brand-cream text-xs focus:outline-none focus:border-brand-yellow"
          >
            <option value="all">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / Cards */}
      {loading ? (
        <AdminTableSkeleton rows={5} />
      ) : reviews.length === 0 ? (
        <div className="card-bb p-12 text-center bg-brand-surface-light border-dashed border-brand-border">
          <MessageSquare className="w-12 h-12 text-brand-cream/20 mx-auto mb-3" />
          <p className="text-base font-bold text-brand-cream">No reviews found</p>
          <p className="text-xs text-brand-cream/50 mt-1">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="card-bb p-5 bg-brand-surface-light border-brand-border flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-brand-yellow text-brand-black font-extrabold text-sm flex items-center justify-center uppercase shadow-sm">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-cream leading-tight">
                        {rev.customerName}
                      </h4>
                      {rev.customerPhone && (
                        <p className="text-[11px] text-brand-cream/50 flex items-center gap-1 mt-0.5">
                          <Phone size={10} />
                          <span>{rev.customerPhone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-brand-surface px-2.5 py-1 rounded-md border border-brand-border">
                    <StarRating rating={rev.rating} size={13} />
                    <span className="text-xs font-bold text-brand-yellow">{rev.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed bg-brand-surface/60 p-3 rounded-lg border border-white/5">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Extra info pills */}
                <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                  {rev.dishRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                      <Utensils size={10} />
                      <span>Loved: {rev.dishRecommended}</span>
                    </span>
                  )}
                  {rev.orderNumber && (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-brand-cream/60 border border-white/10">
                      Order: #{rev.orderNumber}
                    </span>
                  )}
                  <span className="text-brand-cream/40 self-center ml-auto">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Toggle Approval */}
                  <button
                    onClick={() => handleToggleApproved(rev)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border',
                      rev.isApproved
                        ? 'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25'
                        : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/25'
                    )}
                  >
                    {rev.isApproved ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Approved</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={12} />
                        <span>Unapproved</span>
                      </>
                    )}
                  </button>

                  {/* Toggle Featured */}
                  <button
                    onClick={() => handleToggleFeatured(rev)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border',
                      rev.isFeatured
                        ? 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/40 hover:bg-brand-yellow/30'
                        : 'bg-brand-surface text-brand-cream/50 border-brand-border hover:text-brand-cream'
                    )}
                  >
                    <Sparkles size={12} />
                    <span>{rev.isFeatured ? 'Featured on Home' : 'Feature'}</span>
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => setDeleteId(rev._id)}
                  className="p-1.5 text-brand-cream/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete review"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-secondary !h-9 px-3 text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-brand-cream/60 self-center px-2">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn-secondary !h-9 px-3 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="card-bb p-6 max-w-sm w-full bg-brand-surface-light border-brand-border space-y-4">
            <h3 className="text-base font-bold text-brand-cream">Delete this review?</h3>
            <p className="text-xs text-brand-cream/60 leading-relaxed">
              Are you sure you want to delete this customer review permanently?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-secondary !h-9 px-4 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded-lg text-xs !h-9 flex items-center gap-1.5"
              >
                {deleting && <Loader2 size={12} className="animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Clear All Confirmation Modal */}
      {clearAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-bb p-6 max-w-sm w-full bg-brand-surface border-brand-border space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-brand-cream">Clear All Reviews?</h3>
              <p className="text-xs text-brand-cream/60 mt-1">
                Are you sure you want to delete all customer reviews from the database? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClearAllOpen(false)}
                disabled={clearingAll}
                className="flex-1 btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllReviews}
                disabled={clearingAll}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {clearingAll ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <span>Yes, Clear All</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
