#!/usr/bin/python 
import serial
print "Welcome to the Atlas Scientific Raspberry Pi example."
usbport = '/dev/ttyAMA0'
ser = serial.Serial(usbport, 38400)
# turn on the LEDs
# ser.write("Z6\r")
ser.write("\r")
ser.write("E\r")
ser.write("R\r")
ser.write("L1\r")
line = ""
while True:
 data = ser.read()
 if(data == "\r"):
 	print "Received from sensor:" + line
 	line = ""
	#ser.write("E\r")
 else:
 	line = line + data
