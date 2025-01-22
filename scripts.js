document.addEventListener('DOMContentLoaded', () => {
    const playersList = document.getElementById('players');
    const form = document.getElementById('join-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminControls = document.getElementById('admin-controls');
    const eventsList = document.getElementById('events-list');
    const eventsEditor = document.getElementById('events-editor');
    const updateEventsButton = document.getElementById('update-events');

    // Odczytaj zapisane dane z LocalStorage
    let players = JSON.parse(localStorage.getItem('players')) || []; // Lista graczy
    const savedEvents = localStorage.getItem('events') || ''; // Wydarzenia

    // Inicjalizacja strony
    updatePlayerList(); // Aktualizacja listy graczy na stronie
    eventsList.textContent = savedEvents; // Wyświetlenie zapisanych wydarzeń
    eventsEditor.value = savedEvents; // Ustawienie zapisanych wydarzeń w edytorze

    // Obsługa formularza rejestracji gracza
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const nickname = form['nickname'].value.trim();
        const discord = form['discord'].value.trim();
        const role = form['role'].value;

        // Sprawdzenie, czy gracz o takim nicku już istnieje
        if (players.find(player => player.nickname === nickname)) {
            alert('Gracz o tym nicku już istnieje!');
            return;
        }

        // Dodanie gracza do listy
        const player = { nickname, discord, role };
        players.push(player);
        savePlayers(); // Zapis listy graczy do LocalStorage
        updatePlayerList(); // Aktualizacja widocznej listy graczy
        form.reset();
    });

    // Obsługa logowania do panelu administratora
    adminLoginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const password = document.getElementById('admin-password').value;

        // Sprawdzenie hasła administratora
        if (password === 'tajemnica100') {
            adminControls.style.display = 'block';
            updateAdminPlayerList();
        } else {
            alert('Nieprawidłowe hasło!');
        }
    });

    // Aktualizacja listy wydarzeń
    updateEventsButton.addEventListener('click', () => {
        const newEvents = eventsEditor.value;
        eventsList.textContent = newEvents; // Wyświetlenie nowych wydarzeń na stronie
        localStorage.setItem('events', newEvents); // Zapis wydarzeń do LocalStorage
        alert('Wydarzenia zaktualizowane!');
    });

    // Funkcja zapisu listy graczy do LocalStorage
    function savePlayers() {
        localStorage.setItem('players', JSON.stringify(players));
    }

    // Aktualizacja widocznej listy graczy
    function updatePlayerList() {
        playersList.innerHTML = '';
        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = `${player.nickname} (${player.role})`; // Discord nick nie jest tutaj wyświetlany
            playersList.appendChild(li);
        });
    }

    // Aktualizacja listy graczy w panelu administratora
    function updateAdminPlayerList() {
        const adminPlayerList = document.getElementById('admin-player-list');
        adminPlayerList.innerHTML = '';
        players.forEach((player, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Nick w grze:</strong> ${player.nickname}<br>
                <strong>Discord:</strong> ${player.discord}<br>
                <strong>Rola:</strong> ${player.role}
            `;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Usuń';
            removeButton.addEventListener('click', () => {
                players.splice(index, 1); // Usunięcie gracza z listy
                savePlayers(); // Zapis zaktualizowanej listy graczy do LocalStorage
                updatePlayerList(); // Aktualizacja widocznej listy graczy
                updateAdminPlayerList(); // Aktualizacja panelu administratora
            });
            li.appendChild(removeButton);
            adminPlayerList.appendChild(li);
        });
    }
});
