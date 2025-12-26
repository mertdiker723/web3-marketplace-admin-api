import type { Request, Response } from 'express';

import { UserService } from '../../services/user';
import { type IUser } from '../../models/user/user.model';

interface AuthenticatedRequest extends Request {
  user?: Partial<IUser>;
}

export class UserController {
  #userService: UserService;

  constructor() {
    this.#userService = new UserService();

    this.registerUser = this.registerUser.bind(this);
  }

  getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { data, message, success } = await this.#userService.getUser(req.user as Partial<IUser>);

      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  registerUser = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#userService.registerUser(req.body);
      res.status(201).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#userService.loginUser(req.body);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };
}
