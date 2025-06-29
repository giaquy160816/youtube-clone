import Cookies from 'js-cookie';

/**
 * Kiểm tra xem token có sắp hết hạn trong 30 giây tới không
 * @returns {boolean} true nếu token sắp hết hạn trong 30 giây
 */
export function isTokenExpiringSoon(): boolean {
    const expired = parseInt(localStorage.getItem('user_expired') || '0', 10);
    if (!expired) return false;
    
    const now = Date.now();
    const timeUntilExpiry = expired - now;
    const thirtySeconds = 50 * 1000; // 30 giây
    console.log('expired', expired, now, timeUntilExpiry, thirtySeconds);
    return timeUntilExpiry <= thirtySeconds;
}
/**
 * Kiểm tra xem token đã hết hạn chưa
 * @returns {boolean} true nếu token đã hết hạn
 */
export function isTokenExpired(): boolean {
    const expired = parseInt(localStorage.getItem('user_expired') || '0', 10);
    if (!expired) return true;
    
    return Date.now() > expired;
}

/**
 * Lấy thời gian còn lại của token (tính bằng milliseconds)
 * @returns {number} Thời gian còn lại, 0 nếu đã hết hạn
 */
export function getTokenTimeRemaining(): number {
    const expired = parseInt(localStorage.getItem('user_expired') || '0', 10);
    if (!expired) return 0;
    
    const now = Date.now();
    const timeRemaining = expired - now;
    
    return Math.max(0, timeRemaining);
}

/**
 * Kiểm tra xem user có đang đăng nhập không
 * @returns {boolean} true nếu user đã đăng nhập và token chưa hết hạn
 */
export function isUserLoggedIn(): boolean {
    const accessToken = Cookies.get('access_token');
    if (!accessToken) return false;
    
    return !isTokenExpired();
}

/**
 * Xóa tất cả thông tin authentication và bắn event 'authExpired'
 */
export function clearAuthData(): void {
    localStorage.removeItem('user_info');
    localStorage.removeItem('user_expired');
    Cookies.remove('access_token');
    Cookies.remove('user_info');
    window.dispatchEvent(new CustomEvent('authExpired'));
}

/**
 * Tính toán thời gian hết hạn từ expiredAt (seconds)
 * @param expiredAt - Thời gian hết hạn tính bằng seconds
 * @returns {number} Timestamp hết hạn tính bằng milliseconds
 */
export function calculateExpiryTime(expiredAt: number): number {
    return Date.now() + (expiredAt * 1000);
} 