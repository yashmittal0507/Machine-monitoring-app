import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateMachineDetails } from './dto/update-machine.dto';
import { MachinesGateway } from './machines.gateway';
import { Machine } from './schemas/machine.schema';
import { initialMachines } from './data/initial-machines';

@Injectable()
export class MachinesService implements OnModuleInit {
    constructor(
        @InjectModel(Machine.name) private machineModel: Model<Machine>,
        private machinesGateway: MachinesGateway
    ) { }

    async onModuleInit() {
        const count = await this.machineModel.countDocuments();
        if (count === 0) {
            await this.machineModel.insertMany(initialMachines);
        }
        setInterval(() => {
            this.generateRandomTemperatures();
        }, 5000);
    }

    private async generateRandomTemperatures() {
        const machines = await this.machineModel.find();

        for (const machine of machines) {
            if (machine.status !== 'Stopped') {
                const change = Math.floor(Math.random() * 5) - 2;
                let newTemp = machine.temperature + change;
                if (newTemp < 20) newTemp = 20;
                if (newTemp > 120) newTemp = 120;

                machine.temperature = newTemp;
                await machine.save();


                this.machinesGateway.broadcastMachineUpdate(machine);
            }
        }
    }

    async getAllMachines() {
        return this.machineModel.find().sort({ id: 1 }).exec();
    }

    async getMachineById(id: number) {
        const machine = await this.machineModel.findOne({ id }).exec();
        if (!machine) {
            throw new NotFoundException(`Machine with ID ${id} not found`);
        }
        return machine;
    }

    async updateMachineDetails(id: number, updateMachineDetails: UpdateMachineDetails) {
        const machine = await this.machineModel.findOneAndUpdate(
            { id },
            { $set: updateMachineDetails },
            { new: true }
        ).exec();

        if (!machine) {
            throw new NotFoundException(`Machine with ID ${id} not found`);
        }

        this.machinesGateway.broadcastMachineUpdate(machine);
        return machine;
    }
}
