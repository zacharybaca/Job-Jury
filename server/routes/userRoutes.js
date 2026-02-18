import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  toggleSaveCompany
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes should be protected
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/save/:companyId', protect, toggleSaveCompany);

export default router;
