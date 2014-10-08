#!/usr/bin/python

import sys

from Adafruit_PWM_Servo_Driver import PWM

# read values
channel = int(sys.argv[1])
value = int(sys.argv[2])

# instantiate
pwm = PWM(0x40, debug=True)
# pwm.setPWMFreq(100)

print("PWM: ", channel, ", ", value)
pwm.setPWM(channel, 0, value)