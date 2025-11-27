import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Machine } from '../machines/[id]/types';
import { apiRequest } from '../utils/api';
import { useSocket } from './useSocket';

export function useMachineDetails(id: string) {
    const [machine, setMachine] = useState<Machine | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedStatus, setEditedStatus] = useState('');
    const [editedEnergyConsumption, setEditedEnergyConsumption] = useState(0);
    const [updateLoading, setUpdateLoading] = useState(false);
    const router = useRouter();
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('machineUpdates', (updatedMachine: Machine) => {
                if (updatedMachine.id === Number(id)) {
                    setMachine(updatedMachine);
                    if (!isEditing) {
                        setEditedStatus(updatedMachine.status);
                        setEditedEnergyConsumption(updatedMachine.energyConsumption);
                    }
                }
            });
        }
    }, [socket, id, isEditing]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        fetchMachine();
    }, [id, router]);

    const fetchMachine = async () => {
        try {
            const data = await apiRequest(`/machines/${id}`);
            setMachine(data);
            setEditedStatus(data.status);
            setEditedEnergyConsumption(data.energyConsumption);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (machine) {
            setEditedStatus(machine.status);
            setEditedEnergyConsumption(machine.energyConsumption);
        }
    };

    const handleUpdate = async () => {
        setUpdateLoading(true);
        setError('');

        try {
            const data = await apiRequest(`/machines/${id}/update`, {
                method: 'POST',
                body: JSON.stringify({
                    status: editedStatus,
                    energyConsumption: editedEnergyConsumption,
                }),
            });

            setMachine(data);
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update machine');
        } finally {
            setUpdateLoading(false);
        }
    };

    return {
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
    };
}
