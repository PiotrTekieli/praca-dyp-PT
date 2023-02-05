import axios from "axios"

export async function checkToken() {
    if (!localStorage.getItem("token"))
        return false

    let config = {
        headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
        }
    }

    let tokenValid = (await axios.get(import.meta.env.VITE_HOSTURL + "/auth/checkToken", config).catch(err => {}))
    if (tokenValid && tokenValid.status == 200)
        return true
    else
        return false
}
