export interface redisDb {
    host: string;
    port: number;
    password?: string;
    family: number;
}

export interface mongoDb {
    uri: string;
}