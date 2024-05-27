document.addEventListener('DOMContentLoaded', (event) => {
    const columns = document.querySelectorAll('.column');

    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });
});

let currentColumnId = null;

function showForm(columnId) {
    currentColumnId = columnId;
    document.getElementById('form-container').classList.remove('hide');
}

function hideForm() {
    document.getElementById('form-container').classList.add('hide');
    document.getElementById('add-card-form').reset();
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.classList.add('hide');
    }, 0);
}

function dragEnd(event) {
    event.target.classList.remove('hide');
}

function dragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function drop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);
    if (event.target.classList.contains('column')) {
        event.target.appendChild(card);
    } else {
        event.target.closest('.column').appendChild(card);
    }
}

function addCard(columnId) {
    const column = document.getElementById(columnId);
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.draggable = true;
    newCard.id = 'card-' + crypto.randomUUID(); // Uso de UUID para evitar colisões de IDs

    const cardContent = createCardContent();

    newCard.appendChild(cardContent);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = () => deleteCard(newCard.id);

    newCard.appendChild(deleteBtn);

    const colorBtn = document.createElement('button');
    colorBtn.className = 'color-btn';
    colorBtn.textContent = 'Classificação de Risco';
    colorBtn.onclick = () => changeCardColor(newCard);

    newCard.appendChild(colorBtn);

    newCard.addEventListener('dragstart', dragStart);
    newCard.addEventListener('dragend', dragEnd);

    const addButton = column.querySelector('button');
    column.insertBefore(newCard, addButton.nextSibling);
}

function createCardContent() {
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    cardContent.innerHTML = `
    <div class="bg-white rounded-lg shadow-md p-6 mx-auto my-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">Cliente</h2>
        <form class="flex flex-col space-y-4">
            <input placeholder="Nome do Paciente" class="form-input bg-gray-100 text-gray-900 border-0 rounded-md p-2 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text">
            <input placeholder="Prontuário" class="form-input bg-gray-100 text-gray-900 border-0 rounded-md p-2 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="number">
            <label class="text-sm text-gray-500 cursor-pointer" for="age">
                <p>Data de Nascimento</p>
            </label>
            <input placeholder="Data de Nascimento" class="form-input bg-gray-100 text-gray-900 border-0 rounded-md p-2 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="date">
        </form>
    </div>
    `;
    return cardContent;
}

function deleteCard(cardId) {
    const card = document.getElementById(cardId);
    card.remove();
}

function changeCardColor(card) {
    const colors = ['card-blue', 'card-green', 'card-yellow', 'card-orange', 'card-red', 'card-white'];
    const currentColor = colors.find(color => card.classList.contains(color));
    let newColor;

    if (currentColor) {
        const currentIndex = colors.indexOf(currentColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        newColor = colors[nextIndex];
        card.classList.remove(currentColor);
    } else {
        newColor = colors[0];
    }

    card.classList.add(newColor);
}
