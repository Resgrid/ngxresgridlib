export interface ICacheProvider {
    get(key: string): Promise<string>;
    put(key: string, expiresOn: Date, data: string): Promise<void>; 
    delete(key: string): Promise<void>; 
}