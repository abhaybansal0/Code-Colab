const Languages = {
    "javascript":"18.15.0",
    "c++":"10.2.0",
    "c":"10.2.0",
    "go": "1.16.2",
    "java":"15.0.2",
    "php":"8.2.3",
    "python":"3.10.0",

}


const ExecuteCode = async (codedata, language, input) => {

    const inputData = {
        "language": language,
        "version": Languages[language],
        "files": [
            {
                "content": codedata
            }
        ],
        'stdin': input
    }

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
    })

    const outputData = await response.json();

    // console.log(Languages[language]);
    
    // const languages = await fetch('https://emkc.org/api/v2/piston/runtimes');
    // const semidata = await languages.json();


    // console.log(semidata);

    return outputData;


}

export default ExecuteCode