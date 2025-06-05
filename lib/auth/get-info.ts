import { api } from "../api/fetcher";
import { API_ENDPOINTS } from "../api/end-points";
import { notify } from "@/utils/noti";

export const getUserInfo = async () => {
    try {
        const res = await api(API_ENDPOINTS.user.me, { method: 'GET' });
        console.log('%c📦 Calling /me from getUserInfo()', 'color: green');

        return res;
    } catch (err: any) {
        notify.error(err.message || 'Lỗi lấy thông tin người dùng');
    }
}

