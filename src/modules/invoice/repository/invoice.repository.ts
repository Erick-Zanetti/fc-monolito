import Id from "src/modules/@shared/domain/value-object/id.value-object";
import Address from "src/modules/@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceItemModel from "./invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({ where: { id }, include: [{ model: InvoiceItemModel, as: "items" }] });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(invoice.street, invoice.number, invoice.complement, invoice.city, invoice.state, invoice.zipCode),
      items: invoice?.items?.map((item) => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })) ?? [],
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }

  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    }, { include: [{ model: InvoiceItemModel, as: "items" }] });
  }
}
