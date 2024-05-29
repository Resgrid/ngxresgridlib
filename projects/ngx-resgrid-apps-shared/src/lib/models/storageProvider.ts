export interface IStorageProvider {
    read(key: string): Promise<string | null>;
    write(key: string, value: string): Promise<void>; 
    remove(key: string): Promise<void>; 
    clear(): Promise<void>;
}