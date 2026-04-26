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
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch('/panel/blog/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
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
