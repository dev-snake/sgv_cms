'use client';

import $api from '@/utils/axios';
import {
    Search,
    MoreHorizontal,
    Trash2,
    Loader2,
    Users,
    FileDown,
    Mail,
    Phone,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Briefcase,
    BarChart3,
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmationDialog } from '@/components/portal/delete-confirmation-dialog';
import { TablePagination } from '@/components/portal/table-pagination';
import { API_ROUTES, PORTAL_ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PieChartLabel } from '@/components/portal/charts/PieChartLabel';
import { AreaChartGradient } from '@/components/portal/charts/AreaChartGradient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface JobApplication {
    id: string;
    job_id: string;
    job_title: string;
    full_name: string;
    email: string;
    phone: string;
    cv_url: string;
    cover_letter: string | null;
    status: string;
    created_at: string;
}

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; icon: any; chartColor: string }
> = {
    pending: {
        label: 'Chờ duyệt',
        color: 'bg-amber-500/10 text-amber-600',
        icon: Clock,
        chartColor: '#f59e0b',
    },
    reviewed: {
        label: 'Đã xem',
        color: 'bg-blue-500/10 text-blue-600',
        icon: Eye,
        chartColor: '#3b82f6',
    },
    interviewed: {
        label: 'Phỏng vấn',
        color: 'bg-purple-500/10 text-purple-600',
        icon: Users,
        chartColor: '#a855f7',
    },
    rejected: {
        label: 'Từ chối',
        color: 'bg-rose-500/10 text-rose-600',
        icon: XCircle,
        chartColor: '#f43f5e',
    },
    accepted: {
        label: 'Trúng tuyển',
        color: 'bg-emerald-500/10 text-emerald-600',
        icon: CheckCircle2,
        chartColor: '#10b981',
    },
};

export default function ApplicationsManagementPage() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<JobApplication | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const fetchApplications = async (page: number, limit: number, search: string) => {
        setIsLoading(true);
        try {
            const res = await $api.get(API_ROUTES.APPLICATIONS, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                },
            });
            setApplications(res.data.data || []);
            if (res.data.meta) {
                setTotalItems(res.data.meta.total || 0);
            }
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải danh sách ứng viên');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await $api.get(API_ROUTES.STATS);
            setStats(res.data.data);
        } catch (error) {
            console.error('Failed to fetch recruitment stats', error);
        }
    };

    useEffect(() => {
        fetchApplications(currentPage, pageSize, debouncedSearch);
        fetchStats();
    }, [currentPage, pageSize, debouncedSearch]);

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await $api.delete(`${API_ROUTES.APPLICATIONS}/${itemToDelete.id}`);
            toast.success('Đã xóa hồ sơ ứng viên');
            fetchApplications(currentPage, pageSize, debouncedSearch);
            fetchStats();
        } catch {
            toast.error('Không thể xóa hồ sơ ứng viên');
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await $api.patch(`${API_ROUTES.APPLICATIONS}/${id}`, { status });
            toast.success('Đã cập nhật trạng thái hồ sơ');
            fetchApplications(currentPage, pageSize, debouncedSearch);
            fetchStats();
        } catch {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const getStatusBadge = (status: string) => {
        const config = STATUS_CONFIG[status] || {
            label: status,
            color: 'bg-slate-500/10 text-slate-500',
            icon: AlertCircle,
        };
        const Icon = config.icon;
        return (
            <Badge
                className={cn(
                    'border-none text-[9px] font-black uppercase tracking-widest gap-1.5 py-1',
                    config.color,
                )}
            >
                <Icon size={10} />
                {config.label}
            </Badge>
        );
    };

    // Prepare chart data
    const statusChartData = stats?.applicationStats
        ? Object.entries(stats.applicationStats).map(([status, count]) => {
              const config = STATUS_CONFIG[status] || { label: status, chartColor: '#64748b' };
              return {
                  status,
                  count: Number(count),
                  fill: config.chartColor,
              };
          })
        : [];

    const statusConfig = Object.entries(STATUS_CONFIG).reduce(
        (acc: any, [key, val]) => {
            acc[key] = { label: val.label, color: val.chartColor };
            return acc;
        },
        { count: { label: 'Số lượng' } },
    );

    const trendData =
        stats?.trends?.map((t: any) => ({
            month: t.month.toUpperCase(),
            applications: t.applications || 0,
        })) || [];

    const metrics = [
        {
            label: 'Tổng số hồ sơ',
            value: totalItems,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
        {
            label: 'Chờ xét duyệt',
            value: stats?.applicationStats?.pending || 0,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        },
        {
            label: 'Đã trúng tuyển',
            value: stats?.applicationStats?.accepted || 0,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
        },
        {
            label: 'Đang phỏng vấn',
            value: stats?.applicationStats?.interviewed || 0,
            icon: Briefcase,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-brand-primary text-white text-[9px] font-black uppercase tracking-[0.2em]">
                            HR MANAGEMENT
                        </span>
                        <div className="h-4 w-px bg-slate-200" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Hệ thống quản lý ứng viên
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                        Tuyển dụng <span className="text-brand-primary">Portal</span>
                    </h1>
                </div>
            </div>

            {/* Metric Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <Card
                        key={i}
                        className={cn(
                            'border-none shadow-sm rounded-none overflow-hidden relative group',
                            m.bg,
                        )}
                    >
                        <div
                            className={cn(
                                'absolute top-0 left-0 w-1 h-full bg-current transition-all group-hover:w-2',
                                m.color,
                            )}
                        />
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        {m.label}
                                    </p>
                                    <h3 className="text-3xl font-black tracking-tight text-slate-900">
                                        {isLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
                                        ) : (
                                            m.value
                                        )}
                                    </h3>
                                </div>
                                <div className={cn('p-3 rounded-none bg-white shadow-sm', m.color)}>
                                    <m.icon size={20} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="list" className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-2 border border-slate-800">
                    <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
                        <TabsTrigger
                            value="list"
                            className="rounded-none bg-transparent data-[state=active]:bg-brand-primary data-[state=active]:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest h-11 px-6 transition-all border border-transparent data-[state=active]:border-brand-primary active:scale-95"
                        >
                            <Users size={14} className="mr-2" />
                            Danh sách ứng viên
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="rounded-none bg-transparent data-[state=active]:bg-brand-primary data-[state=active]:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest h-11 px-6 transition-all border border-transparent data-[state=active]:border-brand-primary active:scale-95"
                        >
                            <BarChart3 size={14} className="mr-2" />
                            Phân tích dữ liệu
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Tìm ứng viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-12 pr-4 bg-slate-800 border border-slate-700 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary transition-colors"
                        />
                    </div>
                </div>

                <TabsContent value="list" className="m-0 space-y-6">
                    {/* Table */}
                    <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <Users size={48} className="mb-4 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Chưa có ứng viên nào ứng tuyển
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-50 bg-slate-50/50">
                                            <th className="text-left p-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                Ứng viên
                                            </th>
                                            <th className="text-left p-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                Vị trí ứng tuyển
                                            </th>
                                            <th className="text-left p-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                Thông tin liên hệ
                                            </th>
                                            <th className="text-left p-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                Ngày nộp
                                            </th>
                                            <th className="text-left p-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                Trạng thái
                                            </th>
                                            <th className="text-right p-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {applications.map((app) => (
                                            <tr
                                                key={app.id}
                                                className="hover:bg-slate-50/30 transition-colors"
                                            >
                                                <td className="p-6">
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                        {app.full_name}
                                                    </p>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-[10px] font-black text-brand-primary uppercase truncate max-w-[200px] flex items-center gap-2">
                                                        <Briefcase size={12} /> {app.job_title}
                                                    </p>
                                                </td>
                                                <td className="p-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                                            <Mail
                                                                size={12}
                                                                className="text-slate-300"
                                                            />
                                                            {app.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                                            <Phone
                                                                size={12}
                                                                className="text-slate-300"
                                                            />
                                                            {app.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className="text-[10px] font-bold text-slate-500 italic">
                                                        {format(
                                                            new Date(app.created_at),
                                                            'HH:mm, dd/MM/yyyy',
                                                            { locale: vi },
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    {getStatusBadge(app.status)}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 bg-slate-50 hover:bg-brand-primary hover:text-white text-slate-400 transition-all rounded-none"
                                                            onClick={() =>
                                                                router.push(
                                                                    `${PORTAL_ROUTES.cms.applications.list}/${app.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Eye size={14} />
                                                        </Button>

                                                        <a
                                                            href={app.cv_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Tải CV / Xem hồ sơ"
                                                            className="h-9 w-9 flex items-center justify-center bg-slate-50 hover:bg-brand-primary hover:text-white text-slate-400 transition-all rounded-none"
                                                        >
                                                            <FileDown size={14} />
                                                        </a>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-9 w-9 p-0 rounded-none hover:bg-slate-50"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="rounded-none w-56 p-2 shadow-xl border-slate-100"
                                                            >
                                                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
                                                                    Thao tác hồ sơ
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.push(
                                                                            `${PORTAL_ROUTES.cms.applications.list}/${app.id}`,
                                                                        )
                                                                    }
                                                                    className="text-[10px] font-black uppercase tracking-tight flex items-center gap-3 px-3 py-2 cursor-pointer"
                                                                >
                                                                    <Eye
                                                                        size={14}
                                                                        className="text-blue-500"
                                                                    />{' '}
                                                                    Xem chi tiết
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
                                                                    Cập nhật trạng thái
                                                                </DropdownMenuLabel>
                                                                {Object.entries(STATUS_CONFIG).map(
                                                                    ([key, config]) => (
                                                                        <DropdownMenuItem
                                                                            key={key}
                                                                            onClick={() =>
                                                                                handleUpdateStatus(
                                                                                    app.id,
                                                                                    key,
                                                                                )
                                                                            }
                                                                            className="text-[10px] font-black uppercase tracking-tight flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50"
                                                                        >
                                                                            <config.icon
                                                                                size={14}
                                                                                className={cn(
                                                                                    config.color.split(
                                                                                        ' ',
                                                                                    )[1],
                                                                                )}
                                                                            />
                                                                            {config.label}
                                                                        </DropdownMenuItem>
                                                                    ),
                                                                )}
                                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setItemToDelete(app);
                                                                        setDeleteDialogOpen(true);
                                                                    }}
                                                                    className="text-rose-600 flex items-center gap-3 text-[10px] font-black uppercase tracking-tight px-3 py-2 cursor-pointer hover:bg-rose-50"
                                                                >
                                                                    <Trash2 size={14} /> Xóa hồ sơ
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <TablePagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                    />
                </TabsContent>

                <TabsContent value="analytics" className="m-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <PieChartLabel
                            title="Phân bổ trạng thái"
                            description="Tỷ lệ hồ sơ trong quy trình"
                            data={statusChartData}
                            config={statusConfig}
                            dataKey="count"
                            nameKey="status"
                            footerTitle="Quy trình hiện tại"
                            footerDescription="Dựa trên 100% dữ liệu thực tế"
                            className="lg:col-span-1 shadow-sm border border-slate-100"
                        />
                        <AreaChartGradient
                            title="Biểu đồ tăng trưởng"
                            description="Số lượng hồ sơ theo thời gian"
                            data={trendData}
                            config={{
                                applications: { label: 'Hồ sơ', color: 'var(--brand-primary)' },
                            }}
                            dataKeys={['applications']}
                            xAxisKey="month"
                            footerTitle="Hiệu suất tuyển dụng"
                            footerDescription="Thống kê 6 tháng gần nhất"
                            className="lg:col-span-2 shadow-sm border border-slate-100"
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                loading={isDeleting}
                itemName={itemToDelete?.full_name || ''}
            />
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
