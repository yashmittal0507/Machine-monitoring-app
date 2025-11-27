import { Machine } from '../machines/[id]/types';
export default function ViewMode({ machine, getStatusColor }: { machine: Machine; getStatusColor: (status: string) => string }) {
    return (
        <div className="space-y-4">
            <div>
                <span className="text-sm font-medium text-gray-500">Status</span>
                <div className="mt-1">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(machine.status)}`}>
                        {machine.status}
                    </span>
                </div>
            </div>
            <div>
                <span className="text-sm font-medium text-gray-500">Temperature</span>
                <div className="mt-1 text-2xl font-bold text-gray-900">{machine.temperature}°C</div>
            </div>
            <div>
                <span className="text-sm font-medium text-gray-500">Energy Consumption</span>
                <div className="mt-1 text-2xl font-bold text-gray-900">{machine.energyConsumption} kWh</div>
            </div>
        </div>
    );
}
