// app/(root)/video/detail/[id]/CommentSection.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/auth/supabase-client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useUser } from '@/lib/context/UserContext';

type Comment = {
    id: string;
    content: string;
    user_name: string;
    user_avatar?: string;
    created_at: string;
};

export default function CommentSection({ videoId }: { videoId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const { user } = useUser();
    const LIMIT = 5;

    const fetchComments = useCallback(async (offset = 0, append = false) => {
        setFetching(true);
        const { data, error } = await supabase
            .from('video_comments')
            .select('*')
            .eq('video_id', videoId)
            .order('created_at', { ascending: false })
            .range(offset, offset + LIMIT - 1);

        if (error) {
            toast.error('Lỗi tải bình luận');
        } else {
            if (append) {
                setComments((prev) => [...prev, ...(data || [])]);
            } else {
                setComments(data || []);
            }
            if (!data || data.length < LIMIT) setHasMore(false)
            else setHasMore(true);
        }
        setFetching(false);
    }, [videoId]);

    useEffect(() => {
        const loadComments = async () => {
            await fetchComments(0, false);
        }
        loadComments();
        
        const channel = supabase
            .channel(`realtime-comments-${videoId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'video_comments',
                    filter: `video_id=eq.${videoId}`,
                },
                (payload) => {
                    const newComment = payload.new as Comment;
                    setComments((prev) => [newComment, ...prev]); // 👉 mới nhất trên đầu
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchComments, videoId]);

    const handleSendComment = async () => {
        if (!input.trim()) return;
        setLoading(true);

        const { error } = await supabase.from('video_comments').insert([
            {
                video_id: videoId,
                content: input,
                user_name: user?.fullname || 'Khách',
                user_avatar: user?.avatar || '',
            },
        ]);

        if (error) {
            toast.error('Gửi bình luận thất bại');
        }

        setInput('');
        setLoading(false);
    };

    return (
        <div className="mt-6 border-t pt-4 mx-auto w-full">
            <h3 className="text-xl font-semibold mb-3">Bình luận</h3>

            {/* 💬 Form comment nằm trên */}
            <div className="mb-4 space-y-2">
                <Textarea
                    placeholder="Nhập bình luận..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={3}
                    className="resize-none"
                />
                <Button
                    onClick={handleSendComment}
                    disabled={!input.trim() || loading}
                    className="bg-primary hover:bg-primary/90"
                >
                    {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
            </div>

            <div className="space-y-4">
                {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={c.user_avatar || ''} />
                            <AvatarFallback>{c.user_name?.[0] ?? '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{c.user_name}</p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{c.content}</p>
                            <span className="text-xs text-muted-foreground block mt-1">
                                {new Date(c.created_at).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}

                {hasMore && (
                    <div className="text-center pt-3">
                        <Button 
                        variant="ghost" 
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={() => fetchComments(comments.length, true)} 
                        disabled={fetching}
                        >
                            {fetching ? 'Đang tải...' : 'Xem thêm bình luận'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}