import  { Button, View } from "react-native";
import  { Camera, 
          useFrameProcessor, 
          useCameraDevice, 
          useCameraPermission
        } from "react-native-vision-camera";
import { useFaceLandmarkDetection } from "react-native-mediapipe";

import { useRunOnJS } from "react-native-worklets-core";

import GazeDot from "./components/GazeDot";
import { useState } from "react";

export default function Gazer( {
    gazeAction = (gazeData, elapsedTime) => {}, 
    isPaused = false, 
    showGazeDot = true, 
    storePastPoints = true,
    cameraType = 'front'
}) {
    //Vision Camera
    const device = useCameraDevice(cameraType);
    const { hasPermission, requestPermission } = useCameraPermission();
    const jsGazeAction = useRunOnJS(gazeAction);

    const callbacks = {
        onResults: (results) => {
            console.log('Face Landmarking results:', results);
        },
        onError: (error) => {
            console.error('Face Landmarking error:', error);
        },
    };
    
    let test = useFaceLandmarkDetection(callbacks, 'LIVE_STREAM', 'face_landmarking.task', {
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        shouldOutputSegmentationMasks: false,
        delegate: 'GPU',
        mirrorMode: 'mirror-front-only',
        forceOutputOrientation: 'portrait',
        forceCameraOrientation: 'portrait',
        fpsMode: 30
    });

    test.cameraDeviceChangeHandler()

    let eyetracker = useFrameProcessor((frame) => {
        'worklet';

        jsGazeAction({x: 1, y: 2, data: "Testing"}, 1000);
    }, [gazeAction]);

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
                onLayout={test.cameraViewLayoutChangeHandler}
                frameProcessor={eyetracker}
                frameProcessorFps={test.fpsMode}
                isActive={!isPaused}
            /> :
            <Text>Camera Device not loaded...</Text>
            }
            {showGazeDot && <GazeDot x={xCoord} y={yCoord} radius={10}/>}
        </View>
    );
}