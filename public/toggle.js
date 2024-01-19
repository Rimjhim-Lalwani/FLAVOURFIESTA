const menuToggle = document.querySelector('.menuToggle');
const navigation = document.querySelector('.navigation');

        menuToggle.onclick = function () {
            menuToggle.classList.toggle('active');
            navigation.classList.toggle('active');

        }

        for (let i = 0; i < 4; i++) {
            let ele = navigation.children[i];
            ele.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navigation.classList.toggle('active');
            })

        }

        window.addEventListener('scroll', function () {
            const header = document.querySelector('header');
            header.classList.toggle('sticky', window.scrollY > 0);

        })
        modules.export= menuToggle;
        modules.export= navigation;