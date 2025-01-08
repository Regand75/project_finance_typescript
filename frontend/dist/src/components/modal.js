"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalManager = void 0;
class ModalManager {
    static showModal(id, category = null) {
        const modalOverlay = document.getElementById("modal-overlay");
        if (modalOverlay) {
            modalOverlay.dataset.params = JSON.stringify({ id: id, category: category }); // сохраняем id и название категории
            modalOverlay.classList.add("active");
        }
        document.body.style.overflow = 'hidden';
    }
    static hideModal() {
        const modalOverlay = document.getElementById("modal-overlay");
        if (modalOverlay) {
            modalOverlay.classList.remove("active");
        }
        document.body.style.overflow = 'auto';
    }
}
exports.ModalManager = ModalManager;
