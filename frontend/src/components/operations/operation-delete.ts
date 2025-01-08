import {OperationsService} from "../../services/operations-service";
import {ModalManager} from "../modal";
import {OperationsErrorResponse} from "../../types/operations-response.type";

export class OperationDelete {
    readonly params: Record<string, string> | null;
    readonly buttonNoDeleteElement: HTMLElement | null;
    readonly buttonDeleteElement: HTMLElement | null;

    constructor(parseHash: () => { routeWithHash: string; params: Record<string, string> | null }) {
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
        if (this.params && 'id' in this.params) {
            ModalManager.showModal(this.params.id);
        }
    }

    private async deletedOperation(): Promise<void> {
        try {
            if (this.params && 'id' in this.params) {
                const operationResult: OperationsErrorResponse | false = await OperationsService.deleteOperation(`/${this.params.id}`);
                if (operationResult) {
                    ModalManager.hideModal();
                    location.href = '#/operations';
                    console.log('DELETED operation');
                } else {
                    location.href = '#/';
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}