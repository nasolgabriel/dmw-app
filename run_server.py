import socket
import subprocess
import os
import threading

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def stream_reader(pipe, name):
    for raw in iter(pipe.readline, b""):
        line = raw.decode(errors="replace").rstrip()
        print(f"[{name}] {line}")
    pipe.close()

def run_commands(ip):
    print(f"Using IP address: {ip}\n")

    # adjust these if your folders are named differently
    backend_dir = os.path.join(os.getcwd(), "backend")
    frontend_dir = os.getcwd()

    # build command strings
    php_cmd_str = f'php artisan serve --host={ip} --port=8000'
    yarn_cmd_str = 'yarn dev'

    # run with shell=True so Windows cmd can resolve 'php' and 'yarn'
    php_proc = subprocess.Popen(
        php_cmd_str,
        shell=True,
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )
    yarn_proc = subprocess.Popen(
        yarn_cmd_str,
        shell=True,
        cwd=frontend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )

    threads = []
    for proc, name in ((php_proc, "BACKEND"), (yarn_proc, "FRONTEND")):
        t = threading.Thread(target=stream_reader, args=(proc.stdout, name), daemon=True)
        t.start()
        threads.append(t)

    # wait for one to exit
    while True:
        if php_proc.poll() is not None:
            print(f"\n[BACKEND] exited with code {php_proc.returncode}")
            break
        if yarn_proc.poll() is not None:
            print(f"\n[FRONTEND] exited with code {yarn_proc.returncode}")
            break
        threading.Event().wait(0.2)

    # kill the other if still running
    if php_proc.poll() is None:
        php_proc.terminate()
    if yarn_proc.poll() is None:
        yarn_proc.terminate()

    for t in threads:
        t.join()

if __name__ == "__main__":
    ip = get_local_ip()
    run_commands(ip)
