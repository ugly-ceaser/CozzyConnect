import { GRAY_COLOR, ORANGE_COLOR } from "@/constants/Colors";
import { useThemeColor } from "../others/Themed";
import { Pressable } from "react-native";
import Icon from "@expo/vector-icons/SimpleLineIcons"

interface TogglePasswordProp {
  toggle: () => void;
  isShowing: boolean;
}

const TogglePassword: React.FC<TogglePasswordProp> = ({ toggle, isShowing }) => {
  return (
    <Pressable hitSlop={10} onPress={toggle} style={{ padding: 15 }}>
      { isShowing ? (
        <Icon name="eye" color={ORANGE_COLOR} size={20} />
      ) : (
        <Icon name="eye" color={GRAY_COLOR} size={20} />
      ) }
  </Pressable>
  )
}

export default TogglePassword