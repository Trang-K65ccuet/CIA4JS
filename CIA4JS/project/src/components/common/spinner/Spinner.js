const Spinner = {
    createSpinner(domId) {
        return `
      <div class="text-center h-100 d-inline-block p-8">
        <div class="spinner-grow custom-spinner" id="spinner-${domId}" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      `;
    },
    hideSpinner(domId) {
        document.getElementById(`spinner-${domId}`)
            .style.display = 'none';
    },
    getSpinner(domId) {
        return document.querySelector(`#spinner-${domId}`);
    },
    removeSpinner(domId) {
        this.hideSpinner(domId);
        document.getElementById(`spinner-${domId}`).remove();
    }
}

export default Spinner;