import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { UpdateMachineDetails } from './dto/update-machine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
    constructor(private readonly machinesService: MachinesService) { }

    @Get()
    getAllMachines() {
        return this.machinesService.getAllMachines();
    }

    @Get(':id')
    getMachineById(@Param('id', ParseIntPipe) id: number) {
        return this.machinesService.getMachineById(id);
    }

    @Post(':id/update')
    updateMachineDetails(@Param('id', ParseIntPipe) id: number, @Body() updateMachineDetails: UpdateMachineDetails) {
        return this.machinesService.updateMachineDetails(id, updateMachineDetails);
    }
}
