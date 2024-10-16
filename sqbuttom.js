document.addEventListener('DOMContentLoaded', () => {
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const toggleButton = document.getElementById('toggle-button');
const icon = toggleButton.querySelector('i');

// Estado atual da visualização: desktop, tablet ou mobile
let currentView = 'desktop';

function updatePreview() {
const content = editor.value;
const doc = preview.contentDocument || preview.contentWindow.document;
doc.open();
doc.write(content);
doc.close();
}

// Função para alternar entre desktop, tablet e mobile
function toggleView() {
if (currentView === 'desktop') {
// Muda para visão de tablet
preview.style.width = '65%';  // Visão tablet
preview.style.height = '500px';
icon.classList.remove('fa-desktop');
icon.classList.add('fa-tablet-alt');
currentView = 'tablet';
} else if (currentView === 'tablet') {
// Muda para visão de mobile
preview.style.width = '45%';  // Visão mobile
preview.style.height = '400px';
icon.classList.remove('fa-tablet-alt');
icon.classList.add('fa-mobile-alt');
currentView = 'mobile';
} else {
// Muda para visão de desktop
preview.style.width = '100%';  // Visão desktop
preview.style.height = '100%';
icon.classList.remove('fa-mobile-alt');
icon.classList.add('fa-desktop');
currentView = 'desktop';
}
}

toggleButton.addEventListener('click', toggleView);
editor.addEventListener('input', updatePreview);

// Inicializa o preview
updatePreview();
});