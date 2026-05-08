import { useState, useRef } from 'react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label: string;
    error?: string;
    accept?: string;
}

export default function ImageUpload({ value, onChange, label, error, accept = 'image/*' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            /* The <meta name="csrf-token"> tag is generated once by panel.blade.php
             * and goes STALE after Inertia SPA navigation (login regenerates the
             * session, so the token changes — but the meta tag never re-renders
             * because Inertia only swaps page JSON, not the full HTML).
             *
             * The reliable source is Laravel's XSRF-TOKEN cookie, which is
             * refreshed on every response. We send it back via the
             * X-XSRF-TOKEN header — VerifyCsrfToken accepts this. We fall
             * back to the meta tag only if the cookie isn't readable. */
            const xsrfFromCookie = document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
            const xsrfToken = xsrfFromCookie ? decodeURIComponent(xsrfFromCookie) : null;

            const metaCsrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            if (!xsrfToken && !metaCsrf) {
                throw new Error('CSRF token not found');
            }

            const headers: Record<string, string> = {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            };
            if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
            if (metaCsrf)  headers['X-CSRF-TOKEN'] = metaCsrf;

            const response = await fetch('/panel/blog/upload-image', {
                method: 'POST',
                headers,
                credentials: 'same-origin',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onChange(data.url);
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
                alert(errorData.message || 'Failed to upload image. Please try again.');
                setPreview(value || null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
            setPreview(value || null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                        id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <label
                        htmlFor={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    {value && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Remove
                        </button>
                    )}
                </div>
                {preview && (
                    <div className="mt-2">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-32 w-auto rounded-lg object-cover border border-gray-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
                {value && !preview && (
                    <div className="mt-2">
                        <img
                            src={value}
                            alt="Current"
                            className="h-32 w-auto rounded-lg object-cover border border-gray-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
