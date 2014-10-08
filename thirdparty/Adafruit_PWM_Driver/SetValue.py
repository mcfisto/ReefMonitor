#!/usr/bin/python

import sys

from Adafruit_PWM_Servo_Driver import PWM

# read values
channel = int(sys.argv[1])
value = int(sys.argv[2])

# instantiate
pwm = PWM(0x40, debug=True)
# pwm.setPWMFreq(100)

text_file = open("Output.txt", "w")
text_file.write("PWM: "+str(channel)+", "+str(value))
text_file.close()

pwm.setPWM(channel, 0, value)

sys.exit(0)