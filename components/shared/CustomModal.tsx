import { DEFAULT_BORDER_RADIUS, DEFAULT_SCREEN_PAD } from "@/constants/Variables"
import React from "react"
import { Modal, ModalProps, StyleSheet, View, ViewStyle } from "react-native"
import { Box } from "../others/Themed"

interface CustomModalProps extends ModalProps { 
  innerWrapperStyles?: ViewStyle;
}
const CustomModal: React.FC<CustomModalProps> = ({children, innerWrapperStyles, ...props}) => {
  return (
    <Modal {...props}>
      <View style={styles.centeredView}>
        <Box style={[styles.modalView, innerWrapperStyles]}>
          { children }
        </Box>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,.3)",
    paddingHorizontal: DEFAULT_SCREEN_PAD
  },
  modalView: {
    width: '100%',
    borderRadius: DEFAULT_BORDER_RADIUS,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default CustomModal