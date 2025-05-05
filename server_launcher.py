import socket
import subprocess
import os
import threading
import signal
import sys
import atexit
import time
import traceback

# Global process variables so they can be terminated from any function
php_proc = None
yarn_proc = None
processes_started = False

def get_local_ip():
    """Get the local IP address of the machine."""
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
    """Read and print output from a subprocess pipe."""
    for raw in iter(pipe.readline, b""):
        line = raw.decode(errors="replace").rstrip()
        print(f"[{name}] {line}")
    pipe.close()

def terminate_processes():
    """Terminate all running processes gracefully."""
    global php_proc, yarn_proc, processes_started
    
    if not processes_started:
        return
    
    print("\n[SYSTEM] Shutting down servers...")
    
    # Terminate the processes if they're still running
    if php_proc and php_proc.poll() is None:
        print("[SYSTEM] Terminating backend server...")
        try:
            if os.name == 'nt':  # Windows
                subprocess.run(f"taskkill /F /PID {php_proc.pid} /T", shell=True)
            else:  # Unix/Linux
                php_proc.terminate()
                php_proc.wait(timeout=5)
        except Exception as e:
            print(f"[ERROR] Failed to terminate backend: {e}")
    
    if yarn_proc and yarn_proc.poll() is None:
        print("[SYSTEM] Terminating frontend server...")
        try:
            if os.name == 'nt':  # Windows
                subprocess.run(f"taskkill /F /PID {yarn_proc.pid} /T", shell=True)
            else:  # Unix/Linux
                yarn_proc.terminate()
                yarn_proc.wait(timeout=5)
        except Exception as e:
            print(f"[ERROR] Failed to terminate frontend: {e}")
    
    print("[SYSTEM] Servers shut down complete")
    processes_started = False

def signal_handler(sig, frame):
    """Handle termination signals."""
    print("\n[SYSTEM] Received termination signal")
    terminate_processes()
    sys.exit(0)

def run_commands(ip):
    """Run the backend and frontend servers with the given IP."""
    global php_proc, yarn_proc, processes_started
    
    print(f"[SYSTEM] Using IP address: {ip}")
    print("[SYSTEM] Starting servers...\n")
    
    # Get current directory where the script or exe is located
    current_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
    
    # Adjust these if your folders are named differently
    backend_dir = os.path.join(current_dir, "backend")
    frontend_dir = current_dir
    
    print(f"[SYSTEM] Backend directory: {backend_dir}")
    print(f"[SYSTEM] Frontend directory: {frontend_dir}")
    
    # Check if directories exist
    if not os.path.exists(backend_dir):
        print(f"[ERROR] Backend directory does not exist: {backend_dir}")
        print("[SYSTEM] Looking for backend directory...")
        
        # Try to find backend directory in the current directory
        for item in os.listdir(current_dir):
            if os.path.isdir(os.path.join(current_dir, item)) and "backend" in item.lower():
                backend_dir = os.path.join(current_dir, item)
                print(f"[SYSTEM] Found potential backend directory: {backend_dir}")
                break
    
    # Create command strings
    php_cmd_str = f'php artisan serve --host={ip} --port=8000'
    yarn_cmd_str = 'yarn dev'
    
    try:
        # Check if php is available
        try:
            subprocess.run("php --version", shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("[SYSTEM] PHP detected")
        except subprocess.SubprocessError:
            print("[ERROR] PHP not found or not in PATH. Please ensure PHP is installed and in your PATH.")
            raise Exception("PHP not found")
        
        # Check if yarn is available
        try:
            subprocess.run("yarn --version", shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("[SYSTEM] Yarn detected")
        except subprocess.SubprocessError:
            print("[ERROR] Yarn not found or not in PATH. Please ensure Yarn is installed and in your PATH.")
            raise Exception("Yarn not found")
        
        # Run with shell=True so Windows cmd can resolve 'php' and 'yarn'
        print(f"[SYSTEM] Running backend command: {php_cmd_str} in {backend_dir}")
        php_proc = subprocess.Popen(
            php_cmd_str,
            shell=True,
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1,
            universal_newlines=False
        )
        
        print(f"[SYSTEM] Running frontend command: {yarn_cmd_str} in {frontend_dir}")
        yarn_proc = subprocess.Popen(
            yarn_cmd_str,
            shell=True,
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1,
            universal_newlines=False
        )
        
        processes_started = True
        print(f"[SYSTEM] Backend server started with PID: {php_proc.pid}")
        print(f"[SYSTEM] Frontend server started with PID: {yarn_proc.pid}")
        
        # Start reader threads to display output
        threads = []
        for proc, name in ((php_proc, "BACKEND"), (yarn_proc, "FRONTEND")):
            t = threading.Thread(target=stream_reader, args=(proc.stdout, name), daemon=True)
            t.start()
            threads.append(t)
        
        # Wait for one to exit or user termination
        print("\n[SYSTEM] Servers running. Close this window to stop the servers.\n")
        while True:
            if php_proc.poll() is not None:
                print(f"\n[SYSTEM] Backend server exited with code {php_proc.returncode}")
                break
            if yarn_proc.poll() is not None:
                print(f"\n[SYSTEM] Frontend server exited with code {yarn_proc.returncode}")
                break
            time.sleep(0.2)
        
    except Exception as e:
        print(f"[ERROR] Failed to start servers: {e}")
        print("[ERROR] Detailed error information:")
        traceback.print_exc()
    finally:
        terminate_processes()

def main():
    """Main entry point for the application."""
    print("[SYSTEM] Server Launcher Starting...")
    
    # Set up signal handlers for graceful termination
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Register termination function with atexit
    atexit.register(terminate_processes)
    
    # Get IP and run commands
    try:
        ip = get_local_ip()
    except Exception as e:
        print(f"[ERROR] Failed to get local IP: {e}")
        ip = "127.0.0.1"
        print(f"[SYSTEM] Using fallback IP: {ip}")
    
    try:
        run_commands(ip)
    except KeyboardInterrupt:
        print("\n[SYSTEM] Keyboard interrupt detected")
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        print("[ERROR] Detailed error information:")
        traceback.print_exc()
    finally:
        terminate_processes()

if __name__ == "__main__":
    try:
        # If running as standalone script (not bundled)
        main()
    except Exception as e:
        print(f"[CRITICAL ERROR] {e}")
        print("[CRITICAL ERROR] Detailed error information:")
        traceback.print_exc()
    finally:
        print("\n\n[SYSTEM] Press Enter to exit...")
        input()  # This keeps the window open until user presses Enter
else:
    # When imported as a module (for testing/importing)
    pass