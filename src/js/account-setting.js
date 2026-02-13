document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        settingImg: document.querySelector('#setting-avatar-img'),
        imgFileInput: document.querySelector('#fileInput'),
        navBarAvatarImg: document.querySelector('#header-navbar-avatar'),
        settingName: document.querySelector('#setting-name'),
        settingText: document.querySelector('#setting-text'),
        infoBtnSaveChanges: document.querySelector('#info-btn-save-changes'),
    };

    if (!dom.imgFileInput) return;

    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
        if (dom.settingImg) dom.settingImg.src = savedAvatar;
        if (dom.navBarAvatarImg) dom.navBarAvatarImg.src = savedAvatar;
    }

    dom.imgFileInput.addEventListener('change', () => {
        const file = dom.imgFileInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const avatarBase64 = reader.result;

            // save
            localStorage.setItem('avatar', avatarBase64);

            // update UI
            if (dom.settingImg) dom.settingImg.src = avatarBase64;
            if (dom.navBarAvatarImg) dom.navBarAvatarImg.src = avatarBase64;
        };

        reader.readAsDataURL(file);
    });
    //
    //UPDATE PROFILE
    //
    dom.infoBtnSaveChanges.addEventListener('click', () => {
       const nameValue = dom.settingName.value.trim();
       const bioValue = dom.settingText.value.trim();

        if (!nameValue) return;

       localStorage.setItem('username', nameValue);
       localStorage.setItem('userBio', bioValue);
    });
});