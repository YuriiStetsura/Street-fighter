import { showModal } from './modal'
import { createElement } from '../../helpers/domHelper'
import { createFighterImage } from '../fighterPreview';
import App from '../../app';

export function showWinnerModal(fighter) {
  // call showModal function 

  const root = document.getElementById('root');
  const bodyElement = createElement({ tagName: 'div', className: 'modal-body' });
  const fighterName = createElement({ tagName: 'p', className: 'fighter-name' });
  const fighterImage = createFighterImage(fighter);

  fighterName.innerText = fighter.name;
  fighterName.style.cssText = 'text-align: center'
  fighterImage.style.cssText = 'display: block; margin: 0 auto;'

  bodyElement.append(fighterName, fighterImage);

  showModal({
    title: 'Winner',
    bodyElement,
    onClose: () => {
      root.innerHTML = '';
      new App();
    },
  });
}

