$(function () {

    var $messages = $('.messages-row');

    var template = '<div class="message"><a><div class="clearfix"><img src="/images/account-icon-8.png" class="pull-left message-img"></a><span style="display: inline-block" class="pull-left"><div class="chat-text-container clearfix pull-left"><span class="author"></span><span class="date"></span><div class="message-body"><p></p></div></div></span></div></div>';

    function showAllMessages(array) {
        $messages.text("");

        function showOneMessage(message){

            var node = $(template);

            node.find('.author').text(message.author.name);
            node.find('a').attr("href", "/partners/"+message.author.url);
            if(message.author.img)
                node.find('img').attr("src", message.author.img);
            var date = new Date(message.date);
            date =  date.getHours() + ":" + (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
            node.find('.date').text(date);
            node.find('.message-body').text(message.body);

            $messages.append(node);
        }

        array.forEach(function (one) {
            showOneMessage(one);
        });

        $messages.scrollTop( 10000000000 );
    }

    function gotoBottom(){
        var div = document.getElementsByClassName("messages-row");
        div.scrollTop = div.scrollHeight + div.clientHeight;
    }

    function init() {
        var url = '/messages/getMessages';
        var chatId = {id: $($messages).data("id")};
        backendPost(url, chatId, function (err, data) {
            if(err)
                console.log(err);
            else {
                showAllMessages(data.messages);
            }
        })
    }

    window.onload = function () {
        init();
    };

    $('#myForm').submit(function () {
        if($('#body').val() != "")
            postMessage();

        return false;
    });

    function postMessage() {
        var url = '/messages/send';
        var data = {
            body: $('#body').val(),
            chatId: $($messages).data("id")
        };
        $('#body').val("");
        backendPost(url,data, function (err, data) {
            if(err)
                console.log(err);
            else
                init();
        });
    }


    function backendPost(url, data, callback) {
        $.ajax({
            url: url,
            type: 'POST',
            contentType : 'application/json',
            data: JSON.stringify(data),
            success: function(data){
                callback(null, data);
            },
            error: function() {
                callback(new Error("Ajax Failed"));
            }
        });
    }


});