'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../utils/api';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { useSocket } from '../hooks/useSocket';

interface Machine {
    id: number;
    name: string;
    status: string;
    temperature: number;
    energyConsumption: number;
}

export default function DashboardPage() {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const socket = useSocket();
    useIdleTimeout(600);

    useEffect(() => {
        if (socket) {
            socket.on('machineUpdates', (updatedMachine: Machine) => {
                setMachines((prevMachines) =>
                    prevMachines.map((m) => (m.id === updatedMachine.id ? updatedMachine : m))
                );
            });
        }
    }, [socket]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        fetchMachines();
    }, [router]);

    const fetchMachines = async () => {
        try {
            const data = await apiRequest('/machines');
            setMachines(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running':
                return 'bg-green-100 text-green-800';
            case 'idle':
                return 'bg-yellow-100 text-yellow-800';
            case 'stopped':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Machine Monitor Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Machine Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Temperature (°C)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Energy Consumption (kWh)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {machines.map((machine) => (
                                <tr
                                    key={machine.id}
                                    onClick={() => router.push(`/machines/${machine.id}`)}
                                    className="cursor-pointer transition-colors hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        {machine.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(machine.status)}`}>
                                            {machine.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                        {machine.temperature}°C
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                        {machine.energyConsumption} kWh
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
