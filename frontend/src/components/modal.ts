export class ModalManager {

    public static showModal(id: string, category: string | null = null): void {
        const modalOverlay: HTMLElement | null = document.getElementById("modal-overlay");
        if (modalOverlay) {
            modalOverlay.dataset.params = JSON.stringify({id: id, category: category}); // сохраняем id и название категории
            modalOverlay.classList.add("active");
        }
        document.body.style.overflow = 'hidden';
    }

    public static hideModal(): void {
        const modalOverlay: HTMLElement | null = document.getElementById("modal-overlay");
        if (modalOverlay) {
            modalOverlay.classList.remove("active");
        }
        document.body.style.overflow = 'auto';
    }

}
