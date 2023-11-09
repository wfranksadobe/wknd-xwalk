export default function decorate(block) {
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  [...block.children].forEach((row, i) => {
    const classes = ['image', 'text'];
    classes.forEach((e, j) => {
      row.children[j].classList.add(`carousel-${e}`);
    });
    const carouselText = row.querySelector('.carousel-text');
    if (!carouselText.innerText.trim()) carouselText.remove();
    /* buttons */
    const button = document.createElement('button');
    button.title = 'Carousel Nav';
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
      [...buttons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');
    });
    buttons.append(button);
  });
  block.parentElement.append(buttons);

  // listener for editor
  window.addEventListener('ue:changedSelectedComponent', (e) => {
    const element = document.querySelector(e.detail);
    if (element.parentElement?.classList.contains('carousel')) {
      element.parentElement.scrollTo({ top: 0, left: element.offsetLeft - element.parentNode.offsetLeft, behavior: 'instant' });

      const nthSlide = element.offsetLeft / element.parentNode.clientWidth;
      const button = block.parentElement.querySelector(`.carousel-buttons > button:nth-child(${nthSlide + 1})`);
      [...buttons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');

      window.dispatchEvent(new Event('ue:requestOverlayUpdate'));
    }
  });
}
