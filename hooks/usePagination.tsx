/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@backpackapp-io/react-native-toast";
import { useEffect, useState } from "react"
import useAuth from "./useAuth";
import { log } from "@/utils/helpers";
import useBoolean from "./useBoolean";


interface IusePagination { 
  isLoading: boolean;
  isRefreshing: boolean;
  error: string;
  page: number;
  perPage: number;
  totalContents: number;
  data: any[];
  handlePerPageChange: (arg: number) => void;
  handlePageChange: (arg: number) => void;
  handleRefresh: () => Promise<void>;
  handleFetchRequest: (page: number, perPage: number) => Promise<void>;
  handleFilterRequest: (search: string) => Promise<void>;
} 

const usePagination = (func: (page: number, __perPage: number, filter?: string) => Promise<any>, _perPage: number = 5): IusePagination => {
  const [page, setPage] = useState<number>(1)
  const [totalContents, setTotalContents] = useState<number>(0)
  const [perPage, setPerPage] = useState<any>(_perPage)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  const { handleLogoutAccount } = useAuth()
  const { isOpen: isRefreshing, open: openRefreshing, close: closeRefreshing } = useBoolean()


  const handleFilterRequest = async (filter: string) => {
    try {
      setError('')
      setIsLoading(true)
      const result = await func(page, perPage, filter) as any
      if(!result?.status && result.shouldLogout) {
        toast.error("Session expired, please login", {
          duration: 3000
        })
        handleLogoutAccount()
        return
      }

      if(!("data" in result)) throw new Error(result?.message)
      setPage(result?.data?.page || 1)
      setData(result?.data.items ?? [])
      setTotalContents(result?.data.total || 0)
    }
    catch(error: any) {
      setError('Failed to fetch content')
      log("ERROR: ", error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleFetchRequest = async (page: number, perPage: number) => {
    try {
      setError('')
      setIsLoading(true)
      const result = await func(page, perPage) as any
      // log("DATA FETCH:", result)
      
      if(!result) return 
      if(!result?.status && result.shouldLogout) {
        toast("Session expired, please login", {
          duration: 3000
        })
        await handleLogoutAccount()
        return
      }
      log("DATA - REV", result)
      if(!("data" in result)) throw new Error(result?.message)
      log(result?.data.items)
      setPage(result?.data?.page || 1)
      setData(result?.data.items ?? [])
      setTotalContents(result?.data.total || 0)
    }
    catch(error: any) {
      log("ERROR: ", error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    openRefreshing()
    await handleFetchRequest(page, perPage)
    closeRefreshing()
  }

  const handlePageChange = (no: number) => {
    setPage(no)
    handleFetchRequest(no, perPage)
  }

  const handlePerPageChange = (no: number) => {
    setPerPage(no)
    handleFetchRequest(0, no)
  }

  useEffect(() => {
    handleFetchRequest(page, perPage)
  }, [])

  return { isLoading, isRefreshing, error, page, totalContents, perPage, data, handleRefresh, handlePageChange, handlePerPageChange, handleFetchRequest, handleFilterRequest }
}

export default usePagination