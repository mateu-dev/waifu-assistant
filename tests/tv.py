import samsungctl
import time

config = {
    "name": "samsungctl",
    "description": "PC",
    "id": "",
    "host": "192.168.0.11",
    "port": 55000,
    "method": "legacy",
    "timeout": 10000,
}

with samsungctl.Remote(config) as remote:
    remote.control("KEY_POWEROFF")