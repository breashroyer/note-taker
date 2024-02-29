document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();

    const form = document.getElementById('note-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const noteTitle = document.getElementById('note-title').value;
        const noteText = document.getElementById('note-text').value;
        addNote({ title: noteTitle, text: noteText });
    });
});

function fetchNotes() {
    fetch('http://localhost:3000') // Modify the URL to include http://localhost:3000
        .then((res) => res.json())
        .then((data) => {
            const list = document.getElementById('notes-list');
            list.innerHTML = '';
            data.forEach((note) => {
                const li = document.createElement('li');
                li.textContent = `${note.title}: ${note.text}`;
                list.appendChild(li);
            });
        });
}

function addNote(note) {
    fetch('http://localhost:3000', { // Modify the URL to include http://localhost:3000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    })
    .then((res) => res.json())
    .then((data) => {
        // Add the new note to the list without reloading the page
        const list = document.getElementById('notes-list');
        const li = document.createElement('li');
        li.textContent = `${data.title}: ${data.text}`;
        list.appendChild(li);
        // Reset the form
        document.getElementById('note-form').reset();
    });
}

