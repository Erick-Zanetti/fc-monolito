import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacadeInterface from "../facade/invoice.facade.interface";
import InvoiceFacade from "../facade/invoice.facade";

export default class InvoiceFacadeFactory {
    static create(): InvoiceFacadeInterface {
      const repository = new InvoiceRepository();
      const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
      const findInvoiceUseCase = new FindInvoiceUseCase(repository);
      const facade = new InvoiceFacade(generateInvoiceUseCase, findInvoiceUseCase);
      return facade;
    }
  }
  