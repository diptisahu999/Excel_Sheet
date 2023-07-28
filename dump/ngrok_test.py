import subprocess
import threading
import queue


def ngrokSetup():
    result_queue = queue.Queue()
    thread = ['ngrok http 8090']
    thread = ExampleThread(thread, result_queue)
    thread.start()

# thread class to run a command
class ExampleThread(threading.Thread):
    def __init__(self, cmd, queue):
        threading.Thread.__init__(self)
        self.cmd = cmd
        self.queue = queue

    def run(self):
        # execute the command, queue the result
        status = subprocess.Popen(['ngrok', 'http', '8090'])
        
        self.queue.put((self.cmd, status))
        m = status.wait()
        print(m + '-------------------')
        
    
ngrokSetup()