// BroadcastChannel for real-time updates across tabs
class MenuBroadcastService {
    private channel: BroadcastChannel | null = null;
    private isClosed: boolean = false;

    constructor() {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            try {
                this.channel = new BroadcastChannel('menu-updates');
                this.isClosed = false;
            } catch (error) {
                console.warn('Failed to create BroadcastChannel:', error);
            }
        }
    }

    // Send update notification
    notifyUpdate(type: 'dish' | 'category', action: 'create' | 'update' | 'delete', id?: number) {
        if (this.channel && !this.isClosed) {
            try {
                this.channel.postMessage({
                    type,
                    action,
                    id,
                    timestamp: Date.now()
                });
            } catch (error) {
                // Channel might be closed, silently ignore
                console.warn('Failed to send broadcast message:', error);
            }
        }
    }

    // Listen for updates
    onUpdate(callback: (data: any) => void) {
        if (this.channel && !this.isClosed) {
            this.channel.onmessage = (event) => {
                callback(event.data);
            };
        }
    }

    // Cleanup
    close() {
        if (this.channel && !this.isClosed) {
            try {
                this.channel.close();
                this.isClosed = true;
            } catch (error) {
                console.warn('Failed to close BroadcastChannel:', error);
            }
        }
    }
}

export const menuBroadcast = new MenuBroadcastService();
