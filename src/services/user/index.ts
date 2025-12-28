import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

// Models
import { type IUser } from '../../models/user/user.model';

// Enums
import { UserType } from '../../enums/user/user.enum';

// Utils
import { BadRequestError } from '../../utils/errors/HttpError';

// Repositories
import { UserRepository } from '../../repositories/user';

// Utils
import { tokenCreation } from '../../utils/jwt/tokenCreation';
import { validateEmail, handleValidationZodError } from '../../utils/helpers';

// Validations
import { loginUserSchema } from '../../validations/user/user.validation';

export class UserService {
  #userRepository: UserRepository;

  constructor() {
    this.#userRepository = new UserRepository();
  }

  getUser = async (data: Partial<IUser>) => {
    const { id } = data || {};
    const user = await this.#userRepository.findUserById(id as string);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      data: userWithoutPassword,
      message: 'User fetched successfully',
      success: true,
    };
  };

  registerUser = async (data: Partial<IUser>) => {
    const { firstName, lastName, email, password, confirmPassword } = data || {};
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      throw new BadRequestError('All fields are required');
    }

    if (!validateEmail(email)) {
      throw new BadRequestError('Invalid email');
    }

    const userByEmail = await this.#userRepository.findUserByEmail(email);

    if (userByEmail) {
      throw new BadRequestError('User already exists');
    }

    if (password !== confirmPassword) {
      throw new BadRequestError('Password and confirmPassword do not match');
    }

    if (password.length < 4 || password.length > 8) {
      throw new BadRequestError('Password must be between 4 and 8 characters');
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

    const { password: _, ...userWithoutPassword } = user;

    const payload = { id: user.id, email: user.email, userType: user.userType };

    const token = tokenCreation(payload);

    return {
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'User created successfully',
      success: true,
    };
  };

  loginUser = async (data: Partial<IUser>) => {
    try {
      const validatedData = loginUserSchema.parse(data);
      const { email, password } = validatedData || {};

      const user = await this.#userRepository.findUserByEmail(email);

      if (!user) {
        throw new BadRequestError('User not found');
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
    } catch (error) {
      if (error instanceof ZodError) {
        throw handleValidationZodError(error);
      }
      throw error;
    }
  };
}
