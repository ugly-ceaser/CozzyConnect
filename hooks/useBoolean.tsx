import { useState } from "react"


interface IuseBoolean { 
  close: () => void;
  open: () => void;
  toggle: () => void;
  isOpen: boolean;
} 

const useBoolean = (state: boolean = false): IuseBoolean => {
  const [isOpen, setIsOpen] = useState<boolean>(state)

  const toggle = () => setIsOpen((prev) => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { close, open, toggle, isOpen }
}

export default useBoolean
