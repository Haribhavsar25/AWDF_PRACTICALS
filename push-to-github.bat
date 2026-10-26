@echo off
set "PATH=C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd;%PATH%"
echo ===================================================
echo   AWDF Practicals - Push to GitHub Repository
echo   Remote: https://github.com/Haribhavsar25/AWDF_PRACTICALS.git
echo   Student: Hari Bhavsar (24CS009)
echo ===================================================
git push -u origin main --force
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Practicals successfully pushed to GitHub!
) else (
    echo.
    echo [ERROR] Push failed.
    echo If permission was denied because you are currently logged in as prince7689:
    echo 1. Add prince7689 as a Collaborator with write access to Haribhavsar25/AWDF_PRACTICALS on GitHub, OR
    echo 2. Sign in with Hari Bhavsar's GitHub account in your browser / credential prompt.
)
pause
