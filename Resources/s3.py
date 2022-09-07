from re import L
import cv2 as cv 
import sys 
import imutils
import argparse
import time 
from imutils.video import VideoStream
import boto3
from pprint import pprint
import pandas as pd

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table("juu-prototype")

ap = argparse.ArgumentParser()
ap.add_argument("-t", "--type", type = str, default = "DICT_ARUCO_ORIGINAL", help = "type of aruco tag to detect")
args = vars(ap.parse_args())

ARUCO_DICT = {
	"DICT_4X4_50": cv.aruco.DICT_4X4_50,
	"DICT_4X4_100": cv.aruco.DICT_4X4_100,
	"DICT_4X4_250": cv.aruco.DICT_4X4_250,
	"DICT_4X4_1000": cv.aruco.DICT_4X4_1000,
	"DICT_5X5_50": cv.aruco.DICT_5X5_50,
	"DICT_5X5_100": cv.aruco.DICT_5X5_100,
	"DICT_5X5_250": cv.aruco.DICT_5X5_250,
	"DICT_5X5_1000": cv.aruco.DICT_5X5_1000,
	"DICT_6X6_50": cv.aruco.DICT_6X6_50,
	"DICT_6X6_100": cv.aruco.DICT_6X6_100,
	"DICT_6X6_250": cv.aruco.DICT_6X6_250,
	"DICT_6X6_1000": cv.aruco.DICT_6X6_1000,
	"DICT_7X7_50": cv.aruco.DICT_7X7_50,
	"DICT_7X7_100": cv.aruco.DICT_7X7_100,
	"DICT_7X7_250": cv.aruco.DICT_7X7_250,
	"DICT_7X7_1000": cv.aruco.DICT_7X7_1000,
	"DICT_ARUCO_ORIGINAL": cv.aruco.DICT_ARUCO_ORIGINAL,
	"DICT_APRILTAG_16h5": cv.aruco.DICT_APRILTAG_16h5,
	"DICT_APRILTAG_25h9": cv.aruco.DICT_APRILTAG_25h9,
	"DICT_APRILTAG_36h10": cv.aruco.DICT_APRILTAG_36h10,
	"DICT_APRILTAG_36h11": cv.aruco.DICT_APRILTAG_36h11
}

if ARUCO_DICT.get(args["type"], None) is None:
    print("[INFO] ArUCo tag of '{}' is not supported".format(args["type"]))
    sys.exit(0)

#loading the aruco dictionary and grabbing of the params

print("[INFO] detecting '{}' tags...".format(args["type"]))
arucoDict = cv.aruco.Dictionary_get(ARUCO_DICT[args["type"]])
arucoParams = cv.aruco.DetectorParameters_create()

print ("[INFO] starting the video stream")
while True:
        try:
            video = VideoStream(src='http://192.168.14.98/').start()          
        except:
            continue
        break
time.sleep(2.0)
while True:

    frame = video.read()
    frame = imutils.resize(frame, width= 1000)
    (corners, ids, rejected) = cv.aruco.detectMarkers(frame, arucoDict, parameters = arucoParams)


    if len(corners)>0:
        #flatten the aruco ids list 
        ids = ids.flatten()

        for (markerCorner,markerID) in zip(corners,ids):
            lis=[]
            dic1={}
            corners = markerCorner.reshape((4,2))
            (topLeft, topRight, bottomRight, bottomLeft) = corners 
            topRight = (int(topRight[0]),int(topRight[1]))
            bottomRight = (int(bottomRight[0]), int(bottomRight[1]))
            bottomLeft = (int(bottomLeft[0]), int(bottomLeft[1]))
            topLeft = (int(topLeft[0]),int(topLeft[1]))

            cv.line(frame, topLeft, topRight, (0,255,0), 2)                
            cv.line(frame, topRight, bottomRight, (0,255,0), 2)
            cv.line(frame, bottomRight, bottomLeft, (0,255,0), 2)
            cv.line(frame, bottomLeft, topLeft, (0,255,0), 2)

            cX = int((topLeft[0] + bottomRight[0]) / 2.0)
            cY = int((topRight[0] + bottomLeft[0]) / 2.0)
            cv.circle(frame, (cX,cY), 4, (0,255,0), -1)

            cv.putText(frame, str(markerID), (topLeft[0], topLeft[1] - 15), cv.FONT_HERSHEY_COMPLEX, 0.5, (0,255,0), 2)
            lis.append(markerID)
            lis.sort()
            if 2 in lis:
                file = open("sample.txt", "a")
                file.writelines("\n" + "Customer1")
                file.close()
            else:
                file = open("sample.txt", "a")
                file.writelines("\n" + "No customer detected")
                file.close()

    cv.imshow("Frame22", frame)
    key = cv.waitKey(1) & 0xFF

    if key == ord("q"):
        break 
    
    
cv.destroyAllWindows()
video.stop()
