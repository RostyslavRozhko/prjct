$(function(){

    var editBtn = $('.edit-btn');
    var saveBtn = $('.save-btn');
    var editName = $('.edit-name');
    var name = $('#profile-name');
    var description = $('#description');
    var editDesc = $('.edit-desc');

    var SKILLS_LIST = $('#skills-list');

    var addSkill = $('.in-cont');

    var $skillNode = '<span><span class="skill">HTML5</span><span class="delete-btn"></span></span>';

    var skillsArr = [];

    skillsArr.push('HTML5');
    skillsArr.push('Javascript');
    skillsArr.push('Web programming');
    skillsArr.push('Node.js');
    skillsArr.push('CSS3');
    skillsArr.push('Java');

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
        name.text(editName.val());
        name.show();

        editDesc.hide();
        description.text(editDesc.val());
        description.show();

        $('.delete-btn').each(function () {
            $(this).hide();
        });

        addSkill.hide();
    }

    function showBtn(btn) {
        btn.css('display', 'inline-block')
    }

});