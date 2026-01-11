import bcrypt from 'bcryptjs';

// Models
import { type IUser, type IUserQueryParams } from '../../models/user/user.model';

// Enums
import { UserType } from '../../enums/user/user.enum';

// Utils
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/errors/HttpError';

// Repositories
import { UserRepository } from '../../repositories/user';

// Utils
import { tokenCreation } from '../../utils/jwt/tokenCreation';
import { handleValidationZodError } from '../../utils/helpers';

// Validations
import { getUserSchema, loginUserSchema, registerUserSchema, updateUserProfileSchema } from '../../validations/user/user.validation';

export class UserService {
  #userRepository: UserRepository;

  constructor() {
    this.#userRepository = new UserRepository();
  }

  getUser = async (data: Partial<IUser>) => {
    const validatedData = getUserSchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }

    const { id } = validatedData.data || {};

    const user = await this.#userRepository.findUserById(id);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    return {
      data: user,
      message: 'User fetched successfully',
      success: true,
    };
  };

  getAllUsers = async (params?: IUserQueryParams) => {
    const page = params?.page || 1;
    const limit = params?.limit || 5;
    const search = params?.search || '';

    const { users, pagination } = await this.#userRepository.getAllUsers({ page, limit, search });

    if (!users || users.length === 0) {
      throw new NotFoundError('No users found');
    }

    return {
      data: users,
      pagination,
      message: 'Users fetched successfully',
      success: true,
    };
  };

  updateUser = async (id: string, data: Partial<IUser>) => {
    if (!id) {
      throw new BadRequestError('User ID is required');
    }

    const { data: updateData } = await this.#userRepository.updateUser(id, data);

    if (!updateData) {
      throw new NotFoundError('User not found');
    }
    return {
      data: updateData,
      message: 'User updated successfully',
      success: true,
    };
  };

  updateUserProfile = async (id: string, data: Partial<IUser>) => {
    const validatedData = updateUserProfileSchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }

    const updatedData: Partial<IUser> = { ...data };

    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password as string, 10);
    }

    if (!id) {
      throw new BadRequestError('User ID is required');
    }
    const { data: updateData } = await this.#userRepository.updateUserProfile(id, updatedData);
    return {
      data: updateData,
      message: 'User profile updated successfully',
      success: true,
    };
  };

  deleteUser = async (id: string) => {
    if (!id) {
      throw new BadRequestError('User ID is required');
    }
    const { data } = await this.#userRepository.deleteUser(id);

    if (!data) {
      throw new NotFoundError('User not found');
    }

    return {
      data,
      message: 'User deleted successfully',
      success: true,
    };
  };

  registerUser = async (data: Partial<IUser>) => {
    const validatedData = registerUserSchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }
    const { firstName, lastName, email, password } = validatedData.data || {};

    const userByEmail = await this.#userRepository.findUserByEmail(email);

    if (userByEmail) {
      throw new BadRequestError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Partial<IUser> = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType: UserType.GUEST_ADMIN,
    };

    const user = await this.#userRepository.registerUser(userData);

    const payload = { id: user.id, email: user.email, userType: user.userType };

    const token = tokenCreation(payload);

    return {
      data: {
        user,
        token,
      },
      message: 'User created successfully',
      success: true,
    };
  };

  loginUser = async (data: Partial<IUser>) => {
    const validatedData = loginUserSchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }

    const { email, password } = validatedData.data || {};

    const user = await this.#userRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    if (![UserType.ADMIN, UserType.SUPER_ADMIN, UserType.GUEST_ADMIN].includes(user.userType)) {
      throw new ForbiddenError('You are not authorized to login for non admin users');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestError('Invalid password');
    }

    const payload = { id: user.id, email: user.email, userType: user.userType };

    const token = tokenCreation(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
      success: true,
    };
  };
}
