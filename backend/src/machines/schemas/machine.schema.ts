import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Machine {
    @Prop({ required: true, unique: true })
    id: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    temperature: number;

    @Prop({ required: true })
    energyConsumption: number;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
