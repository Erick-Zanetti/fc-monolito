import UseCaseInterface from "src/modules/@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";

export default class FindInvoiceUseCase implements UseCaseInterface {
    constructor(private invoiceRepository: InvoiceGateway) {}

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        const invoice: Invoice = await this.invoiceRepository.find(input.id);
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: invoice.address,
            items: invoice.items.map((item: InvoiceItem) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.items.reduce((acc, item) => acc + item.price, 0),
            createdAt: invoice.createdAt,
        };
    }
}