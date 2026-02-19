'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Activity, AlertCircle } from 'lucide-react'

// Define the expected response shape from Core
interface HealthResponse {
    data: string
    meta: any
    error: null | string
}

const fetchHealth = async (): Promise<HealthResponse> => {
    const { data } = await axios.get('http://localhost:3001/api/health')
    return data
}

export function HealthCheck() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['health'],
        queryFn: fetchHealth,
        retry: false, // Don't retry indefinitely for this demo
    })

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-yellow-500">
                <Activity className="h-4 w-4 animate-pulse" />
                <span>Connecting to Core...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>Core Disconnected</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2 text-green-500">
            <Activity className="h-4 w-4" />
            <span>{data?.data || 'Core Online'}</span>
        </div>
    )
}
