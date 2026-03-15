import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import type { AppError } from '../middleware/errorHandler.ts';
import { validateAuth } from '../utils/authValidation';

// post /api/v1/auth/register

export const registerUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // error validation
  const validationErrors = validateAuth(req.body);
  if (validationErrors.length > 0) {
    const err: AppError = new Error("Invalid registration data");
    err.type = "VALIDATION_ERROR";
    err.details = validationErrors;
    return next(err);
  }

  const { email, password, name } = req.body;

  try {
    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const err: AppError = new Error("Email is already in use");
      err.type = "VALIDATION_ERROR";
      return next(err);
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    // return success
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      email: newUser.email
    });
  }
  catch (error) {
    next(error);
  }
}