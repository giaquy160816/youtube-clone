// app/(root)/profile/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { notify } from '@/utils/noti';
import type { UserInfo } from '@/types/auth';
import { getUserInfo } from '@/lib/auth/get-info';
import { useUser } from '@/context/UserContext';



const getFullImageUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}/${path}`;

const ProfilePage = () => {
    const [form, setForm] = useState({
        fullname: '',
        phone: '',
        avatar: '',
    });
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api(API_ENDPOINTS.user.me, { method: 'PUT' }, form) as { message: string };
            const oldUser = JSON.parse(localStorage.getItem('user_info') || '{}');
            const newUser = {
                ...oldUser,
                fullname: form.fullname,
                avatar: form.avatar,
            };

            setUser(newUser);
            localStorage.setItem('user_info', JSON.stringify(newUser));
            notify.success(res.message || 'Cập nhật hồ sơ thành công');
        } catch (err: any) {
            notify.error(err.message || 'Lỗi cập nhật hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        try {
            const res = await api(API_ENDPOINTS.common.uploadImage, { method: 'POST' }, formData) as { path: string };
            setAvatarPreview(getFullImageUrl(res.path || ''));
            setForm((prev) => ({ ...prev, avatar: res.path }));
            e.target.value = '';
        } catch (err: any) {
            notify.error(err.message || 'Lỗi upload ảnh');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await getUserInfo() as UserInfo;
            setForm({
                fullname: res.fullname,
                phone: res.phone || '',
                avatar: res.avatar || '',
            });
            if (res.avatar) {
                setAvatarPreview(getFullImageUrl(res.avatar));
            }
        }
        fetchUserInfo();
    }, []);

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Hồ sơ</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    {/* Avatar preview */}
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                        <Image
                            src={avatarPreview || '/avatar-default.png'}
                            alt="avatar"
                            width={80}
                            height={80}
                            className="rounded-full object-cover border "
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Avatar actions */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="avatar">Ảnh đại diện</Label>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('avatar')?.click()}
                            >
                                📁 Chọn ảnh
                            </Button>

                            {form.avatar && (
                                <Button

                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        setForm((prev) => ({ ...prev, avatar: '' }));
                                        setAvatarPreview('/avatar-default.png');
                                    }}
                                >
                                    ❌ Xoá ảnh
                                </Button>
                            )}
                        </div>

                        {/* Hidden input */}
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                </div>


                {/* Full name */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="fullname">Họ và tên</Label>
                    <Input
                        id="fullname"
                        name="fullname"
                        value={form.fullname}
                        onChange={handleChange}
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                </Button>

            </form>
        </div>
    );
};

export default ProfilePage;
