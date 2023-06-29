export const Notifier = {
    displayProcessingTask(message) {
        Notifier.removeNotification();
        const htmlTag = '<div id="wait_msg" class="alert alert-info" style="z-index: 1000; position:fixed;bottom:10px;right:10px;"><a href="#" class="close" data-dismiss="alert" aria-label="close"></a><i class="fa fa-refresh fa-spin"></i>&nbsp;<strong>' + message + '</strong></div>';
        $('body').append(htmlTag);
    },

    displayError(message) {
        Notifier.removeNotification();
        const htmlTag = '<div id="error_msg" class="alert alert-danger animated fadeInDown " style="z-index: 1000; position:fixed;bottom:10px;right:10px;"><a href="#" class="close" data-dismiss="alert" aria-label="close"></a><i class="fa fa-exclamation-triangle"></i>&nbsp;<strong>' + message + '</strong></div>';
        $('body').append(htmlTag);

        setTimeout(() => {
            $("#error_msg").remove();
        }, 3000);
    },

    removeNotification() {
       $("#wait_msg").remove();
    }
};

export const Prompter = {
    prompt(message, defaultValue) {
        return prompt(message, defaultValue);
    }
};