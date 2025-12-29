import bcrypt from 'bcryptjs';

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
import { handleValidationZodError } from '../../utils/helpers';

// Validations
import { getUserSchema, loginUserSchema, registerUserSchema } from '../../validations/user/user.validation';

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

    const { password: _, ...userWithoutPassword } = user;

    return {
      data: userWithoutPassword,
      message: 'User fetched successfully',
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
    const validatedData = loginUserSchema.safeParse(data);

    if (!validatedData.success) {
      throw new BadRequestError(handleValidationZodError(validatedData.error));
    }

    const { email, password } = validatedData.data || {};

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
  };
}
