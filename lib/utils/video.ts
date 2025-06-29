import getFullPath from './get-full-path';

/**
 * Utility function để download video file
 * @param videoPath - Đường dẫn video từ database
 * @returns void
 */
export function downloadVideoFile(videoPath: string): void {
    if (!videoPath) {
        console.warn('Video path is empty');
        return;
    }

    // Chuyển đổi đường dẫn từ HLS stream sang MP4 file
    const convertedPath = videoPath.endsWith('_hls/playlist.m3u8') 
        ? videoPath.replace('_hls/playlist.m3u8', '.mp4')
        : videoPath.replace('.m3u8', '.mp4');

    // Lấy tên file từ đường dẫn
    const fileName = convertedPath.split('/').pop() || 'downloaded-file.mp4';
    
    // Tạo link download
    const link = document.createElement('a');
    link.href = getFullPath(convertedPath);
    link.download = fileName;
    
    // Trigger download
    link.click();
}

/**
 * Utility function để lấy đường dẫn video đã chuyển đổi
 * @param videoPath - Đường dẫn video từ database
 * @returns Đường dẫn video đã chuyển đổi sang MP4
 */
export function getVideoDownloadPath(videoPath: string): string {
    if (!videoPath) return '';
    
    const convertedPath = videoPath.includes('_hls/playlist.m3u8') 
        ? videoPath.replace('_hls/playlist.m3u8', '.mp4')
        : videoPath.replace('.m3u8', '.mp4');
    
    return getFullPath(convertedPath);
}

/**
 * Utility function để lấy tên file video
 * @param videoPath - Đường dẫn video từ database
 * @returns Tên file video
 */
export function getVideoFileName(videoPath: string): string {
    if (!videoPath) return 'downloaded-file.mp4';
    
    const convertedPath = videoPath.includes('_hls/playlist.m3u8') 
        ? videoPath.replace('_hls/playlist.m3u8', '.mp4')
        : videoPath.replace('.m3u8', '.mp4');
    
    return convertedPath.split('/').pop() || 'downloaded-file.mp4';
} 