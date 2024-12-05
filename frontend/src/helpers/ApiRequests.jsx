export const ApiRequests = async (url, method, dataSave = "", file = false, token = "") => {

    let options = {
        method: "GET"
    }
    if (method == "GET" || method == "DELETE") {
        options = {
            method: method,
        }
        if (token) {
            options = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        }
    }
    if (method == "POST" || method == "PUT") {
        if (file) {
            options = {
                method: method,
                body: dataSave
            }
            if (token) {
                options = {
                    method: method,
                    body: dataSave,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            }
        } else {
            options = {
                method: method,
                body: JSON.stringify(dataSave),
                headers: {
                    "Content-Type": "application/json"
                }
            }
            if (token) {
                options = {
                    method: method,
                    body: JSON.stringify(dataSave),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            }
        }
    }

    // await new Promise(resolve => setTimeout(resolve, 2000));

    const apirequests = await fetch(url, options);
    // Capturar el status de la respuesta
    const status = apirequests.status;
    // Verifica el estado antes de intentar analizar la respuesta
    let data = null;
    if (status !== 204) {
        data = await apirequests.json();  // Solo intenta parsear JSON si no es 204
    }

    return {
        data,
        status
    }
}