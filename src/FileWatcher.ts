import * as fs from 'fs';

/**
 * Manages file watching for documentation files
 * Automatically refreshes the docs panel when markdown files change
 *
 * Uses Node.js fs.watch for efficient file change detection
 * Includes debouncing to prevent excessive updates
 */
export class FileWatcher {
    private watcher: fs.FSWatcher | undefined;
    private currentFilePath: string | undefined;
    private debounceTimer: NodeJS.Timeout | undefined;

    /**
     * Watches a file for changes
     * Automatically disposes previous watcher if watching different file
     */
    public watchFile(filePath: string, onChange: () => void): void {
        // Skip if already watching this file
        if (this.currentFilePath === filePath && this.watcher) {
            return;
        }

        // Clean up existing watcher
        this.dispose();

        try {
            this.watcher = fs.watch(filePath, (eventType) => {
                if (eventType === 'change') {
                    // Debounce to handle rapid successive saves
                    this.debounce(() => {
                        onChange();
                    }, 250);
                }
            });

            this.currentFilePath = filePath;
            console.log(`File watcher active: ${filePath}`);
        } catch (error) {
            console.error(`Failed to watch file ${filePath}:`, error);
        }
    }

    /**
     * Debounces function calls to prevent excessive updates
     */
    private debounce(func: () => void, delay: number): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            func();
            this.debounceTimer = undefined;
        }, delay);
    }

    /**
     * Disposes the file watcher
     */
    public dispose(): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = undefined;
        }

        if (this.watcher) {
            this.watcher.close();
            this.watcher = undefined;
            this.currentFilePath = undefined;
            console.log('File watcher disposed');
        }
    }
}
