# Segeth

## How to run?

To run this project in a docker container you will need to execute the following commands:

```bash
# To build the docker image for the frontend
$ docker build -f Dockerfile.front -t segeth-front:latest .
# To build the docker image for the backend
$ docker build -f Dockerfile.back -t segeth-back:latest .
```

Then you can run the image with:

```bash
# To run our docker image for the frontend
$ docker run --name segeth-app --rm -p 8080:80 segeth-front:latest
# To run our docker image for the backend
$ docker run --name segeth-server --rm -p 5000:5000 segeth-back:latest
```

Or:

```bash
# To run our docker image for the frontend in interactive mode
$ docker run --rm -it -p 8080:80 segeth-front:latest
# To run our docker image for the backend in interactive mode
$ docker run --rm -it -p 5000:5000 segeth-back:latest
```

### Slither

Detectors used:

- reentrancy-eth
- reentrancy-no-eth
- reentrancy-benign
- reentrancy-events
- reentrancy-unlimited-gas

### Roadmap

- Add logging capabilities to golang server
