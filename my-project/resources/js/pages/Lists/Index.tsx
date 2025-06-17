import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

interface List {
    id: number;
    title: string;
    description: string | null;
    tasks_count?: number;
}

interface Props {
    lists: List[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists',
    },
];

export default function ListsIndex({ lists, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingList) {
            put(route('lists.update', editingList.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingList(null);
                },
            });
        } else {
            post(route('lists.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (list: List) => {
        setEditingList(list);
        setData({
            title: list.title,
            description: list.description || '',
        });
        setIsOpen(true);
    };

    const handleDelete = (listId: number) => {
        destroy(route('lists.destroy', listId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lists" />
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">Your Task Lists</h1>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Organize and manage your tasks with style</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                                <Plus className="h-5 w-5 mr-2" />
                                Add New List
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-800 dark:to-blue-900 rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-blue-800 dark:text-blue-200">
                                    {editingList ? 'Edit List' : 'Create New List'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-semibold text-blue-700 dark:text-blue-300">List Title</Label>
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
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full py-3 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    {editingList ? 'Update List' : 'Create List'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Lists Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lists.map((list) => (
                        <Card
                            key={list.id}
                            className="bg-gradient-to-br from-blue-400 to-cyan-500 dark:from-blue-700 dark:to-cyan-900 border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-lg font-semibold text-white">{list.title}</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(list)}
                                        className="text-cyan-200 hover:text-cyan-100"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(list.id)}
                                        className="text-pink-200 hover:text-pink-100"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-cyan-100 line-clamp-2">
                                    {list.description || 'No description provided'}
                                </p>
                                {list.tasks_count !== undefined && (
                                    <p className="text-sm text-cyan-200 mt-2 font-semibold">
                                        {list.tasks_count} {list.tasks_count === 1 ? 'Task' : 'Tasks'}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
