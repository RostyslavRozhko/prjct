$(function(){

    var editBtn = $('#edit-btn');
    var saveBtn = $('#save-btn');

    var editName = $('.edit-title');
    var name = $('.title');

    var description = $('#desc-short');
    var editDesc = $('.edit-textarea-short');

    var descriptionLong = $('#desc-long');
    var editDescLong = $('.edit-textarea-long');

    var SKILLS_LIST = $('#skills-list');

    var addSkill = $('.in-cont');

    var $skillNode = '<span><span class="skill">HTML5</span><span class="delete-btn"></span></span>';


    if(name == "" || skillsArr.length == 0){
        editProfile();
    }

    showSkills(skillsArr);

    var editable = false;

    function showSkills(array) {
        SKILLS_LIST.empty();
        array.forEach(function (elem, index) {
            var node = $($skillNode);
            node.find('.skill').text(elem);
            var deleteBtn = node.find('.delete-btn');

            deleteBtn.click(function(){
                skillsArr.splice(index, 1);
                showSkills(array);
            });
            if(editable) showBtn(deleteBtn);

            SKILLS_LIST.append(node);
        })

    }

    editBtn.click(function () {
        editProfile();
    });

    saveBtn.click(function () {
        saveProfile();
    });

    function editProfile(){
        console.log("fuck");
        editable = true;

        editBtn.hide();
        showBtn(saveBtn);

        name.hide();
        editName.val(name.text());
        editName.show();

        description.hide();
        editDesc.val(description.text());
        editDesc.show();

        descriptionLong.hide();
        editDescLong.val(descriptionLong.text());
        editDescLong.show();

        $('.delete-btn').each(function () {
            showBtn($(this));
        });

        addSkill.show();

        $('.add-btn').click(function () {
            skillsArr.push($('.add-skill').val());
            $('.add-skill').val("");
            showSkills(skillsArr)
        })

    }

    function saveProfile() {
        editable = false;

        saveBtn.hide();
        showBtn(editBtn);

        editName.hide();
        var title = editName.val();
        name.text(title);
        name.show();

        editDesc.hide();
        var shortDesc = editDesc.val();
        description.text(shortDesc);
        description.show();

        editDescLong.hide();
        var longDesc = editDescLong.val();
        descriptionLong.text(longDesc);
        descriptionLong.show();

        $('.delete-btn').each(function () {
            $(this).hide();
        });

        addSkill.hide();

        var url = "/ideas/edit";
        var data = {
            _id: _id,
            title: title,
            shortDesc: shortDesc,
            longDesc: longDesc,
            skills: skillsArr
        };

        backendPost(url, data, function (err, data) {
            if(err)
                console.log(err);
            else
                location.reload();
        })
    }

    function showBtn(btn) {
        btn.css('display', 'inline-block')
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
        })
    }

    $('#delete-btn').click(function () {
        var url = "/ideas/delete";
        var data  = {
            _id: _id
        };
        backendPost(url , data, function (err, data) {
            if(err)
                console.log(err);
            else
                window.location.href = data.url;
        })
    });

    $('#send-btn').click(function () {
        var url = "/messages/createChat";
        var data = {
            href: $(this).data("href")
        };

        backendPost(url , data, function (err, data) {
            if(err)
                console.log(err);
            else
                window.location.href = "/messages/"+data.url;
        })
    });

});