# Order API
## Getting Started
In order to run these files, first make sure you have [node.js](https://nodejs.org/en/download) installed on your local system.

You will also need this repository cloned onto your local computer.

## Running the API
Run `npm ci` in the project directory to install all the necessary packages using the same version for each as was used for development.

Once all the packages have been installed, run `node app.js` and the server will start running on Port 3000.


## Running the API on a VM with Ansible
This project automates the deployment of a Node.js Order Processing API onto an Amazon Linux 2023 EC2 instance using Ansible. The application utilizes a localized SQLite database mapped to persistent storage.

### Prerequisites & Dependencies

#### Local Machine (Your Mac)

- Ansible: Installed locally to run the deployment playbooks.
- SSH Key: Your AWS `.pem` private key file (e.g., `820Class.pem`).

#### Remote Server (EC2 VM)

- OS: Amazon Linux 2023 (Fedora-based).
- Open Ports: Port `3000` must be accessible in your AWS Security Group if you wish to query the API externally.

### How to Run the Playbooks

#### 1. Deployment

Execute the deployment playbook by feeding your host IP and private key directly into the terminal execution string:

```bash
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i "YOUR_VM_IP," -u ec2-user --private-key /path/to/your/820Class.pem deploy.yaml
```

#### 2. Rollback

If you need to tear down the environment or revert changes, execute the rollback playbook:

```bash
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i "YOUR_VM_IP," -u ec2-user --private-key /path/to/your/820Class.pem rollback.yaml
```

### How to Run Verification Scripts

A custom bash script can be executed locally on your machine or on the remote VM to evaluate whether the application is responding as expected.

Pass your VM's IP address directly as a positional argument:

```bash
# 1. Grant execution rights
chmod +x test.sh

# 2. Run the script with your IP
./test.sh YOUR_VM_IP
```

### How to Access the Deployed Application

Once the service reports a successful 200 OK status from the verification script, open a browser or run a cURL hit targeting the mapped port:

- Internal (On the VM): `curl localhost:3000`
- External (Browser): `http://YOUR_VM_IP:3000`
- Targeting Endpoint: `http://YOUR_VM_IP:3000/orders`

### Known Issues & Limitations

- GLIBC Version Constraints: Standard pre-compiled NPM modules target GLIBC 2.38. Because Amazon Linux 2023 operates strictly on GLIBC 2.34, the package.json requires sqlite3 version "5.1.7" to run properly on the VM.
