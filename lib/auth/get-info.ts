import { api } from "../api/fetcher";
import { API_ENDPOINTS } from "../api/end-points";
import { notify } from "@/lib/utils/noti";

export const getUserInfo = async () => {
    try {
        const res = await api(API_ENDPOINTS.user.me, { method: 'GET' });
        return res;
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Lỗi lấy thông tin người dùng';
        notify.error(errorMessage);
    }
}

