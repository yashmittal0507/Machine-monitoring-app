import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for now, configure strictly in production
    },
})
export class MachinesGateway {
    @WebSocketServer()
    server: Server;

    broadcastMachineUpdate(machine: any) {
        this.server.emit('machineUpdates', machine);
    }
}
