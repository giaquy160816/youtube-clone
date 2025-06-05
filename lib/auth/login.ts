// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { accessToken, user, expiresIn = 3600 } = req.body;

    if (!accessToken || !user?.email) {
        return res.status(400).json({ error: 'Thiếu accessToken hoặc thông tin user' });
    }

    const cookie = serialize('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: expiresIn,
        sameSite: 'lax',
    });

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Đăng nhập thành công', user });
}