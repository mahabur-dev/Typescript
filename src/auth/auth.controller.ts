import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../utils/response';
import { IRegisterRequest, ILoginRequest } from './auth.interface';
import { AppError } from '../utils/appError';


export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request<{}, {}, IRegisterRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { user, token } = await this.authService.register(req.body);

      sendSuccess(res, 201, { user, token }, 'Registration successful');
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request<{}, {}, ILoginRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { user, token } = await this.authService.login(req.body);

      sendSuccess(res, 200, { user, token }, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        throw new AppError('User ID not found in request', 404);
      }

      // 🔧 FIX: Convert ObjectId to string
      const user = await this.authService.getProfile(userId.toString());

      sendSuccess(res, 200, { user }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?._id;
      const updates = req.body;

      if (!userId) {
        throw new Error('User ID not found in request');
      }

      // 🔧 FIX: Convert ObjectId to string
      const user = await this.authService.updateProfile(userId.toString(), updates);

      sendSuccess(res, 200, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        throw new AppError('User ID not found in request', 404);
      }

      // 🔧 FIX: Convert ObjectId to string
      await this.authService.deleteAccount(userId.toString());

      sendSuccess(res, 200, null, 'Account deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}