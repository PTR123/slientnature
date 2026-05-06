import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // 输入验证
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Username长度和字符验证
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be 3-20 characters' });
    }
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, underscores and Chinese characters' });
    }

    // Password强度验证
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '30d'
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// 登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password!);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '30d'
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// 获取当前用户
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json(req.user);
});

// Apple Sign In
const appleJwksClient = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

router.post('/apple', async (req: Request, res: Response) => {
  try {
    const { identityToken, fullName } = req.body;

    if (!identityToken) {
      return res.status(400).json({ error: 'Missing identityToken' });
    }

    // Decode the JWT header to get the kid
    const decodedHeader = JSON.parse(
      Buffer.from(identityToken.split('.')[0], 'base64').toString()
    );
    const kid = decodedHeader.kid;

    if (!kid) {
      return res.status(401).json({ error: 'Invalid Apple identity token' });
    }

    // Get the signing key
    const signingKey = await appleJwksClient.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();

    // Verify the JWT
    const decoded = jwt.verify(identityToken, publicKey, {
      issuer: 'https://appleid.apple.com',
      audience: process.env.APPLE_BUNDLE_ID,
    }) as { sub: string; email?: string };

    const sub = decoded.sub;
    const email = decoded.email || null;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { appleId: sub } });

    if (!user) {
      // Derive username from fullName or fallback
      let username: string;
      if (fullName?.givenName) {
        username = fullName.givenName + (fullName.familyName ? fullName.familyName[0] : '');
      } else {
        const hash = sub.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        username = 'User' + String(hash).slice(-4);
      }

      // Ensure username is unique
      let existingUser = await prisma.user.findUnique({ where: { username } });
      while (existingUser) {
        username = username + Math.floor(Math.random() * 1000);
        existingUser = await prisma.user.findUnique({ where: { username } });
      }

      user = await prisma.user.create({
        data: {
          appleId: sub,
          email,
          username,
          password: null,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '30d',
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Apple sign in error:', error);
    res.status(500).json({ error: 'Failed to sign in with Apple' });
  }
});

export default router;