#!/usr/bin/python

import sys

from Adafruit_PWM_Servo_Driver import PWM

# read values
channel = sys.argv[1];
value = sys.argv[2];

# instantiate
pwm = PWM(0x40, debug=True)

pwm.setPWM(channel, 0, value)