import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { List, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats = {
    totalLists: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
} }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900 dark:to-purple-900 rounded-3xl">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">Welcome to Your Dashboard</h1>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Manage your tasks and lists with style!</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href={route('lists.index')}>
                            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                                <List className="h-5 w-5 mr-2" />
                                Lists
                            </Button>
                        </Link>
                        <Link href={route('tasks.index')}>
                            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Tasks
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900 rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                                Total Lists
                                <List className="h-6 w-6 text-cyan-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white">{stats.totalLists}</div>
                            <p className="text-xs text-cyan-100 mt-1">Active task lists</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-400 to-teal-500 dark:from-green-700 dark:to-teal-800 rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                                Total Tasks
                                <CheckCircle className="h-6 w-6 text-teal-200" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white">{stats.totalTasks}</div>
                            <p className="text-xs text-teal-100 mt-1">All tasks created</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-700 dark:to-orange-800 rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                                Pending Tasks
                                <Clock className="h-6 w-6 text-orange-200" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white">{stats.pendingTasks}</div>
                            <p className="text-xs text-orange-100 mt-1">Tasks to complete</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-700 dark:to-pink-800 rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                                Completed Tasks
                                <AlertCircle className="h-6 w-6 text-pink-200" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white">{stats.completedTasks}</div>
                            <p className="text-xs text-pink-100 mt-1">Tasks finished</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions and Activity */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-800 dark:to-blue-900 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-blue-800 dark:text-blue-200">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <Link href={route('lists.index')}>
                                    <Button variant="outline" className="w-full justify-start border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full py-3 transition-all duration-300">
                                        <List className="mr-2 h-5 w-5" />
                                        View All Lists
                                    </Button>
                                </Link>
                                <Link href={route('tasks.index')}>
                                    <Button variant="outline" className="w-full justify-start border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full py-3 transition-all duration-300">
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        View All Tasks
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-gradient-to-br from-pink-100 to-purple-200 dark:from-pink-800 dark:to-purple-900 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-200">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-pink-300 dark:bg-pink-600 p-3">
                                    <Plus className="h-5 w-5 text-pink-700 dark:text-pink-200" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">Get Started</p>
                                    <p className="text-xs text-purple-600 dark:text-purple-300">Create your first list or task to begin</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
