'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/auth/supabase-client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    const { user } = useUser();
    const scrollRef = useRef<HTMLDivElement>(null);

    // ✅ Auto scroll vào comment mới nhất
    useEffect(() => {
        if (!scrollRef.current) return;
        const timer = setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }, [comments]);

    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('video_comments')
                .select('*')
                .eq('video_id', videoId)
                .order('created_at', { ascending: true });

            if (error) {
                toast.error('Lỗi tải bình luận');
            } else {
                setComments(data || []);
            }
        };

        fetchComments();

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
                    setComments((prev) => [...prev, newComment]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [videoId]);

    const handleSendComment = async () => {
        if (!input.trim()) return;
        setLoading(true);

        const { error } = await supabase
            .from('video_comments')
            .insert([
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
        <div className="mt-6 border-t pt-4 mx-auto">
            <h3 className="text-xl font-semibold mb-3">Bình luận</h3>

            <ScrollArea className="h-[300px] border rounded-md p-3 bg-white dark:bg-zinc-900">
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

                    {/* 👇 Anchor cuối để scroll đến */}
                    <div ref={scrollRef}></div>
                </div>
            </ScrollArea>

            <div className="mt-4 space-y-2">
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
        </div>
    );
}