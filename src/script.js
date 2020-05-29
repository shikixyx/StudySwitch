app_array = ["LINE", "Slack", "TweetDeck"]
for (let app_name of app_array) {
    var app = Application(app_name)
    if (app.running()) {
        app.quit()
    }
}

var focus_app = Application("Focus To-Do")
focus_app.activate()