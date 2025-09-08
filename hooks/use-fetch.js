"use client"
import { useState } from "react"
import { toast } from "sonner"


const useFetch = (cb) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
    const fn = async (...args) => {
        setLoading(true)
        setError(null)

        try {
            const result = await cb(...args)
            setData(result)
            return result

        }
        catch (err) {
            setError(err)
            toast.error(err.message)
        }
        finally {
            setLoading(false)
        }   
    }
        return {data, loading, error, fn, setData}
}

export default useFetch
