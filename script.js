document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    const modal = document.getElementById('game-over-modal');
    const restartBtn = document.getElementById('restart-btn');
    let score = 0;
    const totalStars = 4; // Total number of stars (or items) to match

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
    });

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    }

    function dragEnd(event) {
        event.target.classList.remove('dragging');
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const draggableId = event.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(draggableId);
        let dropZone = event.target;

        // Ensure the dropZone is always the div with data-match attribute
        while (!dropZone.classList.contains('drop-zone') && dropZone !== document.body) {
            dropZone = dropZone.parentElement;
        }

        if (dropZone.getAttribute('data-match') === draggableId) {
            // Hide the outline image
            dropZone.querySelector('img').classList.add('hidden');
            
            // Append the draggable image
            const clonedDraggable = draggable.cloneNode(true);
            clonedDraggable.classList.add('correct-drop');
            clonedDraggable.classList.remove('draggable');
            clonedDraggable.setAttribute('draggable', 'false'); // Disable further dragging of the cloned item
            dropZone.appendChild(clonedDraggable);

            // Hide the original draggable item
            draggable.classList.add('hidden');

            playSound("right");
            updateScore();
        } else {
            playSound('wrong');
        }
    }

    function playSound(id) {
        const audio = new Audio(`sounds/${id}.mp3`);
        audio.play();
    }

    function updateScore() {
        score += 1;
        if (score <= totalStars) {
            document.getElementById(`star${score}`).classList.add('active');
        }
        if (score === totalStars) {
            endGame();
        }
    }

    function endGame() {
        modal.classList.remove('hidden');
        playSound('cheer'); // Ensure you have a cheer sound file in the 'sounds' folder
    }

    restartBtn.addEventListener('click', () => {
        location.reload();
    });
});
