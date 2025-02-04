import React from "react"
import { Box, HStack, Text, useThemeColor } from "./Themed"
import Icon from "@expo/vector-icons/Feather"
import Styles from "@/constants/Styles"
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontFamily } from "@/constants/Enums";
import { RED_COLOR } from "@/constants/Colors";
import { useRouter } from "expo-router";
import useBoolean from "@/hooks/useBoolean";
import CustomModal from "../shared/CustomModal";
import CustomButton from "../shared/CustomButton";
import useAuth from "@/hooks/useAuth";

interface DrawerContentProps {
  onClose: () => void;
}

type DrawerItem = { 
  name: string; 
  icon: React.ComponentProps<typeof Icon>['name']; 
  onPress: () => void 
  disabled?: boolean;
}
const DrawerContent: React.FC<DrawerContentProps> = ({ onClose }) => {
  const textColor = useThemeColor({}, "text")
  const router = useRouter()
  const { isOpen, close, open } = useBoolean()
  const { handleLogoutAccount } = useAuth()

  const handleLogout = async () => {
    onClose(); 
    close()
    await handleLogoutAccount()
  }

  const drawerItems: DrawerItem[] = [
    { name: "Profile", icon: "user", onPress: () => router.push('/profile/') },
    // { name: "Verification", icon: "user", onPress: () => router.push('/kyc/') },
  { name: "Verification", icon: "user", onPress: () => router.push('/kyc/form') },
    { name: "Upload", icon: "upload", onPress: () => router.push('/upload') },
    { name: "Notification", icon: "bell", onPress: () => router.push('/notification')},
    { name: "Help & Support", icon: "help-circle", onPress: () => router.push('/help')},
    { name: "Terms and Policy", icon: "alert-circle", onPress: () => router.push('/terms')},
    { name: "Report a problem", icon: "flag", onPress: () => router.push('/report') },
  ]
  return (
    <Box style={[Styles.container]}>
      <HStack style={{ justifyContent: 'flex-end', marginBottom: 10, marginTop: 30, paddingVertical: 20 }}>
        <TouchableOpacity onPress={onClose} hitSlop={20}>
          <Icon name="x" color={textColor} size={24} />
        </TouchableOpacity>
      </HStack>
      <Box style={{ gap: 10 }}> 
        {drawerItems.map(({ icon, name, onPress, disabled }) => (
          <TouchableOpacity key={name} onPress={onPress} disabled={disabled} 
          style={{ opacity: disabled ? .3 : 1 }}
          >
            <HStack style={{ paddingVertical: 16, gap: 20, alignItems: "center" }}>
              <Icon name={icon} size={24} color={textColor} />
              <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 18 }}>{name}</Text>
            </HStack>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={open}>
          <HStack style={{ paddingVertical: 10, gap: 20, alignItems: "center" }}>
            <Icon name={"log-out"} size={24} color={RED_COLOR}  />
            <Text style={{ fontFamily: FontFamily.URBANIST_SEMIBOLD, fontSize: 18, color: RED_COLOR }}>Logout</Text>
          </HStack>
        </TouchableOpacity>
      </Box>

      <CustomModal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={close}
      >
        <Text style={{ fontFamily: FontFamily.URBANIST_BOLD, fontSize: 18 }}>Are you sure you want to log out?</Text>
        <HStack style={{ width: '100%', marginTop: 20, alignItems: 'center', marginBottom: 20, gap: 20 }}>
          <CustomButton style={{ width: 150 }} text="No" size="sm" onPress={close} />
          <CustomButton style={{ width: 150 }} text="Yes" size="sm" scheme="red" onPress={handleLogout} />
        </HStack>
      </CustomModal>
    </Box>
  )
}

export default DrawerContent