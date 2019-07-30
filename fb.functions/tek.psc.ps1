if (Get-Command firebasez -errorAction SilentlyContinue)
{
    "firebase exists"
    cd [path\to\project]\tek-psc\fb.functions
    firebase serve
}else {
    "Firebase do not exists, consider following this
    https://firebase.google.com/docs/cli"
}


