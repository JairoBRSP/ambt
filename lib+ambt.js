document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const cssFilter = document.getElementById('filter-css');
    const jsFilter = document.getElementById('filter-js');
    const libraryList = document.getElementById('library-list');
    const libNameInput = document.getElementById('lib-name');
    const libVersionInput = document.getElementById('lib-version');
    const libTypeInput = document.getElementById('lib-type');
    const libUrlInput = document.getElementById('lib-url');
    const addLibButton = document.getElementById('add-lib');
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');

    const storedLibraries = localStorage.getItem('libraryList');
    const libraries = storedLibraries ? JSON.parse(storedLibraries) : [
        { name: 'Bootstrap', version: '5.3.0', type: 'css', url: 'https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css' },
        { name: 'Tailwind CSS', version: '3.2.1', type: 'css', url: 'https://cdn.tailwindcss.com' },
        { name: 'Bulma', version: '0.9.4', type: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.4/css/bulma.min.css' },
        { name: 'Foundation', version: '6.7.0', type: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.7.0/css/foundation.min.css' },
        { name: 'Materialize', version: '1.0.0', type: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css' },
        { name: 'jQuery', version: '3.6.0', type: 'js', url: 'https://code.jquery.com/jquery-3.6.0.min.js' },
        { name: 'React', version: '18.2.0', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js' },
        { name: 'Vue', version: '3.2.47', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.global.prod.js' },
        { name: 'Angular', version: '15.1.1', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js' },
        { name: 'D3.js', version: '7.9.1', type: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.1/d3.min.js' },
    ];

    function saveLibraryList() {
        localStorage.setItem('libraryList', JSON.stringify(libraries));
    }

    function extractLibraryInfo(url) {
        const type = url.endsWith('.css') ? 'css' : 'js';
        const name = url.split('/').pop().split('.')[0];
        const version = url.match(/(\d+\.\d+\.\d+)/)?.[0] || 'Desconhecida';
        return { name, version, type };
    }

    function updateFieldsFromUrl() {
        const url = libUrlInput.value.trim();
        if (url) {
            const { name, version, type } = extractLibraryInfo(url);
            libNameInput.value = name;
            libVersionInput.value = version;
            libTypeInput.value = type;
        } else {
            libNameInput.value = '';
            libVersionInput.value = '';
            libTypeInput.value = '';
        }
    }

    function updateList() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterCss = cssFilter.checked;
        const filterJs = jsFilter.checked;
        libraryList.innerHTML = '';

        if (!filterCss && !filterJs) {
            return;
        }

        const filteredLibraries = libraries
            .filter(lib => (filterCss && lib.type === 'css') || (filterJs && lib.type === 'js'))
            .filter(lib => lib.name.toLowerCase().includes(searchTerm));

        filteredLibraries.forEach(lib => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = lib.url;
            link.textContent = `${lib.name} - ${lib.version}`;
            link.target = '_blank';
            link.onclick = (e) => {
                e.preventDefault();
                toggleLibrary(lib.name, lib.url, lib.type);
            };
            listItem.appendChild(link);
            libraryList.appendChild(listItem);
        });
    }

    function toggleLibrary(name, url, type) {
        const currentCode = editor.value;
        const startTag = type === 'css' ? `<link rel="stylesheet" href="${url}">` : `<script src="${url}"><\/script>`;
        
        const regex = new RegExp(`\\s*${startTag}\\s*`, 'g');

        if (currentCode.match(regex)) {
            // Remove the library
            const newCode = currentCode.replace(regex, '');
            editor.value = newCode;
            alert(`${name} foi removido do código.`);
        } else {
            // Insert the library
            let insertionPoint;
            if (type === 'css') {
                insertionPoint = currentCode.search(/<style\b[^>]*>/i);
                if (insertionPoint === -1) {
                    insertionPoint = currentCode.indexOf('</head>'); // Adiciona no final do <head> se não encontrar <style>
                }
            } else {
                insertionPoint = currentCode.indexOf('</body>');
                if (insertionPoint === -1) {
                    insertionPoint = currentCode.length; // Adiciona no final do código se não encontrar </body>
                }
            }

            const newCode = type === 'css'
                ? currentCode.slice(0, insertionPoint) + `\n<link rel="stylesheet" href="${url}">\n` + currentCode.slice(insertionPoint)
                : currentCode.slice(0, insertionPoint) + `\n<script src="${url}"><\/script>\n` + currentCode.slice(insertionPoint);
            
            editor.value = newCode;
            alert(`${name} foi inserido no código`);
        }
        updatePreview();
    }

    function addOrUpdateLibrary() {
        const name = libNameInput.value.trim();
        const version = libVersionInput.value.trim();
        const type = libTypeInput.value.trim().toLowerCase();
        const url = libUrlInput.value.trim();

        if (name && version && (type === 'css' || type === 'js') && url) {
            const existingLibraryIndex = libraries.findIndex(lib => lib.name.toLowerCase() === name.toLowerCase());

            if (existingLibraryIndex > -1) {
                libraries[existingLibraryIndex] = { name, version, type, url };
                alert(`${name} foi atualizado na lista`);
            } else {
                libraries.push({ name, version, type, url });
                alert(`${name} foi adicionado à lista`);
            }

            saveLibraryList();

            // Limpar campos após adicionar/atualizar
            libNameInput.value = '';
            libVersionInput.value = '';
            libTypeInput.value = '';
            libUrlInput.value = '';

            updateList();
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    }

    function updatePreview() {
        const content = editor.value;
        const doc = preview.contentDocument || preview.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
    }

    function loadState() {
        if (localStorage.getItem('editorContent')) {
            const confirmLoad = confirm('Há um estado salvo. Deseja carregar?');
            if (confirmLoad) {
                editor.value = localStorage.getItem('editorContent');
                updatePreview();
            }
        }
    }

    searchInput.addEventListener('input', updateList);
    cssFilter.addEventListener('change', updateList);
    jsFilter.addEventListener('change', updateList);
    addLibButton.addEventListener('click', addOrUpdateLibrary);
    editor.addEventListener('input', updatePreview);
    libUrlInput.addEventListener('input', updateFieldsFromUrl);

    cssFilter.checked = true;
    updateList();
    updatePreview();

    function openNav() {
        document.getElementById("mySidebar").style.width = "200px";
        document.getElementById("mainContent").classList.add("open");
        document.getElementById("overlay").style.display = "block";
    }

    function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("mainContent").classList.remove("open");
        document.getElementById("overlay").style.display = "none";
    }

    document.getElementById("overlay").addEventListener("click", closeNav);
    document.getElementById("openNav").addEventListener("click", openNav);

    loadState(); // Chamada para carregar o estado ao iniciar
});