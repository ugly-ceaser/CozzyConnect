import { useEffect, useState } from "react"
import { Keyboard } from "react-native"


interface IuseKeyboard { 
  closeKeyboard: () => void;
  isKeyboardShowing: boolean;
} 

const useKeyboard = (): IuseKeyboard => {
  const [isKeyboardShowing, setIsKeyboardShowing] = useState<boolean>(false)

  const closeKeyboard = () => {
    if(!isKeyboardShowing) return
    Keyboard.dismiss()
  }

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setIsKeyboardShowing(true))
    Keyboard.addListener("keyboardDidHide", () => setIsKeyboardShowing(false))
    return () =>{ 
      Keyboard.removeAllListeners("keyboardDidShow")
      Keyboard.removeAllListeners("keyboardDidHide")
    }
  }, [])

  return{ closeKeyboard, isKeyboardShowing }
}

export default useKeyboard
