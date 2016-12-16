$(function(){

    var editBtn = $('.edit-btn');
    var saveBtn = $('.save-btn');
    var editName = $('.edit-name');
    var name = $('#profile-name');
    var description = $('#description');
    var editDesc = $('.edit-desc');

    var SKILLS_LIST = $('#skills-list');

    var addSkill = $('#in-cont');

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
        editable = true;

        editBtn.hide();
        showBtn(saveBtn);

        name.hide();
        editName.val(name.text());
        editName.show();

        description.hide();
        editDesc.val(description.text());
        editDesc.show();

        $('.delete-btn').each(function () {
            showBtn($(this));
        });

        addSkill.show();

        $('#add-btn').click(function () {
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
        var editedName = editName.val();
        name.text(editedName);
        name.show();

        editDesc.hide();
        var editedDesc = editDesc.val();
        description.text(editedDesc);
        description.show();

        $('.delete-btn').each(function () {
            $(this).hide();
        });

        addSkill.hide();


        var url = "/partners/edit";
        var data = {
            name: editedName,
            desc: editedDesc,
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

    var IDEA_SKILLS_LIST = $('#idea-skills-list');

    var ideaSkills = [];

    showIdeaSkills(ideaSkills);

    function showIdeaSkills(array){
        IDEA_SKILLS_LIST.empty();
        array.forEach(function (elem, index) {
            var node = $($skillNode);
            node.find('.skill').text(elem);
            var deleteBtn = node.find('.delete-btn');

            deleteBtn.click(function(){
                ideaSkills.splice(index, 1);
                showIdeaSkills(array);
            });
            showBtn(deleteBtn);

            IDEA_SKILLS_LIST.append(node);
        })
    }

    $('#idea-add-btn').click(function () {
        ideaSkills.push($('#idea-add-skill').val());
        $('#idea-add-skill').val("");
        showIdeaSkills(ideaSkills)
    });


    $('#idea-post').click(function () {
        var URL = '/ideas/post';
        var data = {
            title: $('#name').val(),
            shortDesc: $('#shortDesc').val(),
            longDesc: $('#longDesc').val(),
            skills: ideaSkills
        };
        backendPost(URL, data, function (err, data) {
            if(err){
                console.log(err)
            } else {
                window.location.href = data.url;
            }
        })
    });


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

    $("#fileUpload").onchange = function() {
        $("#formImageUpload").submit();
    };

});