'use client';

import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ViewMode from '../../components/MachineViewMode';
import EditMode from '../../components/MachineEditMode';
import { useMachineDetails } from '../../hooks/useMachineDetails';
import { useIdleTimeout } from '../../hooks/useIdleTimeout';

export default function MachineDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const {
        machine,
        loading,
        error,
        isEditing,
        editedStatus,
        setEditedStatus,
        editedEnergyConsumption,
        setEditedEnergyConsumption,
        updateLoading,
        handleEdit,
        handleCancel,
        handleUpdate,
        router,
    } = useMachineDetails(id);

    useIdleTimeout(600);

    const generateTemperatureData = (currentTemp: number) => {
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const variation = Math.random() * 10 - 5; // Random variation ±5°C
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                temperature: Math.round(currentTemp + variation),
            });
        }

        return data;
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

    if (error || !machine) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="mb-4 text-xl text-red-600">{error || 'Machine not found'}</div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const temperatureData = generateTemperatureData(machine.temperature);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="cursor-pointer mb-6 flex items-center text-blue-600 transition-colors hover:text-blue-700"
                >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                <h1 className="mb-8 text-3xl font-bold text-gray-900">{machine.name}</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Machine Details</h2>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="rounded-lg bg-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={updateLoading}
                                        className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {updateLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        {isEditing ? (
                            <EditMode
                                editedStatus={editedStatus}
                                setEditedStatus={setEditedStatus}
                                editedEnergyConsumption={editedEnergyConsumption}
                                setEditedEnergyConsumption={setEditedEnergyConsumption}
                                temperature={machine.temperature}
                            />
                        ) : (
                            <ViewMode machine={machine} getStatusColor={getStatusColor} />
                        )}
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Temperature Trend (Last 7 Days)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={temperatureData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} name="Temperature" />
                            </LineChart>
                        </ResponsiveContainer>
                        <p className="mt-4 text-xs text-gray-500">
                            * This chart shows simulated historical data for demonstration purposes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
