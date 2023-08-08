from pyirobot import Robot



robot = Robot("192.168.0.16", "MtccDqXskShX|4jXnTd")
robot.StartCleaning()

robot.StopCleaning()
robot.ReturnHome()