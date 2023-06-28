import Utils from "../../utils/BasicUltils";
import {DOMUtils} from "../../utils/DOMUtils";

const ToastTemplate = {
    createTemplate(mainMsg, otherMsg) {
        return DOMUtils.createElementFromHTML(
            `
                <div id="git-error" class="toast toast-item" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                      <i class="fa-solid fa-triangle-exclamation me-3"></i>
                      <strong class="me-auto">Error</strong>
                      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                      <strong>${mainMsg}</strong>
                      <br>
                      <small>${otherMsg}</small>
                    </div>
                  </div>
                </div>
            `
        );
    },
    addToast(mainMsg, otherMsg) {
      let toastContainer = document.querySelector(".toast-container");
      if (toastContainer) {
          toastContainer.appendChild(ToastTemplate.createTemplate(mainMsg, otherMsg));
      }
    },
    emptyToast() {
        Utils.emptyContentDiv(["#toast-container"]);
    },
    showToast() {
        let toastList = document.querySelectorAll('.toast-item');
        if (toastList) {
            toastList.forEach(toastItem => {
                let toast = new bootstrap.Toast(toastItem)

                toast.show()
            });

        }
    }
}

export default ToastTemplate;