export interface ICacheProvider {
    initialize(): Promise<void>;
    get(key: string): Promise<string>;
    put(key: string, expiresOn: Date, data: string): Promise<void>; 
    delete(key: string): Promise<void>; 
}