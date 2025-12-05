// BroadcastChannel for real-time updates across tabs
class MenuBroadcastService {
    private channel: BroadcastChannel | null = null;

    constructor() {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            this.channel = new BroadcastChannel('menu-updates');
        }
    }

    // Send update notification
    notifyUpdate(type: 'dish' | 'category', action: 'create' | 'update' | 'delete', id?: number) {
        if (this.channel) {
            this.channel.postMessage({
                type,
                action,
                id,
                timestamp: Date.now()
            });
        }
    }

    // Listen for updates
    onUpdate(callback: (data: any) => void) {
        if (this.channel) {
            this.channel.onmessage = (event) => {
                callback(event.data);
            };
        }
    }

    // Cleanup
    close() {
        if (this.channel) {
            this.channel.close();
        }
    }
}

export const menuBroadcast = new MenuBroadcastService();
