// app/(root)/video/post/page.tsx
"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from "next/navigation"
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
import { getFullPath } from '@/lib/utils/get-full-path'
import { TagInput } from "@/components/ui/tag-input"
import { PATH } from '@/lib/constants/paths'

const PostVideoPage = () => {
    const params = useParams()
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const isEdit = !!id
    const router = useRouter()
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
        path: '',
        isActive: true,
        tags: [] as string[]
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

    // Fetch video data if editing
    useEffect(() => {
        if (isEdit) {
            (async () => {
                try {
                    const res = await api(API_ENDPOINTS.user.video.detail(id), { method: 'GET' }) as { title?: string; description?: string; image?: string; path?: string; isActive?: boolean; tags?: string[] };
                    setForm({
                        title: res.title || '',
                        description: res.description || '',
                        image: res.image || '',
                        path: res.path || '',
                        isActive: res.isActive ?? true,
                        tags: res.tags || []
                    });
                    setPreview(getFullPath(res.image || ''));
                } catch (err: unknown) {
                    const errorMessage = err instanceof Error ? err.message : 'Lỗi xử lý video';
                    notify.error(errorMessage);
                }
            })();
        }
    }, [isEdit, id, setPreview]);

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
        try {
            let res;
            if (isEdit) {
                res = await api(API_ENDPOINTS.user.video.edit(id), { method: 'PUT' }, form);
            } else {
                res = await api(API_ENDPOINTS.user.video.post, { method: 'POST' }, form);
            }
            notify.success((res as { message?: string })?.message || (isEdit ? 'Cập nhật video thành công' : 'Đăng video thành công'));
            if (!isEdit) {
                setForm({
                    title: '',
                    description: '',
                    image: '',
                    path: '',
                    isActive: true,
                    tags: []
                });
                setUploadProgress(0);
                setPreview('');
            }
            if (isEdit) {
                console.log('isEdit', isEdit);
                router.push(PATH.ME.VIDEO_MANAGE);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi xử lý video';
            notify.error(errorMessage);
        }
    };
    const handleCancel = () => {
        router.push(PATH.ME.VIDEO_MANAGE);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Chỉnh sửa video" : "Đăng video mới"}</CardTitle>
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

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <TagInput
                                tags={form.tags}
                                onChange={(tags) => setForm(prev => ({ ...prev, tags }))}
                                placeholder="Nhập tag và nhấn Enter..."
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
                                    className={`
                                        transition
                                        dark:bg-zinc-800 dark:text-white dark:border-zinc-600
                                        dark:hover:bg-zinc-700
                                        hover:bg-gray-100
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        ${imageLoading ? 'pointer-events-none' : ''}
                                    `}
                                >
                                    {imageLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Đang tải...
                                        </span>
                                    ) : 'Upload'}
                                </Button>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            {imagePreview && (
                                <div className="relative mt-2 h-40 w-40">
                                    <Image
                                        fill
                                        src={imagePreview}
                                        alt="Preview"
                                        className="object-cover rounded-md"
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
                                    className={`
                                        transition
                                        dark:bg-zinc-800 dark:text-white dark:border-zinc-600
                                        dark:hover:bg-zinc-700
                                        hover:bg-gray-100
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        ${videoLoading ? 'pointer-events-none' : ''}
                                    `}
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
                        <div className="space-y-2 text-center">
                            
                            <Button
                                type="submit"
                                className="w-2/4"
                                disabled={imageLoading || videoLoading}
                            >
                                {imageLoading || videoLoading
                                    ? (isEdit ? 'Đang cập nhật...' : 'Đang xử lý...')
                                    : (isEdit ? 'Cập nhật video' : 'Đăng video')}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                type="button"
                                className="w-1/4 ml-[40] bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 shadow rounded-md"
                                disabled={imageLoading || videoLoading}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default PostVideoPage;