/* Update the result panel */
function updateResultPanel(data) {
    $("#resultPanel").html(data);
}

/* Send request for all tweets */
$(document).ready(function() {
    $("#allTweets").change(function() {
        if ($(this).is(':checked')) {
            $.ajax({
                type: 'GET',
                url: '/getAllTweets/',
                cache: false,
                timeout: 5000,
                success: updateResultPanel
            });
        }
    });
});

/* Send request for all users */
$(document).ready(function() {
    $("#allTwitterUsers").change(function() {
        if ($(this).is(':checked')) {
            $.ajax({
                type: 'GET',
                url: '/getAllTwitterUsers/',
                cache: false,
                timeout: 5000,
                success: updateResultPanel
            });
        }
    });
});

/* Send request for all external links */
$(document).ready(function() {
    $("#allExternalLinks").change(function() {
        if ($(this).is(':checked')) {
            $.ajax({
                type: 'GET',
                url: '/getAllExternalLinks/',
                cache: false,
                timeout: 5000,
                success: updateResultPanel
            });
        }
    });
});

/* Send request for tweet by ID */
$(document).ready(function() {
    $("#tweet").click(function() {
        var tweetId = $("#tweetId").val();
        $.ajax({
            type: 'GET',
            url: '/getTweet?id=' + tweetId + '/',
            cache: false,
            timeout: 5000,
            success: updateResultPanel
        });
    });
});

/* Send request for tweet by ID */
$(document).ready(function() {
    $('#tweetId').keyup(function() {
         if ($("#tweet").is(':checked')) {
            var tweetId = $("#tweetId").val();
            $.ajax({
                type: 'GET',
                url: '/getTweet?id=' + tweetId + '/',
                cache: false,
                timeout: 5000,
                success: updateResultPanel
            });
        }
    });
});

/* Send request for user information by screen name */
$(document).ready(function() {
    $("#userInfo").click(function() {
        var userScreenName = $("#userScreenName").val();
        $.ajax({
            type: 'GET',
            url: '/getUserInfo?screenName=' + userScreenName + '/',
            cache: false,
            timeout: 5000,
            success: updateResultPanel
        });
    });
});

/* Send request for user information by screen name */
$(document).ready(function() {
    $('#userScreenName').keyup(function() {
         if ($("#userInfo").is(':checked')) {
            var userScreenName = $("#userScreenName").val();
            $.ajax({
                type: 'GET',
                url: '/getUserInfo?screenName=' + userScreenName + '/',
                cache: false,
                timeout: 5000,
                success: updateResultPanel
            });
        }
    });
});

/* Send request for searching text in tweets */
$(document).ready(function() {
    $("#searchText").click(function() {
        var targetText = $("#targetText").val();
        $.ajax({
            type: 'GET',
            url: '/searchText?target=' + targetText + '/',
            cache: false,
            timeout: 5000,
            success: updateResultPanel
        });
    });
});

/* Send request for searching text in tweets */
$(document).ready(function() {
    $('#targetText').keyup(function() {
         if ($("#searchText").is(':checked')) {
            var targetText = $("#targetText").val();
            $.ajax({
                type: 'GET',
                url: '/searchText?target=' + targetText + '/',
                cache: false,
                timeout: 5000,
                success: updateResultPanel
            });
        }
    });
});




