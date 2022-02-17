@echo off
echo Building frontend...
cd frontend
call npm run build
cd ..

echo Building win_amd64...
set GOOS=windows
set GOARCH=amd64
go build -ldflags="-s -w -extldflags=-static" -o release/bookmarkmanager_win_amd64.exe .

echo Building win_386...
set GOOS=windows
set GOARCH=386
go build -ldflags="-s -w -extldflags=-static" -o release/bookmarkmanager_win_386.exe .

echo Building linux_amd64...
set GOOS=linux
set GOARCH=amd64
go build -ldflags="-s -w -extldflags=-static" -o release/bookmarkmanager_linux_amd64 .

echo Building linux_386...
set GOOS=linux
set GOARCH=386
go build -ldflags="-s -w -extldflags=-static" -o release/bookmarkmanager_linux_386 .

echo Building linux_arm64...
set GOOS=linux
set GOARCH=arm64
go build -ldflags="-s -w -extldflags=-static" -o release/bookmarkmanager_linux_arm64 .

echo Building linux_arm...
set GOOS=linux
set GOARCH=arm
go build -ldflags="-s -w -extldflags=-static" -o release/bookmarkmanager_linux_arm .

echo Finished. The files are located in ./release
pause