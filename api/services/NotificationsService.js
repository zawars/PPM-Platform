module.exports.getTemplate = function (projectItem, action, actor) {
    let template = '';

    if (action == 'comment') {
        template = `New Comment has been added by ${actor}`;
    } else {
        template = `${projectItem} has been ${action} by ${actor}`;
    }
    return template;
};