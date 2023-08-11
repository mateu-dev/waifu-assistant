from gpt4free import you
import time

response = you.Completion.create(
    prompt="Hello",
    detailed=True,
    include_links=False, )

chat = []

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

class MyRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/message'):
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            question = query_params.get('q', ['Hello'])[0]

            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()

            response = ask(question)
            while response.text == "Unable to fetch the response, Please try again.":
                response = ask(question)
                time.sleep(0.5)
            
            self.wfile.write(response.text.encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write("Not found.".encode('utf-8'))

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, MyRequestHandler)
    print(f"Server is running on http://localhost:{port}/message")
    httpd.serve_forever()

def ask(q):
    response = you.Completion.create(prompt=q,chat=chat)
    chat.append({"question": q, "answer": response.text})
    return response

if __name__ == '__main__':
    run_server()

