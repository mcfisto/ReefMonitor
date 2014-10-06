#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM

# initialize
pwm = PWM(0x40, debug=True)
pwm.setPWMFreq(100)

pwm.setAllPWM(0, 4095)