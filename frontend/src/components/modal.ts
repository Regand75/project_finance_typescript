export class ModalManager {

    public static showModal(id: number, category: string | null = null): void {
        const modalOverlay: HTMLElement | null = document.getElementById("modal-overlay");
        if (modalOverlay) {
            modalOverlay.dataset.params = JSON.stringify({id: id, category: category}); // сохраняем id и название категории
            modalOverlay.classList.add("active");
        }
        document.body.style.overflow = 'hidden';
    }

    public static hideModal(): void {
        document.getElementById("modal-overlay").classList.remove("active");
        document.body.style.overflow = 'auto';
    }

}
