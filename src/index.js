import  { Button, View } from "react-native";
import  { Camera, 
          useCameraDevice, 
          useCameraPermission
        } from "react-native-vision-camera";

import { useFaceLandmarkDetection, Delegate, RunningMode } from "react-native-mediapipe";

import GazeDot from "./components/GazeDot";
import { useState } from "react";

export default function Gazer( {
    gazeAction = (gazeData, elapsedTime) => {}, 
    isPaused = false, 
    showGazeDot = true, 
    cameraType = 'front'
}) {
    //Vision Camera
    const device = useCameraDevice(cameraType);
    const { hasPermission, requestPermission } = useCameraPermission();

    const callbacks = {
        onResults: (results) => {
            console.log('Face Landmarking results:', results);
        },
        onError: (error) => {
            console.error('Face Landmarking error:', error);
        },
    };
    
    const eyetracker = useFaceLandmarkDetection(
        callbacks.onResults,
        callbacks.onError, 
        RunningMode.LIVE_STREAM, 
        'face_landmarking.task', 
        {
            numFaces: 1,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
            //shouldOutputSegmentationMasks: false,
            delegate: Delegate.GPU,
            mirrorMode: 'mirror-front-only',
            //forceOutputOrientation: 'portrait',
            //forceCameraOrientation: 'portrait'
    });

    //Gaze Dot Location
    const [ xCoord, setX ] = useState(0);
    const [ yCoord, setY ] = useState(0); 

    if (!hasPermission)
        return <Button title="Get Perms" onPress={requestPermission}></Button>
    
    return (
        <View>
            { (device) ? 
            <Camera 
                device={device}
                onLayout={eyetracker.cameraViewLayoutChangeHandler}
                frameProcessor={eyetracker.frameProcessor}
                frameProcessorFps={30}
                isActive={!isPaused}
            /> :
            <Text>Camera Device not loaded...</Text>
            }
            {showGazeDot && <GazeDot x={xCoord} y={yCoord} radius={10}/>}
        </View>
    );
}