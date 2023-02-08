import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"

export function SuccessToast(message) {
    Toast(message, "#63bd42")
}

export function ErrorToast(message) {
    Toast(message, "#cf3a3a")
}

export function InfoToast(message) {
    Toast(message, "#3b6ba4")
}

function Toast(message, color) {
    let toast = Toastify({
        text: message ?? "Something went wrong",
        close: true,
        onClick: () => toast.hideToast(),
        style: {
            background: color,
            border: "1px var(--fontColor) solid",
        }
    }).showToast();
}