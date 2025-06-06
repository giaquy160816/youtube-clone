// app/(root)/video/post/page.tsx
"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFileUpload } from '@/lib/hooks/useFileUpload'
import { useVideoUpload } from '@/lib/hooks/useVideoUpload'
import { API_ENDPOINTS } from '@/lib/api/end-points'
import { api } from '@/lib/api/fetcher'
import { notify } from '@/lib/utils/noti'
import Image from 'next/image'

const PostVideoPage = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
        path: '',
        isActive: true
    });

    const [uploadProgress, setUploadProgress] = useState(0);
    const { 
        handleFileUpload: handleImageUpload, 
        loading: imageLoading,
        preview: imagePreview,
        setPreview
    } = useFileUpload({
        fileType: 'image',
        onSuccess: (path) => setForm(prev => ({ ...prev, image: path }))
    });

    const { 
        handleVideoUpload, 
        loading: videoLoading 
    } = useVideoUpload({
        onSuccess: (path) => setForm(prev => ({ ...prev, path })),
        onProgress: (progress) => setUploadProgress(progress)
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (name === 'isActive' && type === 'radio') {
            setForm({ ...form, isActive: value === 'true' });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🧹 form', form);
        try {
            const res = await api(API_ENDPOINTS.video.post, { method: 'POST' }, form) as { message: string };
            console.log('🧹 res', res);
            notify.success(res.message || 'Đăng video thành công');
            setForm({
                title: '',
                description: '',
                image: '',
                path: '',
                isActive: true
            });
            setUploadProgress(0);
            setPreview('');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi đăng video';
            notify.error(errorMessage);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Đăng video mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Nhập tiêu đề video"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition"
                                placeholder="Nhập mô tả video"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Ảnh thumbnail</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    name="image"
                                    value={form.image}
                                    onChange={handleChange}
                                    placeholder="Chọn ảnh thumbnail"
                                    readOnly
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    disabled={imageLoading}
                                >
                                    {imageLoading ? 'Đang tải...' : 'Upload'}
                                </Button>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            {imagePreview && (
                                <div className="mt-2">
                                    <Image
                                        fill
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="max-h-40 rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="path">Video</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="path"
                                    name="path"
                                    value={form.path}
                                    onChange={handleChange}
                                    placeholder="Chọn file video"
                                    readOnly
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('video-upload')?.click()}
                                    disabled={videoLoading}
                                >
                                    {videoLoading ? 'Đang tải...' : 'Upload'}
                                </Button>
                                <input
                                    id="video-upload"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    className="hidden"
                                />
                            </div>
                            {videoLoading && (
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Đang tải lên: {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Active Status */}
                        <div className="space-y-2">
                            <Label>Trạng thái</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value="true"
                                        checked={form.isActive === true}
                                        onChange={handleChange}
                                    />
                                    <span>Hoạt động</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value="false"
                                        checked={form.isActive === false}
                                        onChange={handleChange}
                                    />
                                    <span>Không hoạt động</span>
                                </label>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={imageLoading || videoLoading}
                        >
                            {imageLoading || videoLoading ? 'Đang xử lý...' : 'Đăng video'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default PostVideoPage;