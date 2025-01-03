export class ModalManager {

    static showModal(id, category = null) {
        const modalOverlay = document.getElementById("modal-overlay");
        modalOverlay.dataset.params = JSON.stringify({id: id, category: category}); // сохраняем id и название категории
        modalOverlay.classList.add("active");
        document.body.style.overflow = 'hidden';
    }

    static hideModal() {
        document.getElementById("modal-overlay").classList.remove("active");
        document.body.style.overflow = 'auto';
    }

}
