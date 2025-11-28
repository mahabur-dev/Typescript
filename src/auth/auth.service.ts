import { User } from './auth.model';
import { 
  IAuthResponse, 
  IRegisterRequest, 
  ILoginRequest,
  IUserDocument 
} from './auth.interface';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/appError';


export class AuthService {
  
  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const { email, password, name } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);

    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    // Generate JWT token
    const token = generateToken(user._id.toString());

    return { user, token };
  }

  async login(data: ILoginRequest): Promise<IAuthResponse> {
    const { email, password } = data;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    // Validate user and password
    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Remove password from response
    user.password = undefined as any;

    return { user, token };
  }

  async getProfile(userId: string): Promise<IUserDocument> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(
    userId: string, 
    updates: Partial<Pick<IUserDocument, 'name' | 'email'>>
  ): Promise<IUserDocument> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async deleteAccount(userId: string): Promise<void> {
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      throw new AppError('User not found', 404);
    }
  }
}