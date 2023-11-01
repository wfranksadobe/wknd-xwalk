async function getContentSourceUrl(owner, repo, ref) {
  const res = await fetch(`https://admin.hlx.page/sidekick/${owner}/${repo}/${ref}/env.json`);
  if (!res || !res.ok) {
    return null;
  }
  const env = await res.json();
  if (!env) {
    return null;
  }
  return env.contentSourceUrl;
}
async function openAemEditor(event) {
  const { owner, repo, ref } = event.detail.data.config;
  const contentSourceUrl = await getContentSourceUrl(owner, repo, ref);
  const path = window.location.pathname;
  const editorUrl = `${contentSourceUrl}${path}?cmd=open`;
  // open the editor in a new tab
  window.open(editorUrl, '_blank');
}

function getButton(sk, selector) {
  let btn = sk.shadowRoot.querySelector(selector);
  if (btn) {
    return btn;
  }
  return new Promise((resolve) => {
    const check = () => {
      btn = sk.shadowRoot.querySelector(selector);
      if (btn) {
        resolve(btn);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

async function overrideEditButton(sk) {
  const oldEditBtn = await getButton(sk, '.edit.plugin');
  const newEditBtn = await getButton(sk, '.aemedit.plugin');
  oldEditBtn.replaceWith(newEditBtn);
  // hack to remove the original edit button that is generated again in the DOM
  const oldEditBtn1 = await getButton(sk, '.edit.plugin');
  oldEditBtn1.remove();
  sk.addEventListener('custom:aemedit', openAemEditor);
}

// eslint-disable-next-line import/prefer-default-export
export function initSidekick() {
  let sk = document.querySelector('helix-sidekick');
  if (sk) {
    // sidekick already loaded
    overrideEditButton(sk);
  } else {
    // wait for sidekick to be loaded
    document.addEventListener('sidekick-ready', () => {
      sk = document.querySelector('helix-sidekick');
      overrideEditButton(sk);
    }, { once: true });
  }
}
