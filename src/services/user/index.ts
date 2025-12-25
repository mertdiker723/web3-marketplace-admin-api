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
import { validateEmail } from '../../utils/helpers';

export class UserService {
  #userRepository: UserRepository;

  constructor() {
    this.#userRepository = new UserRepository();
  }

  registerUser = async (data: Partial<IUser>) => {
    const { firstName, lastName, email, password, rePassword } = data || {};
    if (!firstName || !lastName || !email || !password || !rePassword) {
      throw new BadRequestError('All fields are required');
    }

    if (!validateEmail(email)) {
      throw new BadRequestError('Invalid email');
    }

    // Check if user already exists
    const userByEmail = await this.#userRepository.findUserByEmail(email);

    if (userByEmail) {
      throw new BadRequestError('User already exists');
    }

    if (password !== rePassword) {
      throw new BadRequestError('Password and rePassword do not match');
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

    return {
      data: userWithoutPassword,
      message: 'User created successfully',
      success: true,
    };
  };

  loginUser = async (data: Partial<IUser>) => {
    const { email, password } = data || {};
    if (!email || !password) {
      throw new BadRequestError('All fields are required');
    }

    if (!validateEmail(email)) {
      throw new BadRequestError('Invalid email');
    }

    // Check if user exists
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

    return {
      data: token,
      message: 'Login successful',
      success: true,
    };
  };
}
