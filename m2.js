const toggler = document.querySelector('.menu__toggler');
const menu = document.querySelector('.menu');
const closeBtn = document.querySelector('.close__btn');

// Função para alternar o menu
const toggleMenu = () => {
menu.classList.toggle('active');
};

// Adiciona o evento de clique no botão de alternância
toggler.addEventListener('click', (e) => {
e.stopPropagation();
toggleMenu();
});

// Fecha o menu ao clicar no botão "x"
closeBtn.addEventListener('click', (e) => {
e.stopPropagation();
toggleMenu();
});

// Adiciona o evento de clique no documento
document.addEventListener('click', (e) => {
if (menu.classList.contains('active') && !menu.contains(e.target) && !toggler.contains(e.target)) {
toggleMenu();
}
});

// Impede que o clique no menu feche o menu
menu.addEventListener('click', (e) => {
e.stopPropagation();
});