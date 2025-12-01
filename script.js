let incidentes = [];
let idAtual = 1;
let incidenteEditando = null;

document.addEventListener('DOMContentLoaded', () => {
    const botoes = document.querySelectorAll("nav button");
    botoes[0].addEventListener('click', () => mostrarSecao('dashboard'));
    botoes[1].addEventListener('click', () => mostrarSecao('registrar'));
    botoes[2].addEventListener('click', () => mostrarSecao('monitorar'));

    mostrarSecao('dashboard');

    document.getElementById('btnRegistrar').addEventListener('click', registrarIncidente);

    document.getElementById('buscar').addEventListener('keyup', atualizarCards);
    document.getElementById('filtroStatus').addEventListener('change', atualizarCards);

    document.querySelector('.close').addEventListener('click', fecharModal);
    document.getElementById('btnSalvarEdicao').addEventListener('click', salvarEdicao);
});

function mostrarSecao(secao){
    document.querySelectorAll('.secao').forEach(s=>s.style.display='none');
    document.getElementById(secao).style.display='block';
    if(secao==='dashboard') atualizarDashboard();
    if(secao==='monitorar') atualizarCards();
}

function registrarIncidente(){
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const statusSelect = document.getElementById('status');

    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const status = statusSelect.value;

    if (!titulo || !descricao) { alert('Preencha todos os campos!'); return; }

    incidentes.push({ id: idAtual++, titulo, descricao, status });

    tituloInput.value = '';
    descricaoInput.value = '';
    statusSelect.value = 'Aberto';

    atualizarDashboard();
    atualizarCards();
    mostrarSecao('monitorar');
}

let grafico;
function atualizarDashboard(){
    atualizarContadores();
    atualizarGrafico();
}
function atualizarContadores(){
    document.getElementById('count-aberto').textContent = incidentes.filter(i=>i.status==='Aberto').length;
    document.getElementById('count-andamento').textContent = incidentes.filter(i=>i.status==='Em andamento').length;
    document.getElementById('count-resolvido').textContent = incidentes.filter(i=>i.status==='Resolvido').length;
}
function atualizarGrafico(){
    const ctx = document.getElementById('graficoStatus').getContext('2d');
    const dados = [
        incidentes.filter(i=>i.status==='Aberto').length,
        incidentes.filter(i=>i.status==='Em andamento').length,
        incidentes.filter(i=>i.status==='Resolvido').length
    ];
    if(grafico) grafico.destroy();
    grafico = new Chart(ctx,{
        type:'doughnut',
        data:{ labels:['Aberto','Em andamento','Resolvido'], datasets:[{data:dados, backgroundColor:['#dc3545','#ffc107','#28a745']}]},
        options:{ 
            maintainAspectRatio: false,
            plugins:{ legend:{ labels:{ color:'#e0e0e0', font:{size:14} } } }, 
            animation:{ animateScale:true, animateRotate:true }
        }
    });
}

const cardsContainer = document.getElementById('cards-incidentes');
function atualizarCards(){
    const busca = document.getElementById('buscar').value.toLowerCase();
    const filtroStatus = document.getElementById('filtroStatus').value;
    cardsContainer.innerHTML='';
    incidentes.filter(i=>{
        const okBusca = i.titulo.toLowerCase().includes(busca);
        const okStatus = filtroStatus==='Todos' || i.status===filtroStatus;
        return okBusca && okStatus;
    }).forEach(i=>{
        const card = document.createElement('div');
        card.className='card';
        card.innerHTML=`
            <h3>${i.titulo}</h3>
            <p>${i.descricao}</p>
            <span class="status ${i.status}">${i.status}</span>
            <div>
                <button onclick="abrirModal(${i.id})">Editar</button>
                <button onclick="removerIncidente(${i.id})">Remover</button>
            </div>`;
        cardsContainer.appendChild(card);
    });
}

function removerIncidente(id){ 
    incidentes = incidentes.filter(i=>i.id!==id);
    atualizarDashboard();
    atualizarCards();
}

const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modal-titulo');
const modalDescricao = document.getElementById('modal-descricao');
const modalStatus = document.getElementById('modal-status');

function abrirModal(id){
    incidenteEditando = incidentes.find(i=>i.id===id);
    modalTitulo.value = incidenteEditando.titulo;
    modalDescricao.value = incidenteEditando.descricao;
    modalStatus.value = incidenteEditando.status;
    modal.style.display = 'flex';
}
function fecharModal(){ modal.style.display = 'none'; }
function salvarEdicao(){
    if(incidenteEditando){
        incidenteEditando.titulo = modalTitulo.value.trim();
        incidenteEditando.descricao = modalDescricao.value.trim();
        incidenteEditando.status = modalStatus.value;
        atualizarDashboard();
        atualizarCards();
        fecharModal();
    }
}
