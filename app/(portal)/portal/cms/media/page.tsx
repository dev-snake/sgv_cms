'use client';

import * as React from 'react';
import Image from 'next/image';
import {
    Upload,
    Search,
    Trash2,
    Copy,
    Maximize2,
    Loader2,
    Image as ImageIcon,
    Check,
    X,
    FileText,
    Clock,
    HardDrive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeleteConfirmationDialog } from '@/components/portal/delete-confirmation-dialog';
import Lightbox from '@/components/shared/Lightbox';

interface UploadedImage {
    filename: string;
    url: string;
    size: number;
    createdAt: string;
}

export default function MediaManagementPage() {
    const [images, setImages] = React.useState<UploadedImage[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<UploadedImage | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/upload');
            if (response.data.success) {
                setImages(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            toast.error('Không thể tải danh sách ảnh');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Định dạng không hợp lệ. Chỉ chấp nhận: JPEG, PNG, WebP, GIF');
            return;
        }

        // Validate file size (max 10MB for admin)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Kích thước file vượt quá 10MB');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                toast.success('Tải ảnh thành công!');
                fetchImages();
                setUploadDialogOpen(false);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Không thể tải ảnh. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/api/upload?filename=${itemToDelete.filename}`);
            toast.success('Đã xóa ảnh thành công');
            fetchImages();
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi xóa ảnh');
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Đã sao chép đường dẫn ảnh');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const filteredImages = images.filter((img) =>
        img.filename.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">
                        Thư viện Media
                    </h1>
                    <p className="text-slate-500 font-medium italic mt-2 text-sm">
                        Quản lý toàn bộ tài sản hình ảnh và kỹ thuật của hệ thống.
                    </p>
                </div>
                <Button
                    onClick={() => setUploadDialogOpen(true)}
                    className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-4 hover:cursor-pointer h-auto transition-all rounded-none"
                >
                    <Upload className="mr-2 size-4" /> Tải ảnh mới
                </Button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-none border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
                {/* Filters */}
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row gap-6 items-center justify-between bg-white">
                    <div className="relative w-full sm:w-1/2 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            placeholder="TÌM KIẾM THEO TÊN FILE..."
                            className="w-full pl-12 bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20 h-14 rounded-none outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <HardDrive size={16} />
                            <span className="text-[10px] font-black uppercase">
                                {images.length} FILE
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grid/List */}
                <div className="flex-1 p-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <Loader2
                                size={40}
                                className="animate-spin text-brand-primary opacity-20"
                            />
                        </div>
                    ) : filteredImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                            {filteredImages.map((image, index) => (
                                <div
                                    key={image.filename}
                                    className="group relative aspect-square bg-slate-50 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.filename}
                                        fill
                                        unoptimized
                                        quality={100}
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col">
                                        <div className="flex justify-end p-2 gap-2">
                                            <button
                                                onClick={() => copyToClipboard(image.url)}
                                                title="Sao chép URL"
                                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 text-white transition-colors"
                                            >
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setItemToDelete(image);
                                                    setDeleteDialogOpen(true);
                                                }}
                                                title="Xóa ảnh"
                                                className="bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md p-2 text-white transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <button
                                                onClick={() => openLightbox(index)}
                                                className="bg-white text-slate-900 p-3 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out shadow-2xl"
                                            >
                                                <Maximize2 size={20} />
                                            </button>
                                        </div>
                                        <div className="bg-slate-900/80 backdrop-blur-md p-3 space-y-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-[8px] font-black text-white/90 truncate uppercase tracking-tighter">
                                                {image.filename}
                                            </p>
                                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">
                                                {formatFileSize(image.size)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] text-slate-300">
                            <ImageIcon size={64} className="mb-6 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Không tìm thấy ảnh nào.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden rounded-none border-none">
                    <div className="bg-slate-900 p-8 text-white relative">
                        <div className="flex items-center gap-4 mb-2">
                            <Upload className="text-brand-accent" size={20} />
                            <DialogTitle className="text-lg font-black uppercase tracking-tight italic text-white">
                                Tải tài sản mới
                            </DialogTitle>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            Hỗ trợ định dạng JPEG, PNG, WebP (Tối đa 10MB)
                        </p>
                        <button
                            onClick={() => setUploadDialogOpen(false)}
                            className="absolute top-8 right-8 text-white/40 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 bg-white">
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const file = e.dataTransfer.files[0];
                                if (file) handleUpload(file);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                'h-64 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group',
                                isDragging
                                    ? 'border-brand-primary bg-brand-primary/5'
                                    : 'border-slate-100 hover:border-brand-primary/40 hover:bg-slate-50/50',
                            )}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Đang xử lý dữ liệu...
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative">
                                        <ImageIcon className="h-16 w-16 text-slate-100 group-hover:text-brand-primary/10 transition-colors" />
                                        <Upload className="absolute -bottom-2 -right-2 h-8 w-8 text-brand-primary group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                            Kéo thả hoặc{' '}
                                            <span className="text-brand-primary italic">
                                                Nhấn để chọn file
                                            </span>
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                            Hệ thống tự động tối ưu hóa dung lượng cho Web
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpload(file);
                                    e.target.value = '';
                                }}
                            />
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => setUploadDialogOpen(false)}
                                className="text-[10px] font-black uppercase tracking-widest rounded-none h-14 px-8 border-transparent"
                            >
                                Hủy bỏ
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Lightbox for Preview */}
            <Lightbox
                images={filteredImages.map((img) => img.url)}
                currentIndex={currentImageIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={(index) => setCurrentImageIndex(index)}
            />

            {/* Delete Confirmation */}
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title="Xóa tài sản Media"
                description="Ảnh này sẽ bị xóa vĩnh viễn khỏi máy chủ. Mọi liên kết hiện tại trên trang web sẽ bị lỗi."
                itemName={itemToDelete?.filename}
                itemLabel="Tên file"
                loading={isDeleting}
            />
        </div>
    );
}
