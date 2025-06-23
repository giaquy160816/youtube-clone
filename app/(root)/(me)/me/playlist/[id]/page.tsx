'use client';
import { useParams } from "next/navigation";
import { usePlaylist } from "@/lib/hooks/usePlaylist";
import { useEffect, useState } from "react";
import { Playlist, PlaylistVideo } from "@/types/api";
import getFullPath from "@/lib/utils/get-full-path";
import { videoSmall } from "@/types/video";

export default function MePlaylistIdPage() {
    const { id } = useParams();
    const { getPlaylistDetail } = usePlaylist();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    useEffect(() => {
        getPlaylistDetail(id as string).then((res) => {
            setPlaylist(res);
        });
    }, [id]);
    return <div>
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Video trong playlist: {playlist?.name}</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {playlist?.videos?.map((video) => (
                    <a
                        key={video.id}
                        href={`/video/detail/${video.id}`}
                        className="block rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                    >
                        <img
                            src={getFullPath(video?.image)}
                            alt={video.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-2">
                            <h2 className="text-lg font-medium truncate line-clamp-2 text-ellipsis text-center">{video.title}</h2>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </div>;
}