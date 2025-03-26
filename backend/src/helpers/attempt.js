async function attempt(callback, maxAttempts){
    let attempts = 0;
    let lastError = null
    while(attempts < maxAttempts){
        try{
            return [null, await callback()]
        }catch(e){
            attempts++;
            lastError = e;
            if(attempts === maxAttempts){
                result = [lastError, null]
            }
        }
    }
}

module.exports = {
    attempt
}