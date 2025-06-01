// ✅ app/[[...slug]]/page.tsx
type tParams = Promise<{ slug: string[] }>;

export default async function Page({ params }: { params: tParams }) {
    const { slug }: { slug: string[] } = await params;

    return (
        <div>
            <h1>Slug page</h1>
            <pre>{JSON.stringify(slug)}</pre>
        </div>
    );
}