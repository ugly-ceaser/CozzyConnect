import { useDrawerStore } from "@/store/drawer"
import React from "react"
import { Drawer } from "react-native-drawer-layout"
import DrawerContent from "../others/DrawerContent";

interface DrawerContainerProps {
  children: React.ReactNode;
}
const DrawerContainer: React.FC<DrawerContainerProps> = ({ children }) => {
  const { isOpen, closeDrawer, openDrawer } = useDrawerStore((state) => state)
  return (
    <Drawer
      open={isOpen}
      style={{ flex: 1 }}
      onOpen={openDrawer}
      onClose={closeDrawer}
      drawerType="slide"
      renderDrawerContent={() => <DrawerContent onClose={closeDrawer} />}
    >
      {children}
    </Drawer>
  )
}

export default DrawerContainer