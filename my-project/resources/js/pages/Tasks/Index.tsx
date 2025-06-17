import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Calendar, List, CheckCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    list_id: number;
    list: {
        id: number;
        title: string;
    };
}

interface List {
    id: number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TasksIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(filters.filter as 'all' | 'completed' | 'pending');

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const { data, setData, post, put, processing, reset, delete: destroy } = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: task.list_id.toString(),
            is_completed: task.is_completed,
        });
        setIsOpen(true);
    };

    const handleDelete = (taskId: number) => {
        destroy(route('tasks.destroy', taskId));
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('tasks.index'), {
            search: searchTerm,
            filter: completionFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get(route('tasks.index'), {
            search: searchTerm,
            filter: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('tasks.index'), {
            page,
            search: searchTerm,
            filter: completionFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900 dark:to-purple-900 rounded-3xl">
                {/* Toast Notification */}
                {showToast && (
                    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl p-4 shadow-lg ${
                        toastType === 'success' ? 'bg-gradient-to-r from-green-400 to-teal-500' : 'bg-gradient-to-r from-rose-400 to-red-500'
                    } text-white animate-in fade-in slide-in-from-top-5`}>
                        {toastType === 'success' ? (
                            <CheckCircle2 className="h-6 w-6" />
                        ) : (
                            <XCircle className="h-6 w-6" />
                        )}
                        <span className="text-sm font-semibold">{toastMessage}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">Tasks</h1>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Manage your tasks with style</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                                <Plus className="h-5 w-5 mr-2" />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-800 dark:to-blue-900 rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-blue-800 dark:text-blue-200">{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-semibold text-blue-700 dark:text-blue-300">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        className="border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-2xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-semibold text-blue-700 dark:text-blue-300">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-2xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="list_id" className="text-sm font-semibold text-blue-700 dark:text-blue-300">List</Label>
                                    <Select value={data.list_id} onValueChange={(value) => setData('list_id', value)}>
                                        <SelectTrigger className="border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-2xl">
                                            <SelectValue placeholder="Select a list" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 rounded-2xl">
                                            {lists.map((list) => (
                                                <SelectItem key={list.id} value={list.id.toString()} className="text-blue-700 dark:text-blue-200">
                                                    {list.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due_date" className="text-sm font-semibold text-blue-700 dark:text-blue-300">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-2xl"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_completed"
                                        checked={data.is_completed}
                                        onChange={(e) => setData('is_completed', e.target.checked)}
                                        className="h-4 w-4 rounded border-blue-300 dark:border-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                    <Label htmlFor="is_completed" className="text-sm font-semibold text-blue-700 dark:text-blue-300">Completed</Label>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full py-3 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    {editingTask ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 dark:text-blue-300" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-2xl"
                        />
                    </form>
                    <Select value={completionFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[180px] border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-2xl">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 rounded-2xl">
                            <SelectItem value="all" className="text-blue-700 dark:text-blue-200">All Tasks</SelectItem>
                            <SelectItem value="completed" className="text-blue-700 dark:text-blue-200">Completed</SelectItem>
                            <SelectItem value="pending" className="text-blue-700 dark:text-blue-200">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tasks Table */}
                <div className="rounded-2xl border-none bg-gradient-to-br from-blue-400 to-cyan-500 dark:from-blue-700 dark:to-cyan-900 shadow-lg">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-800 dark:to-cyan-900">
                                <tr className="border-b border-blue-300 dark:border-blue-600 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-white">Title</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-white">Description</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-white">List</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-white">Due Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-white">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-semibold text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {tasks.data.map((task) => (
                                    <tr key={task.id} className="border-b border-blue-300 dark:border-blue-600 transition-all duration-300 hover:bg-blue-300/20 dark:hover:bg-blue-600/20">
                                        <td className="p-4 align-middle font-semibold text-white">{task.title}</td>
                                        <td className="p-4 align-middle max-w-[200px] truncate text-cyan-100">
                                            {task.description || 'No description'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2 text-cyan-100">
                                                <List className="h-4 w-4" />
                                                {task.list.title}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {task.due_date ? (
                                                <div className="flex items-center gap-2 text-cyan-100">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(task.due_date).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-cyan-100">No due date</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {task.is_completed ? (
                                                <div className="flex items-center gap-2 text-teal-200">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-orange-200">
                                                    <span>Pending</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(task)}
                                                    className="text-cyan-200 hover:text-cyan-100 hover:bg-blue-500/20"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(task.id)}
                                                    className="text-pink-200 hover:text-pink-100 hover:bg-pink-500/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tasks.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-cyan-100">
                                            No tasks found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-blue-600 dark:text-blue-300">
                        Showing {tasks.from} to {tasks.to} of {tasks.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tasks.current_page - 1)}
                            disabled={tasks.current_page === 1}
                            className="border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: tasks.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === tasks.current_page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(page)}
                                    className={`${
                                        page === tasks.current_page
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                            : 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-700'
                                    } rounded-full`}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tasks.current_page + 1)}
                            disabled={tasks.current_page === tasks.last_page}
                            className="border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
