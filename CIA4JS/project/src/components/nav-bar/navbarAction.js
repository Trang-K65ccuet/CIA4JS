import { router } from './../../app';
import CentralViewDataManager from "../data-manager/central-view/CentralViewDataManager";

const NavbarAction = {
    handleURL: function() {
        let menu = document.querySelectorAll(".nav-link");

        menu.forEach( (m, i) => {
            menu[i].addEventListener('click', function() {
                switch (i) {
                    case 0:
                        router.navigate('home');
                        break;
                    case 1:
                        router.navigate('projects');
                        break;
                    case 2:
                        router.navigate('workspace/dependency');
                        break;
                    case 3:
                        router.navigate('test');
                        break;
                    case 4:
                        router.navigate('license');
                        break;
                }
            });
        });
    },
}
export default NavbarAction;