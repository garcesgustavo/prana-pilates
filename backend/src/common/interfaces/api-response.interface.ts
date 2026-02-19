
export interface ApiResponse<T> {
    data: T;
    meta: {
        timestamp: string;
        path?: string;
        [key: string]: any;
    };
    error: any;
}
