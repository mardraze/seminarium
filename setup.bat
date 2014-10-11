rem call npm install -g generator-ionic
SET PROJECT=Seminarium
rd /S /Q %PROJECT%
mkdir %PROJECT%
cd %PROJECT%
call yo ionic %PROJECT%
rd /S /Q app
rd /S /Q test
xcopy /y /s /e ..\replace\* .
call npm update
call bower update
call grunt platform:add:android
echo call adb install -r platforms\android\ant-build\%PROJECT%-debug-unaligned.apk >> deploy.bat
