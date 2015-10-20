function updateResultPanel(data) {
    $("#resultPanel").html(data);
}

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

$(document).ready(function() {
    $("#tweet").change(function() {
        if ($(this).is(':checked')) {
            var tweetId = $("#tweetId").val();
            $.ajax({
                type: 'GET',
                url: '/getTweet/id=' + tweetId + '/',
                cache: false,
                timeout: 5000,
                success: updateResultPanel
            });
        }
    });
});

$(document).ready(function() {
    $("#userInfo").click(function() {
        var userScreenName = $("#userScreenName").val();
        $.ajax({
            type: 'GET',
            url: '/getUserInfo/screenName=' + userScreenName + '/',
            cache: false,
            timeout: 5000,
            success: updateResultPanel
        });
    });
});