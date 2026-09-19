import { Request, Response } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/apiResponse';

// Public: Verify if an order exists so a customer can review it
export const verifyOrderForReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.params;
    if (!query || !query.trim()) {
      sendError(res, 'Please provide an Order Number or Phone Number', 400);
      return;
    }

    const trimmed = query.trim();
    // Case-insensitive order search or phone search
    const order = await Order.findOne({
      $or: [
        { orderNumber: { $regex: `^${trimmed}$`, $options: 'i' } },
        { 'customer.phone': trimmed },
      ],
    }).sort({ createdAt: -1 });

    if (!order) {
      sendError(
        res,
        'No order found with this Order Number or Phone. Only verified customers who ordered from Brother\'s Bites can leave a review.',
        404
      );
      return;
    }

    sendSuccess(
      res,
      {
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        items: order.items.map((it) => it.name),
        status: order.status,
      },
      200,
      'Order verified successfully'
    );
  } catch (error: any) {
    sendError(res, error.message || 'Verification failed', 500);
  }
};

// Public: Get approved reviews with aggregated rating stats
export const getPublicReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = '12', featured } = req.query;
    const filter: any = { isApproved: true };

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const limitNum = Math.min(parseInt(limit as string, 10) || 12, 50);

    const [reviews, stats] = await Promise.all([
      Review.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(limitNum)
        .populate('menuItem', 'name image price'),
      Review.aggregate([
        { $match: { isApproved: true } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
            fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
            threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
            twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
            oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const ratingSummary = stats[0] || {
      averageRating: 5.0,
      totalReviews: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
    };

    sendSuccess(
      res,
      {
        reviews,
        stats: {
          average: Number((ratingSummary.averageRating || 5).toFixed(1)),
          total: ratingSummary.totalReviews,
          breakdown: {
            5: ratingSummary.fiveStars,
            4: ratingSummary.fourStars,
            3: ratingSummary.threeStars,
            2: ratingSummary.twoStars,
            1: ratingSummary.oneStar,
          },
        },
      },
      200,
      'Reviews retrieved successfully'
    );
  } catch (error: any) {
    sendError(res, error.message || 'Server error', 500);
  }
};

// Public: Submit a new review (Verified Order Required)
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, customerPhone, rating, comment, dishRecommended, menuItem, orderNumber } = req.body;

    // Check Order verification
    if (!orderNumber && !customerPhone) {
      sendError(
        res,
        'Only customers who have ordered from Brother\'s Bites can leave a review. Please provide your Order Number or Phone Number.',
        400
      );
      return;
    }

    let matchedOrder = null;
    if (orderNumber && orderNumber.trim()) {
      matchedOrder = await Order.findOne({
        orderNumber: { $regex: `^${orderNumber.trim()}$`, $options: 'i' },
      });
    }

    if (!matchedOrder && customerPhone && customerPhone.trim()) {
      matchedOrder = await Order.findOne({
        'customer.phone': customerPhone.trim(),
      }).sort({ createdAt: -1 });
    }

    if (!matchedOrder) {
      sendError(
        res,
        'No matching order was found in our system. Only customers who have placed an order can submit a review.',
        403
      );
      return;
    }

    const nameToUse = (customerName && customerName.trim()) || matchedOrder.customer.name;
    if (!nameToUse) {
      sendError(res, 'Please provide your name', 400);
      return;
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 0.5 || numericRating > 5) {
      sendError(res, 'Please provide a valid rating between 0.5 and 5 stars', 400);
      return;
    }

    if (!comment || !comment.trim()) {
      sendError(res, 'Please write a short review comment', 400);
      return;
    }

    const review = await Review.create({
      customerName: nameToUse,
      customerPhone: customerPhone ? customerPhone.trim() : matchedOrder.customer.phone,
      rating: numericRating,
      comment: comment.trim(),
      dishRecommended: dishRecommended
        ? dishRecommended.trim()
        : matchedOrder.items?.[0]?.name || undefined,
      menuItem: menuItem || undefined,
      orderNumber: matchedOrder.orderNumber,
      isApproved: true, // Verified customer order auto-approved
      isFeatured: numericRating >= 4,
    });

    sendSuccess(res, review, 201, 'Thank you! Your verified order review has been submitted.');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to submit review', 400);
  }
};

// Admin: Get all reviews with filters & pagination
export const getAllReviewsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', search, rating, approved } = req.query;

    const filter: any = {};
    if (approved !== undefined && approved !== 'all') {
      filter.isApproved = approved === 'true';
    }
    if (rating && rating !== 'all') {
      filter.rating = Number(rating);
    }
    if (search) {
      filter.$or = [
        { customerName: { $regex: search as string, $options: 'i' } },
        { comment: { $regex: search as string, $options: 'i' } },
        { dishRecommended: { $regex: search as string, $options: 'i' } },
        { orderNumber: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('menuItem', 'name image price'),
      Review.countDocuments(filter),
    ]);

    sendSuccess(res, {
      reviews,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    sendError(res, error.message || 'Server error', 500);
  }
};

// Admin: Update review approval or featured status
export const updateReviewAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isApproved, isFeatured, comment, rating, dishRecommended } = req.body;

    const updateData: any = {};
    if (isApproved !== undefined) updateData.isApproved = Boolean(isApproved);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (comment) updateData.comment = comment.trim();
    if (rating) updateData.rating = Number(rating);
    if (dishRecommended !== undefined) updateData.dishRecommended = dishRecommended;

    const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
    if (!review) {
      sendError(res, 'Review not found', 404);
      return;
    }

    sendSuccess(res, review, 200, 'Review updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update review', 400);
  }
};

// Admin: Delete review
export const deleteReviewAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      sendError(res, 'Review not found', 404);
      return;
    }

    sendSuccess(res, null, 200, 'Review deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete review', 500);
  }
};

// Admin: Clear all reviews
export const clearAllReviews = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Review.deleteMany({});
    sendSuccess(res, null, 200, 'All reviews cleared successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to clear reviews', 500);
  }
};
