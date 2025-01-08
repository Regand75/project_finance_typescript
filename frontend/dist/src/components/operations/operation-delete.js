"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationDelete = void 0;
const operations_service_1 = require("../../services/operations-service");
const modal_1 = require("../modal");
class OperationDelete {
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
                modal_1.ModalManager.hideModal();
                location.href = '#/operations';
            });
        }
        if (this.params && 'id' in this.params) {
            modal_1.ModalManager.showModal(this.params.id);
        }
    }
    async deletedOperation() {
        try {
            if (this.params && 'id' in this.params) {
                const operationResult = await operations_service_1.OperationsService.deleteOperation(`/${this.params.id}`);
                if (operationResult) {
                    modal_1.ModalManager.hideModal();
                    location.href = '#/operations';
                    console.log('DELETED operation');
                }
                else {
                    location.href = '#/';
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.OperationDelete = OperationDelete;
