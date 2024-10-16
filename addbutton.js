document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const historyContainer = document.getElementById('history');
    let history = [];

    function getCodeFromScript(id) {
        const script = document.getElementById(id);
        return script ? JSON.parse(script.textContent).code : '';
    }

    function updatePreview() {
        const content = editor.value;
        const doc = preview.contentDocument || preview.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
    }

    function addToHistory(code) {
        if (code && !history.includes(code)) {
            history.push(code);
            renderHistory();
        }
    }

    function renderHistory() {
        historyContainer.innerHTML = '';
        history.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = entry.slice(0, 30) + '...';
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => {
                deleteFromHistory(index);
            };
            item.appendChild(deleteButton);
            historyContainer.appendChild(item);
        });
    }

    function deleteFromHistory(index) {
        const removedEntry = history.splice(index, 1)[0];
        // Atualiza o editor removendo a entrada excluída
        let updatedCode = editor.value;
        while (updatedCode.includes(removedEntry)) {
            updatedCode = updatedCode.replace(removedEntry, '');
        }
        editor.value = updatedCode;
        updatePreview();
        renderHistory();
    }

    function addElement(elementType, elementId, alertMsg) {
        const elementCode = getCodeFromScript(elementId);
        let currentCode = editor.value;

        if (currentCode.includes(elementCode)) {
            alert(alertMsg);
            return;
        }

        const bodyCloseTag = '</body>';
        const insertionPoint = currentCode.indexOf(bodyCloseTag);

        if (insertionPoint !== -1) {
            currentCode = currentCode.slice(0, insertionPoint) + elementCode + currentCode.slice(insertionPoint);
        } else {
            currentCode += elementCode;
        }

        editor.value = currentCode;
        updatePreview();
        addToHistory(elementCode);
    }

    function addHeader() {
        addElement('header', 'header-code', 'Cabeçalho já presente no código.');
    }

    function addFooter() {
        addElement('footer', 'footer-code', 'O rodapé já está presente no código.');
    }

    function copyCode() {
        editor.select();
        document.execCommand('copy');
        alert('Código copiado');
    }

    function saveState() {
        localStorage.setItem('editorContent', editor.value);
        alert('Sua página foi salva.');
    }

    function deleteState() {
        if (localStorage.getItem('editorContent')) {
            const confirmDelete = confirm('Tem certeza de que deseja excluir o projeto salvo?');
            if (confirmDelete) {
                localStorage.removeItem('editorContent');
                alert('Excluído com sucesso!');
                editor.value = '';
                updatePreview();
            }
        } else {
            alert('Não há nada salvo para excluir.');
        }
    }

    function addCustomElement(elementId, alertMsg) {
        const elementCode = getCodeFromScript(elementId);
        let currentCode = editor.value;

        const insertionPoint = currentCode.indexOf('</body>');
        if (insertionPoint !== -1) {
            currentCode = currentCode.slice(0, insertionPoint) + elementCode + currentCode.slice(insertionPoint);
            editor.value = currentCode;
            updatePreview();
            addToHistory(elementCode);
        } else {
            alert('Error: Could not find the position to add the element.');
        }
    }

    document.getElementById('add-header').addEventListener('click', (event) => { event.preventDefault(); addHeader(); });
    document.getElementById('add-footer').addEventListener('click', (event) => { event.preventDefault(); addFooter(); });
    document.getElementById('copy-button').addEventListener('click', copyCode);
    document.getElementById('save-state-button').addEventListener('click', saveState);
    document.getElementById('delete-state-button').addEventListener('click', deleteState);
    document.getElementById('add-div').addEventListener('click', (event) => { event.preventDefault(); addCustomElement('div-code', 'Div já presente no código.'); });
    document.getElementById('add-article').addEventListener('click', (event) => { event.preventDefault(); addCustomElement('article-code', 'Article já presente no código.'); });
    document.getElementById('add-aside').addEventListener('click', (event) => { event.preventDefault(); addCustomElement('aside-code', 'Aside já presente no código.'); });
    document.getElementById('add-nav').addEventListener('click', (event) => { event.preventDefault(); addCustomElement('nav-code', 'Nav já presente no código.'); });
    document.getElementById('add-section').addEventListener('click', (event) => { event.preventDefault(); addCustomElement('section-code', 'Section já presente no código.'); });

    // Atualize a pré-visualização inicial
    updatePreview();
});