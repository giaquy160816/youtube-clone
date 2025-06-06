// lib/utils/image.ts
const getFullImageUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
export { getFullImageUrl };
