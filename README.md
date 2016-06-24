[![Jenkins Status](http://ec2-54-172-176-131.compute-1.amazonaws.com/jenkins/job/testify-build/badge/icon)]

# testify
App that uses external triggers (e.g. AWS IoT Button, Alexa) to run AWS code and publish results back to the physical world via IFTTT.

Adding some nodeclipse sample text.

## Overview

The project consists of several sub-projects, each located in the 'apps' folder.

Each app is a lambda function that deploys independently to AWS Lambda.  As such, each will have its own
package.json file and node_modules dependencies folder.

## Installation

Install the code from github and switch to the project folder.

```
git clone 'xxx'

cd testify

```
Use npm to install project dependencies.

```
npm install

```

Create config files

```
Rename configdata.json.txt to configdata.json

Replace ifttt key with correct IFTTT Key

And other stuff to be added here

```


## Contributors

- Jon Saginaw / jonathan.m.saginaw@accenture.com - Owner

