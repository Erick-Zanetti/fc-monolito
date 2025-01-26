import UseCaseInterface from "src/modules/@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";
import Invoice from "../../domain/invoice.entity";
import Address from "src/modules/@shared/domain/value-object/address";
import InvoiceItem from "../../domain/invoice-item.entity";
import Id from "src/modules/@shared/domain/value-object/id.value-object";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
    constructor(private invoiceRepository: InvoiceGateway) {}

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const invoice = new Invoice({
            id: new Id(),
            name: input.name,
            document: input.document,
            address: new Address(input.street, input.number, input.complement, input.city, input.state, input.zipCode),
            items: input.items.map((item) => new InvoiceItem({ id: new Id(item.id), name: item.name, price: item.price })),
        });

        await this.invoiceRepository.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item: InvoiceItem) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.items.reduce((acc, item) => acc + item.price, 0),
        };
    }
}