import { handleGetUser } from "@/api/user"
import { UserResponseData } from "@/model/user"
import { useEffect, useState } from "react"
import useBoolean from "./useBoolean"
import { useUserStore } from "@/store/user";


interface IuseFetchUser { 
  error: string;
  isLoadingUser: boolean;
  fetchUserData: (accessToken: string) => Promise<UserResponseData | null>;
}

const useFetchUser = (): IuseFetchUser => {
  const { isOpen: isLoadingUser, close, open } = useBoolean()
  const [error, setError] = useState('')
  const { token, user,  setUser } = useUserStore()

  const fetchUserData = async (accessToken: string) => {
    try {
      open()
      const userData = await handleGetUser(accessToken)
      if (!userData?.status) throw new Error(userData.message)
      setUser({...user, ...userData.data} as UserResponseData, true)
      return userData.data
    }
    catch(error: any) {
      setError(error.message)
    }
    finally {
      close()
    }
    return null
  }

  useEffect(() => {
    if(!token) return
    fetchUserData(token)
  }, [])

  
  return { isLoadingUser, fetchUserData, error }
}

export default useFetchUser
