import {OperationsService} from "../../services/operations-service.js";
import {ModalManager} from "../modal.js";

export class OperationDelete {
    constructor(parseHash) {
        const { params } = parseHash();
        this.params = params;
        this.buttonNoDeleteElement = document.getElementById('no-delete');
        this.buttonDeleteElement = document.getElementById("modal-delete");

        if (this.buttonDeleteElement) {
            this.buttonDeleteElement.addEventListener('click', this.deletedOperation.bind(this));
        }

        if (this.buttonNoDeleteElement) {
            this.buttonNoDeleteElement.addEventListener('click', () => {
                ModalManager.hideModal();
                location.href = '#/operations';
            });
        }
        ModalManager.showModal(this.params.id);
    }

    async deletedOperation(id) {
        try {
            const operationResult = await OperationsService.deleteOperation(`/${this.params.id}`);
            if (operationResult) {
                ModalManager.hideModal();
                location.href = '#/operations';
                console.log('DELETED operation');
            } else if (operationResult.error) {
                console.log(operationResult.error);
                location.href = '#/';
            }
        } catch (error) {
            console.log(error);
        }
    }
}