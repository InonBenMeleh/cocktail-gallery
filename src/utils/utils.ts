type DebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): DebouncedFunction<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export async function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(blob);
    });
}