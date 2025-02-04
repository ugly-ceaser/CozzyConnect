import { Box, Text, VStack } from "@/components/others/Themed"
import AppBar from "@/components/shared/AppBar"
import CustomButton from "@/components/shared/CustomButton";
import { GRAY_COLOR, SUCCESS_COLOR } from "@/constants/Colors";
import { FontFamily } from "@/constants/Enums";
import Styles from "@/constants/Styles";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet } from "react-native";
// import { Camera } from 'expo-camera';
// import * as FaceDetector from 'expo-face-detector';


enum FACIAL_RECOGNITION_STEP {
  FRONT_FACE = 'FRONT_FACE',
  LEFT_SIDE = 'LEFT_SIDE',
  RIGHT_SIDE = 'RIGHT_SIDE',
}

interface VerificationProps { }
const Verification: React.FC<VerificationProps> = ({ }) => {
  const [step, setStep] = useState<FACIAL_RECOGNITION_STEP>(FACIAL_RECOGNITION_STEP.FRONT_FACE)
  const router = useRouter()

  const handleUpdateSteps = () => {
    if(step === FACIAL_RECOGNITION_STEP.FRONT_FACE) {
      setStep(FACIAL_RECOGNITION_STEP.LEFT_SIDE)
    }
    else if(step === FACIAL_RECOGNITION_STEP.LEFT_SIDE) {
      setStep(FACIAL_RECOGNITION_STEP.RIGHT_SIDE)
    }
    else if(step === FACIAL_RECOGNITION_STEP.RIGHT_SIDE) {
      router.replace('/kyc/form')
    }
  }


  useEffect(() => {
    const interval = setInterval(handleUpdateSteps, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [step])

  if (null) {
    return (
      <>
        <Stack.Screen
          options={{
            header: () => <AppBar caseInsensitive title="KYC Verification" />
          }}
        />
        <VStack style={Styles.container}>
          <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR, textAlign: "center" }}>Requesting for camera permission</Text>
        </VStack>
      </>
    ) 
  }
  

  if (undefined) {
    return (
      <>
        <Stack.Screen
          options={{
            header: () => <AppBar caseInsensitive title="KYC Verification" />
          }}
        />
        <VStack style={Styles.container}>
          <Text style={{ fontSize: 16, fontFamily: FontFamily.URBANIST_REGULAR, textAlign: "center" }}>Please grant camera access to continue</Text>
          <CustomButton
            text={'Request permission'} 
            style={{
              height: 45, width: 90,
            }}
            size="sm"
          />
        </VStack>
      </>
    ) 
  }



  return (
    <>
      <Stack.Screen 
        options={{  
          header: () => <AppBar caseInsensitive title="KYC Verification" />
        }}
      />

      <Box style={[Styles.container, { alignItems: 'center' }]}>
        {/* <Camera
          // other props
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 100,
            tracking: true,
          }}
        /> */}
        
        { (step === FACIAL_RECOGNITION_STEP.FRONT_FACE) && (
          <Box style={{ paddingVertical: 12 }}>
            <Box style={[styles.cameraBox, styles.success, { marginBottom: 15 }]}>
            
            </Box>
            <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_REGULAR, textAlign: "center" }}>Position your face inside the circle</Text>
          </Box>
        ) }
        
        { (step === FACIAL_RECOGNITION_STEP.RIGHT_SIDE) && (
          <Box style={{ paddingVertical: 12 }}>
            <Box style={[styles.cameraBox, styles.success, { marginBottom: 15 }]}>
            
            </Box>
            <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_REGULAR, textAlign: "center" }}>Turn Right</Text>
          </Box>
        ) }
        
        {( step === FACIAL_RECOGNITION_STEP.LEFT_SIDE) && (
          <Box style={{ paddingVertical: 12 }}>
            <Box style={[styles.cameraBox, styles.success, { marginBottom: 15 }]}>
            
            </Box>
            <Text style={{ fontSize: 20, fontFamily: FontFamily.URBANIST_REGULAR, textAlign: "center" }}>Turn Left</Text>
          </Box>
        ) }
      </Box>
    </>
  )
}


const styles = StyleSheet.create({
  cameraBox: {
    width: 270,
    height: 450,
    borderRadius: 3000,
    borderColor: GRAY_COLOR,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  // cameraBox: {
  //   width: '80%',
  //   height: 300,
  // },
  success: {
    borderColor: SUCCESS_COLOR
  },
  cameraStyle: {
    width: 280,
    height: 400,
    backgroundColor: 'red',
    borderRadius: 100,
  }
})

export default Verification