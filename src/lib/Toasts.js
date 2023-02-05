import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"


export function SuccessToast(message) {
    Toastify({
        text: message,
        style: {
        background: "#63bd42"
        }
    }).showToast();
}

export function ErrorToast(message) {
    Toastify({
        text: message,
        style: {
        background: "#cf3a3a"
        }
    }).showToast();
}

export function InfoToast(message) {
    Toastify({
        text: message,
        style: {
        background: "#3b6ba4"
        }
    }).showToast();
}