export default function EditMode({
    editedStatus,
    setEditedStatus,
    editedEnergyConsumption,
    setEditedEnergyConsumption,
    temperature
}: {
    editedStatus: string;
    setEditedStatus: (status: string) => void;
    editedEnergyConsumption: number;
    setEditedEnergyConsumption: (energy: number) => void;
    temperature: number;
}) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="Running">Running</option>
                    <option value="Idle">Idle</option>
                    <option value="Stopped">Stopped</option>
                </select>
            </div>
            <div>
                <span className="text-sm font-medium text-gray-500">Temperature</span>
                <div className="mt-1 text-2xl font-bold text-gray-900">{temperature}°C</div>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">Energy Consumption</label>
                <input
                    type="number"
                    value={editedEnergyConsumption}
                    onChange={(e) => setEditedEnergyConsumption(Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
        </div>
    );
}