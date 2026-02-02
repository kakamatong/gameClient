import { LobbySocketManager } from '../LobbySocketManager';
import { GameSocketManager } from '../GameSocketManager';

export class BaseModule {
    protected reqLobby(proto: {Name: string}, data: any, callback?: (data: any) => void): void {
        LobbySocketManager.instance.sendToServer(proto, data, callback);
    }

    protected reqGame(proto: {Name: string}, data: any, callback?: (data: any) => void): void {
        GameSocketManager.instance.sendToServer(proto, data, callback);
    }
}
