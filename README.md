### Install & build
```
npm install
npm start
npm run build
```

### Serial Port
https://github.com/nodebots/electron-serialport
https://serialport.io/docs/en/guide-installation

### Chart
https://c3js.org/

### VSCode 에서 메인 프로세스 디버깅하기
https://electronjs.org/docs/tutorial/debugging-main-process-vscode

### electron-rebuild
http://electron.ebookchain.org/ko-KR/tutorial/using-native-node-modules.html

### 패키징
https://jiwondh.github.io/2017/06/23/Electron2/

### Windows 환경에서 npm install 오류

1. Make sure you uninstall Python 3.x.x and downgrade to a 2.x.x version. Remove python 3.x.x. from the [Path](https://www.digitalcitizen.life/how-edit-or-delete-environment-variables-windows-7-windows-8) (not the PATHTEXT) if you had to uninstall it.
2. Follow the instructions found [here](https://github.com/nodejs/node-gyp) on the node-gyp github page. Specifically:
> Install all the required tools and configurations using Microsoft's [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) using `npm install --global --production windows-build-tools` from an elevated PowerShell or CMD.exe (run as Administrator).
