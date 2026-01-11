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
      const userQuery = req.params.id ? { id: req.params.id } : (req.user as Partial<IUser>);
      const { data, message, success } = await this.#userService.getUser(userQuery);

      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const { data, pagination, message, success } = await this.#userService.getAllUsers(req.query);

      res.status(200).json({ data, pagination, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  updateUserInfo = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#userService.updateUser(req.params.id as string, req.body);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  updateUserProfile = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#userService.updateUserProfile(req.params.id as string, req.body);
      res.status(200).json({ data, message, success });
    } catch (error) {
      res.status(500).json({ data: null, message: (error as Error).message, success: false });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { data, message, success } = await this.#userService.deleteUser(req.params.id as string);
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
