import { StorageKeys } from "@/constants/Storage"
import { UserResponseData } from "@/model/user"
import { useUserStore } from "@/store/user"
import { LocalStorage } from "@/utils/storage"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"


interface IUseAuth { 
  isLoggedIn: boolean;
  handleLogoutAccount: () => Promise<void>
} 

const useAuth = (): IUseAuth => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const { replace } = useRouter()

  const setToken = useUserStore(state => state.setToken)
  const setUser = useUserStore(state => state.setUser)
  const reset = useUserStore(state => state.reset)

  const handleGetDetails = async () => {
    const token = await LocalStorage.getItem(StorageKeys.TOKEN)
    const user = await LocalStorage.getObject<UserResponseData>(StorageKeys.USER)

    if(token) setToken(token)
    if(user) setUser(user)

    if(!token && !user) {
      setIsLoggedIn(false)
    }
    else {
      setIsLoggedIn(true)
    }
  }

  const handleLogoutAccount = async () => {
    await LocalStorage.deleteItem(StorageKeys.TOKEN)
    await LocalStorage.deleteItem(StorageKeys.USER)
    reset()
    replace('/login')
  }

  useEffect(() => {
    handleGetDetails()
  }, [])
  return { isLoggedIn, handleLogoutAccount }
}

export default useAuth
